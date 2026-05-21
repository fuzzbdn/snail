import { StorageManager, Utils, getEntryStatus } from '../core/storage.js';
import { showToast } from '../core/ui.js';

// ==========================================
// GLOBALA VARIABLER FÖR PROJEKTERING
// ==========================================
let allCsvItems = [];
let mainStartMeters = 0, mainEndMeters = 0;

// ==========================================
// INITIALISERING AV SIDAN
// ==========================================
export function initProjekteraPage() {
    setupProjekteraUI();
    initCsvData();
    initRouteTables();

    document.getElementById("searchKm")?.addEventListener("input", function() {
        const val = this.value.trim();
        const dropdown = document.getElementById("entryDropdown"); 
        if (!val || !dropdown) return;
        
        const target = Utils.toMeters(val);
        const sorted = allCsvItems
            .map(i => ({...i, dist: Math.abs(i.sortKey - target)}))
            .sort((a,b) => a.dist - b.dist)
            .slice(0, 10);
        
        dropdown.innerHTML = sorted.map(i => `<option value='${i.value}'>${i.label}</option>`).join("");
    });
}

function setupProjekteraUI() {
    const select = document.getElementById("entrySelect");
    const saveBtn = document.getElementById("saveProjekteringBtn"); 
    let currentEntryIndex = null;

    const loadDropdown = () => {
        const entries = StorageManager.getAll();
        if (entries.length) {
            select.innerHTML = "<option value=''>Välj post...</option>" + 
            entries.map((e, i) => {
                const status = getEntryStatus(e);
                if (status === 'granskad') return '';

                let icon = "⭕"; 
                if(status === 'projekterad') icon = "⚒️"; 
                
                return `<option value="${i}">${icon} ${e.timestamp?.slice(0,10)} — ${e.planerare} (${e.nedstracka || '?'})</option>`;
            }).join("");
        } else {
            select.innerHTML = "<option>Ingen data hittades</option>";
        }
    };
    loadDropdown();

    select.addEventListener("change", (e) => {
        const idx = e.target.value;
        const allData = StorageManager.getAll();

        if (idx === "") {
            currentEntryIndex = null;
            if(saveBtn) saveBtn.disabled = true;
            document.getElementById("routes-container").innerHTML = "";
            window.addNewRouteBlock(); 
            return;
        }
        
        currentEntryIndex = parseInt(idx);
        const entry = allData[currentEntryIndex];
        
        const set = (id, v) => { const el = document.getElementById(id); if(el) el.value = v || ''; };
        
        set("orsaktext", entry.textmeddelande);
        set("sth", entry.sth);
        set("axellast", entry.axellast);
        set("taglangd", entry.taglangd);
        set("riktning", entry.riktning);
        set("spar", entry.spar);
        set("identitet", `${entry.start_km}${entry.start_m}_${entry.slut_km}${entry.slut_m}_${entry.sth}`);
        set("stracka", `${entry.start_km}+${entry.start_m} - ${entry.slut_km}+${entry.slut_m}`);

        if (entry.stallverkstyp) set("stallverkstyp", entry.stallverkstyp);
        if (entry.rbc) set("rbc", entry.rbc);
        if (entry.passerar) set("passerar", entry.passerar);

        restoreRoutes(entry.routeData);

        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.style.cursor = "pointer";
            saveBtn.style.backgroundColor = "#007bff";
        }
        mainStartMeters = Utils.toMeters(`${entry.start_km}+${entry.start_m}`);
        mainEndMeters = Utils.toMeters(`${entry.slut_km}+${entry.slut_m}`);
        
        document.getElementById('passerarText').style.display = (entry.passerar === 'Ja') ? 'block' : 'none';
        recalcAllRows();
    });

    document.getElementById('passerar')?.addEventListener('change', function() {
        document.getElementById('passerarText').style.display = (this.value === 'Ja') ? 'block' : 'none';
    });

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            if (currentEntryIndex === null) return;

            const currentData = StorageManager.getAll();
            const entryToUpdate = currentData[currentEntryIndex];
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

            entryToUpdate.stallverkstyp = document.getElementById("stallverkstyp").value;
            entryToUpdate.rbc = document.getElementById("rbc").value;
            entryToUpdate.passerar = document.getElementById("passerar").value;
			entryToUpdate.identitet = document.getElementById("identitet").value;
			
            const savedBlocks = [];
            document.querySelectorAll(".route-block").forEach(block => {
                const rows = [];
                block.querySelectorAll("tbody tr").forEach(tr => {
                    const selects = tr.querySelectorAll("select");
                    const inputs = tr.querySelectorAll("input");
                    rows.push({
                        pos: selects[0].value,
                        type: selects[1].value,
                        objVal: selects[2].value,
                        dir: selects[3].value,
                        side: selects[4].value,
                        km: inputs[0].value,
                        offset: inputs[1].value
                    });
                });
                savedBlocks.push(rows);
            });
            entryToUpdate.routeData = savedBlocks;
            entryToUpdate.status = "projekterad";
            entryToUpdate.projectedDate = new Date().toISOString();
            entryToUpdate.projekteradAv = currentUser.name || "Okänd";

            const tableRows = document.querySelectorAll(".control-table tbody tr");
            if (tableRows.length >= 2) {
                const sakerhetsDatum = tableRows[1].querySelectorAll("input")[0].value;
                const sakerhetsSign = tableRows[1].querySelectorAll("input")[1].value;
                
                if (sakerhetsSign) {
                    entryToUpdate.sakerhetsgranskadAv = sakerhetsSign;
                    entryToUpdate.sakerhetsgranskadDatum = sakerhetsDatum ? new Date(sakerhetsDatum).toISOString() : new Date().toISOString();
                }
            }

            StorageManager.saveAll(currentData);
            showToast("Projektering sparad! Status ändrad till 'Projekterad'.", "success");

            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) selectedOption.innerHTML = selectedOption.innerHTML.replace("⭕", "⚒️");
        });
    }
}

