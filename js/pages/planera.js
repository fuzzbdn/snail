import { StorageManager } from '../core/storage.js';
import { showToast } from '../core/ui.js';

// Importera vår kart-modul
import { initVisualMap, updateVisualRange, setRangeCallback, formatKm } from './visual.js';

// ==========================================
// SIDA: PLANERA
// ==========================================
export function initPlaneraPage() {

    // --- Initiera kartan och sätt upp kopplingarna ---
    initVisualMap();

    // Referenser till fälten
    const elStartKm = document.getElementById('plan_start_km');
    const elStartM = document.getElementById('plan_start_m');
    const elSlutKm = document.getElementById('plan_slut_km');
    const elSlutM = document.getElementById('plan_slut_m');

    // 1. Karta -> Formulär (När man ritar en zon med musen)
    setRangeCallback((startM, endM) => {
        const strStart = formatKm(startM); // Blir t.ex. "1357+100"
        const strSlut = formatKm(endM);

        if (strStart.includes('+')) {
            const p = strStart.split('+');
            if(elStartKm) elStartKm.value = p[0];
            if(elStartM) elStartM.value = p[1];
        }
        
        if (strSlut.includes('+')) {
            const p = strSlut.split('+');
            if(elSlutKm) elSlutKm.value = p[0];
            if(elSlutM) elSlutM.value = p[1];
        }
    });

    // 2. Formulär -> Karta (När man skriver manuellt)
    const onManualKmInput = () => {
        const sKm = elStartKm?.value || '';
        const sM = elStartM?.value || '000';
        const eKm = elSlutKm?.value || '';
        const eM = elSlutM?.value || '000';

        if (sKm.length >= 3 && eKm.length >= 3) {
            updateVisualRange(`${sKm}+${sM}`, `${eKm}+${eM}`);
        }
    };
    
    // Lyssna på alla fyra inputfält
    if(elStartKm) elStartKm.addEventListener('input', onManualKmInput);
    if(elStartM) elStartM.addEventListener('input', onManualKmInput);
    if(elSlutKm) elSlutKm.addEventListener('input', onManualKmInput);
    if(elSlutM) elSlutM.addEventListener('input', onManualKmInput);
    // ---------------------------------------------------


    const fromInput = document.getElementById("from");
    if (fromInput) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');

        fromInput.value = `${year}-${month}-${day}T${hour}:${minute}`;
    }

    // Hämta XML-data för dropdowns
    const xmlScript = document.getElementById("xmlData");
    if (xmlScript) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlScript.textContent.trim(), "text/xml");
        const populate = (tag, elId) => {
            const el = document.getElementById(elId);
            const items = xml.getElementsByTagName(tag)[0]?.getElementsByTagName("option");
            if (!el || !items) return;
            for (let opt of items) {
                const o = document.createElement("option");
                o.value = opt.getAttribute("value") || opt.textContent;
                o.textContent = opt.textContent;
                el.appendChild(o);
            }
        };
        populate("axellast", "axellast");
        populate("riktning", "riktning");
        populate("taglangd", "taglangd");
    }

    const form = document.getElementById("hnsForm");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            const entry = Object.fromEntries(fd.entries());

            entry.timestamp = new Date().toISOString();
            entry.status = "planerad"; 

            // --- HÄMTA INLOGGAD ANVÄNDARE & E-POST ---
            const currentUserJson = sessionStorage.getItem('currentUser');
            let userEmail = "okänd e-post";
            let userName = entry.planerare;

            if (currentUserJson) {
                const u = JSON.parse(currentUserJson);
                if(u.email) userEmail = u.email;
                userName = u.name;
            }
            
            StorageManager.add(entry);
            
            const mailSubject = `Beställning Mottagen: ${entry.identitet || 'Nedsättning'}`;
            const mailBody = `Hej ${userName}!\n\nDin beställning av nedsättning på sträcka ${entry.start_km} - ${entry.slut_km} är mottagen.\nOrsak: ${entry.orsak}`;

            console.group("📧 E-POST SIMULERING");
            console.log(`Till: ${userEmail}`);
            console.log(`Ämne: ${mailSubject}`);
            console.log(`Meddelande: \n${mailBody}`);
            console.groupEnd();
            
            const msg = `Beställning skickad!\nEn bekräftelse har skickats till ${userName}.`;
            showToast(msg, 'success');
            
            form.reset();
            document.getElementById('planerare').value = userName;
            document.getElementById("to").value = "Tillsvidare"; 
            if (fromInput) fromInput.valueAsDate = new Date();
            
            // NYTT: Rensa kartan vid skickad beställning
            updateVisualRange("0+000", "0+000"); 
        });
    }

    const toInput = document.getElementById("to");
    if (toInput) {
        toInput.addEventListener("focus", function() {
            if (this.value === "Tillsvidare") {
                this.type = "date";
                this.value = "";
                if('showPicker' in this) try { this.showPicker(); } catch(e){}
            }
        });
        toInput.addEventListener("blur", function() {
            if (!this.value) { this.type = "text"; this.value = "Tillsvidare"; }
        });
    }
}
