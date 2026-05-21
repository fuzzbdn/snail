import { StorageManager } from '../core/storage.js';
import { showToast } from '../core/ui.js';

// ==========================================
// SIDA: PLANERA
// ==========================================
export function initPlaneraPage() {

    const fromInput = document.getElementById("from");
    if (fromInput) {
        // Skapa nuvarande tidpunkt och formatera den till YYYY-MM-DDThh:mm
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
            
            // Spara datan
            StorageManager.add(entry);
            
            // SIMULERA EMAIL-BEKRÄFTELSE
            const mailSubject = `Beställning Mottagen: ${entry.identitet || 'Nedsättning'}`;
            const mailBody = `Hej ${userName}!\n\nDin beställning av nedsättning på sträcka ${entry.start_km} - ${entry.slut_km} är mottagen.\nOrsak: ${entry.orsak}`;

            console.group("📧 E-POST SIMULERING");
            console.log(`Till: ${userEmail}`);
            console.log(`Ämne: ${mailSubject}`);
            console.log(`Meddelande: \n${mailBody}`);
            console.groupEnd();
            
            // Visa snygg toast istället för alert
            const msg = `Beställning skickad!\nEn bekräftelse har skickats till ${userName}.`;
            showToast(msg, 'success');
            
            // Återställ formuläret
            form.reset();
            document.getElementById('planerare').value = userName;
            document.getElementById("to").value = "Tillsvidare"; 
            if (fromInput) fromInput.valueAsDate = new Date();
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