// ==========================================
// DATA & TABELL-LOGIK
// ==========================================
function initCsvData() {
    // CSV_DATA läses in via data.js i HTML-filen, så den finns globalt
    if (typeof window.CSV_DATA === 'undefined') return;
    const lines = window.CSV_DATA.split(/\r?\n/).filter(r => r.trim());
    const delimiter = lines[0].includes(";") ? ";" : ",";
    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
    
    const idx = { 
        plstr: headers.indexOf("pl/str"), 
        km: headers.indexOf("bdl kmtal till"), 
        obj: headers.indexOf("objekt"), 
        type: headers.indexOf("objekttyp"),
        spr: headers.indexOf("spr") 
    };
    
    if (idx.plstr === -1) return;
    allCsvItems = lines.slice(1).map(line => {
        const cols = line.split(delimiter).map(c => c.replace(/['"]+/g, '').trim());
        if (!cols[idx.plstr]) return null;
        const shortTxt = `${cols[idx.plstr]} ${cols[idx.obj]}`;
        const longTxt = `${shortTxt} (${cols[idx.km]})`;
        return {
            label: longTxt, shortLabel: shortTxt,
            value: JSON.stringify({ plstr: cols[idx.plstr], kmtal: cols[idx.km], objekt: cols[idx.obj] }),
            sortKey: Utils.toMeters(cols[idx.km]), 
            type: cols[idx.type] || "", 
            name: cols[idx.obj] || "",
            track: cols[idx.spr] || "2", 
            kmText: cols[idx.km] || "",
            station: cols[idx.plstr] || ""
        };
    }).filter(Boolean).sort((a,b) => a.sortKey - b.sortKey);
}

function restoreRoutes(savedBlocks) {
    const container = document.getElementById("routes-container");
    container.innerHTML = "";
    if (!savedBlocks || savedBlocks.length === 0) {
        window.addNewRouteBlock();
        return;
    }
    savedBlocks.forEach((blockRows, blockIndex) => {
        const num = blockIndex + 1;
        const div = document.createElement("div");
        div.className = "route-block";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:1px solid #eee; margin:30px 0 10px 0;">
                <h3>Sträcka <span class="route-number">${num}</span></h3>
                <button type="button" class="btn-ghost btn-danger no-print" onclick="deleteRouteBlock(this)">🗑️ Ta bort</button>
            </div>
            <table class="control-table route-table">
                <thead><tr>
                    <th width="10%">Start/Via/Slut</th> 
                    <th width="15%">Typ</th> <th width="25%">Beteckning</th>
                    <th width="10%">Med/mot</th> 
                    <th width="7%">H/V</th> 
                    <th width="14%">Km</th> 
                    <th width="14%">Offset</th> 
                    <th width="5%"></th>
                </tr></thead>
                <tbody class="route-body"></tbody>
            </table>
            <div class="no-print" style="margin:10px 0 20px;"><button type="button" onclick="addRouteRow(this)" class="btn-ghost">+ Rad</button></div>
        `;
        container.appendChild(div);
        const tbody = div.querySelector("tbody");
        blockRows.forEach(rowData => {
            createRow(tbody, rowData.pos);
            const tr = tbody.lastElementChild;
            const selects = tr.querySelectorAll("select");
            const inputs = tr.querySelectorAll("input");
            selects[0].value = rowData.pos;
            selects[1].value = rowData.type;
            window.updateObjOpts(selects[1]); 
            selects[2].value = rowData.objVal;
            selects[3].value = rowData.dir;
            selects[4].value = rowData.side;
            inputs[0].value = rowData.km;
            inputs[1].value = rowData.offset;
        });
    });
}

function initRouteTables() { if (!document.querySelector(".route-block")) window.addNewRouteBlock(); }

function createRow(tbody, posType) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><select onchange="calcOffset(this)"><option>${posType}</option><option>Start</option><option>Via</option><option>Slut</option></select></td>
        <td><select onchange="updateObjOpts(this)"><option value="Signal">Signal</option><option value="Växel">Växel</option><option value="Stoppbock">Stoppbock</option></select></td>
        <td><select onfocus="expandDropdown(this)" onblur="shrinkDropdown(this)" onchange="fillKm(this); shrinkDropdown(this)"><option value="">Välj...</option></select></td>
        <td><select><option></option><option value="Med">Med</option><option value="Mot">Mot</option></select></td>
        <td><select><option></option><option value="H">H</option><option value="V">V</option></select></td>
        <td><input type="text" oninput="calcOffset(this)"></td>
        <td><input type="text"></td>
        <td class="no-print"><button type="button" style="border:none;background:none;cursor:pointer;" onclick="this.closest('tr').remove()">🗑️</button></td>
    `;
    tbody.appendChild(tr);
    window.updateObjOpts(tr.querySelector('select')); 
}

function recalcAllRows() {
    document.querySelectorAll(".route-table tbody tr").forEach(tr => {
        const inp = tr.cells[5].querySelector("input");
        if (inp) window.calcOffset(inp);
    });
}

function downloadFile(name, content, type) {
    const blob = new Blob([new Uint8Array([...content].map(c => c.charCodeAt(0)))], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
}

// ==========================================
// GLOBALA FUNKTIONER (Fäst på window för HTML-events)
// ==========================================
window.addNewRouteBlock = function() {
    const container = document.getElementById("routes-container");
    const num = container.children.length + 1;
    const div = document.createElement("div");
    div.className = "route-block";
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:1px solid #eee; margin:30px 0 10px 0;">
            <h3>Sträcka <span class="route-number">${num}</span></h3>
            <button type="button" class="btn-ghost btn-danger no-print" onclick="deleteRouteBlock(this)">🗑️ Ta bort</button>
        </div>
        <table class="control-table route-table">
            <thead><tr><th width="10%">Start/Via/Slut</th><th width="15%">Typ</th><th width="25%">Beteckning</th><th width="10%">Med/mot</th><th width="7%">H/V</th><th width="14%">Km</th><th width="14%">Offset</th><th width="5%"></th></tr></thead>
            <tbody class="route-body"></tbody>
        </table>
        <div class="no-print" style="margin:10px 0 20px;"><button type="button" onclick="addRouteRow(this)" class="btn-ghost">+ Rad</button></div>
    `;
    container.appendChild(div);
    const tbody = div.querySelector("tbody");
    createRow(tbody, "Start");
    createRow(tbody, "Slut");
};

window.deleteRouteBlock = function(btn) {
    if (document.querySelectorAll(".route-block").length > 1 && confirm("Ta bort sträcka?")) {
        btn.closest(".route-block").remove();
        document.querySelectorAll(".route-number").forEach((el, i) => el.textContent = i + 1);
    }
};

window.addRouteRow = function(btn) { createRow(btn.closest(".route-block").querySelector("tbody"), "Via"); };

window.updateObjOpts = function(el) {
    const tr = el.closest("tr");
    const type = tr.cells[1].querySelector("select").value;
    const target = tr.cells[2].querySelector("select");
    const matches = allCsvItems.filter(i => {
        if (type === "Signal") return i.type.toLowerCase().includes("signal");
        if (type === "Växel") return i.name.toLowerCase().includes("vxl");
        if (type === "Stoppbock") return i.name.toLowerCase().includes("stopp");
        return true;
    });
    target.innerHTML = "<option value=''>Välj...</option>" + matches.map(i => `<option value='${i.value}' data-short='${i.shortLabel}' data-long='${i.label}'>${i.label}</option>`).join("");
};

window.expandDropdown = function(sel) { for (let opt of sel.options) { if (opt.dataset.long) opt.textContent = opt.dataset.long; } };

window.shrinkDropdown = function(sel) { 
    for (let opt of sel.options) { if (opt.dataset.short) opt.textContent = opt.dataset.short; } 
    const selectedOpt = sel.options[sel.selectedIndex];
    if (selectedOpt && selectedOpt.dataset.short) selectedOpt.textContent = selectedOpt.dataset.short;
};

window.fillKm = function(el) {
    if (!el.value) return;
    const data = JSON.parse(el.value);
    const input = el.closest("tr").cells[5].querySelector("input");
    input.value = data.kmtal;
    window.calcOffset(input);
};

window.calcOffset = function(el) {
    const tr = el.closest("tr");
    const pos = tr.cells[0].querySelector("select").value;
    const kmVal = tr.cells[5].querySelector("input").value;
    const offInput = tr.cells[6].querySelector("input");
    if (pos === "Via" || !kmVal) { offInput.value = ""; return; }
    const m = Utils.toMeters(kmVal);
    let diff = 0;
    if (pos === "Start" && mainStartMeters) diff = m - mainStartMeters;
    if (pos === "Slut" && mainEndMeters) diff = m - mainEndMeters;
    offInput.value = diff;
};

window.generateXML = function() {
    const val = (id) => Utils.escapeXml(document.getElementById(id)?.value || "");
    let xml = `<?xml version="1.0" encoding="iso-8859-1"?>\r\n<TSRXML xmlns="http://www.bombardier.com/rcs/OPS">\r\n`;
    ["rbc", "identitet", "sth", "orsaktext", "axellast", "taglangd", "riktning"].forEach(f => {
        const map = { rbc:"RBCName", identitet:"Identity", sth:"STH", orsaktext:"Cause", axellast:"WeightPerAxle", taglangd:"Front", riktning:"Direction" };
        xml += `\t<${map[f]}>${val(f)}</${map[f]}>\r\n`;
    });
    xml += `\t<DistanceToShow>1500</DistanceToShow>\r\n\t<TSRLine>\r\n`;
    document.querySelectorAll(".route-body tr").forEach(tr => {
        const sels = tr.querySelectorAll("select");
        const objData = sels[2].value ? JSON.parse(sels[2].value) : null;
        if (!objData) return;
        const type = Utils.escapeXml(sels[1].value);
        const dir = sels[3].value === "Med" ? "Medriktad" : (sels[3].value === "Mot" ? "Motriktad" : "");
        const side = sels[4].value;
        const dirFull = (type === "Växel" && side) ? `${dir} ${side}` : dir;
        const offset = tr.cells[6].querySelector("input").value || "0";
        xml += `\t\t<TSRObj>\r\n\t\t\t<Name>${Utils.escapeXml(objData.objekt)}</Name>\r\n\t\t\t<Type>${type}</Type>\r\n\t\t\t<Direction>${dirFull}</Direction>\r\n\t\t\t<Offset>${offset}</Offset>\r\n\t\t</TSRObj>\r\n`;
    });
    xml += `\t</TSRLine>\r\n</TSRXML>`;
    let rawId = document.getElementById('identitet').value.trim();
    let filename = rawId ? rawId.replace(/[^a-z0-9_\-\.]/gi, '_') : "nedsattning";
    downloadFile(filename + ".xml", xml, "application/xml");
};

window.printPage = function() { window.print(); };
