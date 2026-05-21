import { StorageManager, getEntryStatus } from '../core/storage.js';
import { showToast } from '../core/ui.js';

// ==========================================
// SIDA: AKTIVA
// ==========================================

export function initAktivaPage() {
    const listContainer = document.getElementById("activeListContainer");
    if (!listContainer) return;

    const entries = StorageManager.getAll();
    
    const active = entries
        .map((e, i) => ({ ...e, originalIndex: i })) 
        .filter(e => getEntryStatus(e) === 'granskad');

    listContainer.innerHTML = "";

    if (active.length === 0) {
        listContainer.innerHTML = `<div class="empty-message" style="text-align:center; padding:40px; color:#666;">Inga aktiva nedsättningar just nu.</div>`;
        return;
    }

    const formatDateTime = (isoString) => {
        if (!isoString) return '-';
        return isoString.replace('T', ' ').slice(0, 16);
    };

    active.forEach(e => {
        const div = document.createElement("div");
        div.style.cssText = "background:#fff; border-left: 6px solid #28a745; border-radius:8px; margin-bottom:20px; padding:20px; box-shadow: 0 4px 6px rgba(0,0,0,0.08);";

        const validFrom = e.from ? e.from : "Ospecificerat";
        const validTo = e.to ? e.to : "Tillsvidare";
        const currentSnr = e.snr || ""; 
        const kmPos = `${e.start_km}+${e.start_m} - ${e.slut_km}+${e.slut_m}`;
        
        const displayStracka = e.nedstracka 
            ? `${e.nedstracka} <span style="color:#ccc; margin:0 5px;">|</span> ${kmPos}` 
            : kmPos;

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <h2 style="margin:0; color:#333;">${e.sth || '--'} km/h</h2>
                        <span style="background:#e6f9e6; color:#155724; padding:2px 8px; border-radius:4px; font-weight:bold; font-size:0.8em;">AKTIV</span>
                    </div>
                    <h3 style="margin:0 0 5px 0; font-size:1.1em;">${e.identitet || 'Saknar ID'}</h3>
                    <p style="margin:0; color:#555;"><strong>Sträcka:</strong> ${displayStracka}</p>
                    <p style="margin:5px 0 0 0; color:#666;">Orsak: ${e.orsaktext || e.orsak || '-'}</p>
                    
                    <div style="margin-top: 15px; background: #f8f9fa; padding: 10px; border-radius: 5px; border: 1px solid #e9ecef; display: inline-block;">
                        <label style="font-size: 0.85em; font-weight: bold; display: block; margin-bottom: 5px;">SNR (Identitet):</label>
                        <div style="display: flex; gap: 5px;">
                            <input type="text" id="snr-${e.originalIndex}" value="${currentSnr}" placeholder="Ange SNR" style="margin:0; padding: 5px; width: 120px;">
                            <button onclick="saveSnr(${e.originalIndex})" class="btn-primary" style="padding: 5px 10px; font-size: 0.85em;">Spara</button>
                        </div>
                    </div>
                </div>
                
                <div style="flex: 1; border-left:1px solid #eee; padding-left:20px; margin-left:20px; min-width: 250px;">
                    <p style="font-size:0.9em; color:#555; margin-bottom:5px;"><strong>Giltighetstid:</strong></p>
                    <div style="font-family:monospace; font-size:1.1em; color:#333; margin-bottom:15px;">
                        Från: ${validFrom.replace('T', ' ')}<br>
                        Till: ${validTo.replace('T', ' ')}
                    </div>
                    
                    <p style="font-size:0.9em; color:#555; margin-bottom:5px;"><strong>Processteg & Logg:</strong></p>
                    <div style="font-size:0.85em; color:#666; line-height:1.5;">
                        <div>🛠️ <strong>Projekterad av:</strong> ${e.projekteradAv || e.planerare || '-'} <br> <span style="color:#999; font-family:monospace;">${formatDateTime(e.projectedDate)}</span></div>
                        <div style="margin-top:4px;">🛡️ <strong>Säkerhetsgranskad av:</strong> ${e.sakerhetsgranskadAv || '-'} <br> <span style="color:#999; font-family:monospace;">${formatDateTime(e.sakerhetsgranskadDatum)}</span></div>
                        <div style="margin-top:4px;">👁️ <strong>Granskad av:</strong> ${e.granskadAv || '-'} <br> <span style="color:#999; font-family:monospace;">${formatDateTime(e.granskadDatum)}</span></div>
                        <div style="margin-top:4px;">🚀 <strong>Ibruktagen av:</strong> ${e.ibruktagenAv || '-'} <br> <span style="color:#999; font-family:monospace;">${formatDateTime(e.ibruktagenDatum)}</span></div>
                    </div>
                </div>
            </div>
        `;
        listContainer.appendChild(div);
    });
}

// Funktion för att spara SNR
window.saveSnr = function(index) {
    const inputField = document.getElementById(`snr-${index}`);
    const newValue = inputField.value;
    const allData = StorageManager.getAll();
    
    if (allData[index]) {
        allData[index].snr = newValue;
        StorageManager.saveAll(allData);
        showToast(`SNR "${newValue}" sparat för denna nedsättning.`, 'success');
    } else {
        showToast("Ett fel uppstod: Kunde inte hitta posten.", 'error');
    }
};
