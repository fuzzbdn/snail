import { StorageManager, getEntryStatus } from '../core/storage.js';
import { showToast } from '../core/ui.js';

// ==========================================
// SIDA: HANTERA / RADERA
// ==========================================
export function initRaderaPage() {
    const listContainer = document.getElementById("listContainer");

    const labels = {
        identitet: "Identitet",
        start_km: "Start Kilometer",
        slut_km: "Slut Kilometer",
		start_m: "Start Meter",
		slut_m: "Slut Meter",
        sth: "Hastighet (STH)",
        orsaktext: "Orsak",
        planerare: "Planerare",
        status: "Status",
        granskadAv: "Granskad Av",
		taglangd: "Tåglängdsfördröjning",
		nedstracka: "Nedsättningssträcka",
		riktning: "Riktning",
		spar: "Spårval",
		orsak: "Orsak",
		from: "Starttid",
		to: "Sluttid",
		axellast: "Axellast",
		textmeddelande: "Textmeddelande till tåg",
		etcs: "ETCS-kategori",
		stallverkstyp: "Ställverkstyp",
		passerar: "Passerar nedsattningen RBC-Gräns?",
		rbc: "RBC-ID",
		timestamp: "Inskickad",
		systeminfo: "Information till systemtekniker",
		granskadDatum: "Datum för granskning",
		snr: "SNR"
    };

    window.toggleDetails = (idx) => {
        const div = document.getElementById(`details-${idx}`);
        const icon = document.getElementById(`icon-${idx}`);
        if (!div) return;

        if (div.style.display === "none") {
            const entry = StorageManager.getAll()[idx];
            let html = `<table style="width:100%; font-size:0.9em; border-collapse:collapse;">`;

            // --- 1. FÖRBERED DATA & FORMATERING ---
            const startStr = `${entry.start_km || ''}+${entry.start_m || ''}`;
            const slutStr = `${entry.slut_km || ''}+${entry.slut_m || ''}`;
            
            const fromDate = entry.from ? entry.from.replace('T', ' ') : '-';
            
            let toDate = entry.to || '-';
            if (toDate !== 'Tillsvidare') {
                toDate = toDate.replace('T', ' ');
            }
            
            const orsakVal = entry.orsak || entry.orsaktext || '-';

            // --- 2. SKAPA MANUELLA RADER I RÄTT ORDNING ---
            html += `
                <tr style="border-bottom:1px solid #eee;">
                    <td style="font-weight:bold; padding:6px 0; width:40%; color:#444;">Planerare</td>
                    <td style="padding:6px 0;">${entry.planerare || '-'}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="font-weight:bold; padding:6px 0; width:40%; color:#444;">Orsak</td>
                    <td style="padding:6px 0;">${orsakVal}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="font-weight:bold; padding:6px 0; width:40%; color:#444;">Starttid</td>
                    <td style="padding:6px 0;">${fromDate}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="font-weight:bold; padding:6px 0; width:40%; color:#444;">Sluttid</td>
                    <td style="padding:6px 0;">${toDate}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="font-weight:bold; padding:6px 0; width:40%; color:#444;">Nedsättningssträcka</td>
                    <td style="padding:6px 0;">${entry.nedstracka || '-'}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="font-weight:bold; padding:6px 0; width:40%; color:#444;">Start (Km+m)</td>
                    <td style="padding:6px 0;">${startStr}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="font-weight:bold; padding:6px 0; width:40%; color:#444;">Slut (Km+m)</td>
                    <td style="padding:6px 0;">${slutStr}</td>
                </tr>`;

            // --- 3. LOOPA RESTEN ---
            const excludeKeys = [
                'routeData', 'projectedDate', 'projected', 
                'start_km', 'start_m', 'slut_km', 'slut_m', 
                'planerare', 'orsak', 'orsaktext', 'from', 'to', 'nedstracka'
            ];

            Object.keys(entry).forEach(key => {
                if (excludeKeys.includes(key)) return;

                let value = entry[key];
                if (key === 'timestamp' && value) value = value.replace('T', ' ').slice(0, 16);
                
                if (key === 'status') {
                     if (value === 'planerad') value = "⭕ Planerad";
                     if (value === 'projekterad') value = "⚒️ Projekterad";
                     if (value === 'granskad') value = "✅ Granskad & Klar";
                }

                const label = labels[key] || key;
                html += `<tr style="border-bottom:1px solid #eee;">
                            <td style="font-weight:bold; padding:6px 0; width:40%; color:#444;">${label}</td>
                            <td style="padding:6px 0;">${value}</td>
                         </tr>`;
            });

            html += `</table>`;
            div.innerHTML = html;
            div.style.display = "block";
            if(icon) icon.className = "fa-solid fa-chevron-up";
        } else {
            div.style.display = "none";
            if(icon) icon.className = "fa-solid fa-chevron-down";
        }
    };

    window.renderDeleteList = () => {
        const entries = StorageManager.getAll();
        listContainer.innerHTML = "";
        
        if (!entries.length) {
            listContainer.innerHTML = `<div class="empty-message" style="text-align:center; padding:40px; color:#666;">Inga sparade poster.</div>`;
            return;
        }

        const ul = document.createElement("ul");
        ul.className = "delete-list";
        ul.style.listStyle = "none";
        ul.style.padding = "0";
        
        entries.forEach((e, idx) => {
            const li = document.createElement("li");
            li.style.cssText = "background:#fff; border:1px solid #ddd; border-radius:8px; margin-bottom:10px; padding:15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
            
            let mainTitle = e.identitet || `Utkast (Km ${e.start_km || '?'} - ${e.slut_km || '?'})`;
            const date = e.timestamp ? e.timestamp.slice(0,10) : 'Datum saknas';
            
            const currentStatus = getEntryStatus(e);
            let statusIcon = '';
            
            if (currentStatus === 'granskad') {
                statusIcon = '<span style="color:green; font-weight:bold; background:#e6f9e6; padding:2px 8px; border-radius:10px;"><i class="fa-solid fa-check-double"></i> Granskad</span>';
            } else if (currentStatus === 'projekterad') {
                statusIcon = '<span style="color:#d63384; font-weight:bold; background:#fceef5; padding:2px 8px; border-radius:10px;"><i class="fa-solid fa-helmet-safety"></i> Projekterad</span>';
            } else {
                statusIcon = '<span style="color:#666; font-weight:bold; background:#eee; padding:2px 8px; border-radius:10px;"><i class="fa-regular fa-circle"></i> Planerad</span>';
            }

            li.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div onclick="toggleDetails(${idx})" style="cursor:pointer; flex-grow:1;">
                        <div style="font-size:1.1em; margin-bottom:4px;">
                            <strong>${mainTitle}</strong>
                        </div>
                        <div style="color:#666; font-size:0.9em;">
                            ${statusIcon} &nbsp;|&nbsp; ${date} &nbsp;|&nbsp; ${e.planerare || 'Okänd'}
                            <span style="float:right; margin-right:15px; font-size:0.8em; color:#999;">Mer info <i id="icon-${idx}" class="fa-solid fa-chevron-down"></i></span>
                        </div>
                    </div>
                    <button class="btn-ghost btn-danger" onclick="deleteEntry(${idx})" style="margin-left:10px; font-size:1.2em;" title="Radera">🗑️</button>
                </div>
                <div id="details-${idx}" style="display:none; margin-top:15px; padding-top:15px; border-top:1px dashed #ccc;"></div>
            `;
            ul.appendChild(li);
        });
        listContainer.appendChild(ul);
    };

    window.deleteEntry = (idx) => {
        if(confirm("Vill du verkligen ta bort denna post permanent?")) {
            StorageManager.remove(idx);
            window.renderDeleteList();
            showToast("Post raderad", "success");
        }
    };

    window.deleteAll = () => {
        if(confirm("VARNING: Detta tar bort ALLA sparade poster!")) {
            StorageManager.clear();
            window.renderDeleteList();
            showToast("Alla poster raderade", "success");
        }
    };

    window.renderDeleteList();
}
