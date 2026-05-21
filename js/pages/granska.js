import { StorageManager, getEntryStatus } from '../core/storage.js';
import { showToast } from '../core/ui.js';

// ==========================================
// SIDA: GRANSKA (Review)
// ==========================================

export function initGranskaPage() {
    window.renderGranskaList();
}

// Hjälpfunktion för att visa/dölja detaljer
window.toggleGranskaDetails = function(index) {
    const el = document.getElementById(`granska-details-${index}`);
    const icon = document.getElementById(`granska-icon-${index}`);
    
    if (el.style.display === 'none') {
        el.style.display = 'block';
        if(icon) icon.className = "fa-solid fa-chevron-up";
    } else {
        el.style.display = 'none';
        if(icon) icon.className = "fa-solid fa-chevron-down";
    }
};

window.renderGranskaList = () => {
    const entries = StorageManager.getAll();
    const reviewables = entries.map((e, i) => ({...e, originalIndex: i}))
                               .filter(e => getEntryStatus(e) === 'projekterad');

    const listContainer = document.getElementById("granskaListContainer");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";

    if (reviewables.length === 0) {
        listContainer.innerHTML = `<div class="empty-message" style="text-align:center; padding:40px; color:#666;">Inga nedsättningar väntar på granskning.</div>`;
        return;
    }

    // POC KART-DATA
    const PX_PER_M = 0.6;
    const TRACK_GAP = 60;
    const SLOPE_PX = 20;
    const Y_BASE = 150; 
    
    const pocStations = [
        { name: "Harrå", km: 1357640, yOffset: -120 },
        { name: "Fjällåsen", km: 1370750, yOffset: -80 }
    ];

    const pocTracks = [
        { id: 'h2', start: 1357123, end: 1358052, levelFrom: 0, levelTo: -1 }, 
        { id: 'h1', start: 1357546, end: 1357717, levelFrom: -1, levelTo: -2 },
        { id: 'f1', start: 1370400, end: 1371063, levelFrom: 0, levelTo: 1 }
    ];

    const pocSymbols = [
        { id: "102",  pos: 1356797, track: 0, dir: 1,  labelPos: -1 }, 
        { id: "L201", pos: 1356964, track: 0, dir: -1, labelPos: 1 },  
        { id: "151",  pos: 1357227, track: 0, dir: -1, labelPos: 1 },  
        { id: "141",  pos: 1357339, track: 0, dir: -1, labelPos: 1 },  
        { id: "142",  pos: 1357902, track: 0, dir: 1,  labelPos: -1 }, 
        { id: "152",  pos: 1358003, track: 0, dir: 1,  labelPos: -1 }, 
        { id: "L202", pos: 1358229, track: 0, dir: 1,  labelPos: -1 }, 
        { id: "101",  pos: 1358447, track: 0, dir: -1, labelPos: 1 },  
        { id: "153",  pos: 1357227, track: -1, dir: -1, labelPos: 1 },
        { id: "143",  pos: 1357339, track: -1, dir: -1, labelPos: 1 },  
        { id: "123",  pos: 1357619, track: -1, dir: -1, labelPos: 1 },  
        { id: "120",  pos: 1357674, track: -1, dir: 1,  labelPos: -1 }, 
        { id: "140",  pos: 1357901, track: -1, dir: 1,  labelPos: -1 }, 
        { id: "150",  pos: 1358003, track: -1, dir: 1,  labelPos: -1 }, 
        { id: "125",  pos: 1357611, track: -2, dir: -1, labelPos: 1 }, 
        { id: "118",  pos: 1357674, track: -2, dir: 1,  labelPos: -1 }, 
        { id: "L212", pos: 1359704, track: 0, dir: 1,  labelPos: -1 },
        { id: "L241", pos: 1359704, track: 0, dir: -1, labelPos: 1 },
        { id: "L222", pos: 1362918, track: 0, dir: 1,  labelPos: -1 },
        { id: "L231", pos: 1362918, track: 0, dir: -1, labelPos: 1 },
        { id: "L222", pos: 1365100, track: 0, dir: 1,  labelPos: -1 },
        { id: "L231", pos: 1365100, track: 0, dir: -1, labelPos: 1 },
        { id: "L242", pos: 1369000, track: 0, dir: 1,  labelPos: -1 },
        { id: "L211", pos: 1369000, track: 0, dir: -1, labelPos: 1 },
        { id: "102",  pos: 1370008, track: 0, dir: 1,  labelPos: -1 }, 
        { id: "L201", pos: 1370184, track: 0, dir: -1, labelPos: 1 },  
        { id: "151",  pos: 1370485, track: 0, dir: -1, labelPos: 1 },  
        { id: "141",  pos: 1370598, track: 0, dir: -1, labelPos: 1 },  
        { id: "142",  pos: 1370918, track: 0, dir: 1,  labelPos: -1 },  
        { id: "152",  pos: 1371018, track: 0, dir: 1,  labelPos: -1 },  
        { id: "L202", pos: 1371280, track: 0, dir: 1,  labelPos: -1 },  
        { id: "149",  pos: 1370484, track: 1, dir: -1, labelPos: 1 },  
        { id: "139",  pos: 1370598, track: 1, dir: -1, labelPos: 1 },  
        { id: "144",  pos: 1370918, track: 1, dir: 1,  labelPos: -1 },  
        { id: "154",  pos: 1371019, track: 1, dir: 1,  labelPos: -1 },  
        { id: "101",  pos: 1371486, track: 0, dir: -1, labelPos: 1 }
    ];

    reviewables.forEach(e => {
        const div = document.createElement("div");
        div.style.cssText = "background:#fff; border-left: 5px solid #d63384; border-radius:8px; margin-bottom:20px; padding:20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); max-width: 100%; box-sizing: border-box;";
        
        let routeInfo = e.routeData && e.routeData.length ? `${e.routeData.length} st delsträckor` : "Ingen sträckdata";
        const customStracka = `${e.nedstracka ? e.nedstracka + ' ' : ''}${e.start_km}+${e.start_m} - ${e.slut_km}+${e.slut_m}`;

        const excludeKeys = ['routeData', 'originalIndex', 'timestamp', 'status', 'granskadAv', 'granskadDatum', 'snr', 'start_km', 'start_m', 'slut_km', 'slut_m', 'projecteddate'];
        let detailsHtml = `<table style="width:100%; font-size:0.9em; border-collapse:collapse; margin-top:10px;">`;
        
        if (e.start_km !== undefined) {
            detailsHtml += `<tr><td style="padding:6px 0; font-weight:600; color:#555; width:40%;">Position:</td><td style="padding:6px 0; color:#000;">${e.start_km}+${e.start_m} - ${e.slut_km}+${e.slut_m}</td></tr>`;
        }
        Object.keys(e).forEach(key => {
            if (excludeKeys.includes(key)) return;
            detailsHtml += `<tr><td style="padding:6px 0; font-weight:600; color:#555; width:40%;">${key.charAt(0).toUpperCase() + key.slice(1)}:</td><td style="padding:6px 0; color:#000;">${e[key] || '-'}</td></tr>`;
        });

        if (e.routeData && e.routeData.length > 0) {
            detailsHtml += `<tr><td colspan="2" style="padding-top:20px; padding-bottom:5px; font-weight:bold; border-bottom:2px solid #ddd; color:#d63384; text-transform:uppercase; font-size:0.85em;">Projekterade Objekt</td></tr>`;
            e.routeData.forEach((block, blockIdx) => {
                detailsHtml += `<tr><td colspan="2" style="background:#f1f3f5; padding:8px; font-weight:bold; font-size:0.9em; border-top:1px solid #ccc; color:#333;">Delsträcka ${blockIdx + 1}</td></tr>`;
                block.forEach(row => {
                    let positionInfo = (row.dir === "Med" ? "Medriktad" : (row.dir === "Mot" ? "Motriktad" : "")) + (row.side === "H" ? ", Höger" : (row.side === "V" ? ", Vänster" : ""));
                    let cleanObjName = row.objVal;
                    try { const parsed = JSON.parse(row.objVal); if (parsed.objekt) cleanObjName = `${parsed.plstr} ${parsed.objekt}`; } catch (err) {}
                    
                    detailsHtml += `
                        <tr style="font-size:0.9em; border-bottom:1px solid #eee;">
                            <td colspan="2" style="padding:6px 10px;">
                                <div style="display:flex; justify-content:space-between;">
                                    <strong style="color:#000;">${row.type} <span style="font-weight:normal; color:#d63384; margin-left:5px;">${cleanObjName}</span></strong> 
                                    <span style="color:#666; font-family:monospace;">${row.pos}</span>
                                </div>
                                <div style="color:#555; margin-top:2px;">KM: ${row.km} <span style="color:#ccc;">|</span> Offset: ${row.offset}m</div>
                                <div style="color:#777; font-size:0.85em;">${positionInfo}</div>
                            </td>
                        </tr>`;
                });
            });
        }
        detailsHtml += `</table>`;

        // KARTA
        let miniMapHtml = '';
        if (e.start_km !== undefined && e.slut_km !== undefined) {
            const sM = parseInt(e.start_km) * 1000 + parseInt(e.start_m || 0);
            const eM = parseInt(e.slut_km) * 1000 + parseInt(e.slut_m || 0);
            
            if (!isNaN(sM) && !isNaN(eM)) {
                const minM = Math.min(sM, eM);
                const maxM = Math.max(sM, eM);
                const paddingMeters = 1500; 
                const viewStart = minM - paddingMeters;
                const viewEnd = maxM + paddingMeters;
                const W_meters = viewEnd - viewStart;
                const W_px = Math.round(W_meters * PX_PER_M); 
                const getX = (m) => Math.round((m - viewStart) * PX_PER_M);

                let tracksSvg = '';
                tracksSvg += `<line x1="0" y1="${Y_BASE}" x2="${W_px}" y2="${Y_BASE}" stroke="#374151" stroke-width="4" stroke-linecap="square" />`;
                
                pocTracks.forEach(def => {
                    const xStart = getX(def.start);
                    const xEnd = getX(def.end);
                    const yFrom = Y_BASE + (def.levelFrom * TRACK_GAP);
                    const yTo = Y_BASE + (def.levelTo * TRACK_GAP);
                    
                    if (xEnd > 0 && xStart < W_px) {
                        tracksSvg += `<line x1="${xStart + SLOPE_PX}" y1="${yTo}" x2="${xEnd - SLOPE_PX}" y2="${yTo}" stroke="#374151" stroke-width="4" stroke-linecap="square" />`;
                        tracksSvg += `<line x1="${xStart}" y1="${yFrom}" x2="${xStart + SLOPE_PX}" y2="${yTo}" stroke="#374151" stroke-width="4" stroke-linecap="square" />`;
                        tracksSvg += `<line x1="${xEnd}" y1="${yFrom}" x2="${xEnd - SLOPE_PX}" y2="${yTo}" stroke="#374151" stroke-width="4" stroke-linecap="square" />`;
                    }
                });

                let stationSvg = '';
                pocStations.forEach(st => {
                    const x = getX(st.km);
                    if (x > -100 && x < W_px + 100) {
                        stationSvg += `<text x="${x}" y="${Y_BASE + st.yOffset}" fill="#000" opacity="0.1" font-weight="900" font-size="45" font-family="sans-serif" text-anchor="middle" letter-spacing="3">${st.name}</text>`;
                    }
                });

                const selStartX = getX(minM);
                const selEndX = getX(maxM);
                const boxMinY = 20;
                const boxMaxY = 280;
                
                let rangeSvg = `
                    <rect x="${selStartX}" y="${boxMinY}" width="${selEndX - selStartX}" height="${boxMaxY - boxMinY}" fill="#fef08a" opacity="0.5" />
                    <line x1="${selStartX}" y1="${boxMinY}" x2="${selStartX}" y2="${boxMaxY}" stroke="#dc3545" stroke-width="2" stroke-dasharray="6,6" />
                    <line x1="${selEndX}" y1="${boxMinY}" x2="${selEndX}" y2="${boxMaxY}" stroke="#dc3545" stroke-width="2" stroke-dasharray="6,6" />
                    <text x="${selStartX + 15}" y="${boxMinY + 20}" fill="#dc3545" font-weight="bold" font-size="14" font-family="sans-serif">Längd: ${maxM - minM} m</text>
                `;

                let signalsSvg = '';
                pocSymbols.forEach(sym => {
                    const x = getX(sym.pos);
                    if (x > -100 && x < W_px + 100) {
                        const y = Y_BASE + (sym.track * TRACK_GAP);
                        const kmPart = Math.floor(sym.pos / 1000); 
                        const mPart = sym.pos % 1000; 
                        const kmStr = `${kmPart}+${mPart.toString().padStart(3, '0')}`;
                        
                        let fillColor = "#9ca3af"; 
                        let textColor = "#111827";
                        let textWeight = "700";

                        if (e.routeData) {
                            e.routeData.forEach(block => {
                                block.forEach(row => {
                                    try {
                                        let parsed = JSON.parse(row.objVal);
                                        if (parsed.objekt.includes(sym.id) && parsed.kmtal === kmStr) {
                                            if (row.pos === "Start") { fillColor = "#22c55e"; textColor = "#047857"; textWeight = "900"; }
                                            if (row.pos === "Slut") { fillColor = "#ef4444"; textColor = "#b91c1c"; textWeight = "900"; }
                                        }
                                    } catch(err) {}
                                });
                            });
                        }

                        const pathD = sym.dir === 1 ? "M -7 -6 L 7 0 L -7 6 Z" : "M 7 -6 L -7 0 L 7 6 Z";
                        const labelY = (sym.labelPos === 1) ? 22 : -12;
                        const kmLabelY = (sym.labelPos === -1) ? -25 : 35;

                        signalsSvg += `
                            <g transform="translate(${x}, ${y})">
                                <text x="0" y="${kmLabelY}" font-size="10" fill="#999" text-anchor="middle" font-family="monospace">${kmStr}</text>
                                <path d="${pathD}" fill="${fillColor}" stroke="#4b5563" stroke-width="1.5" />
                                <text x="0" y="${labelY}" font-size="11" font-weight="${textWeight}" fill="${textColor}" text-anchor="middle" font-family="monospace">${sym.id}</text>
                            </g>
                        `;
                    }
                });

                miniMapHtml = `
                <div style="margin-top: 30px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px;">
                    <h4 style="margin: 0 0 10px 0; color: #333; font-size: 1em; border-bottom: 2px solid #eee; padding-bottom: 5px;">
                        <i class="fa-solid fa-map"></i> Spårkarta
                    </h4>
                    <div style="width: 100%; max-width: 100%; overflow-x: auto; background-color: #fff; border: 1px solid #e2e8f0; border-radius: 4px; box-sizing: border-box; touch-action: pan-x;"> 
                        <svg width="${W_px}" height="300" style="display: block; min-width: 100%;">
                            ${stationSvg}
                            ${rangeSvg}
                            ${tracksSvg}
                            ${signalsSvg}
                        </svg>
                    </div>
                </div>`;
            }
        }

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; max-width: 100%;">
                <div style="flex-grow:1; min-width: 0;"> 
                    <h3 style="margin-top:0;">${e.identitet || 'Saknar ID'}</h3>
                    <p style="color:#666; margin:5px 0;">Sträcka: <strong>${customStracka}</strong></p>
                    <p style="color:#666; margin:5px 0;">Planerare: ${e.planerare} | Datum: ${e.timestamp?.slice(0,10)}</p>
                    
                    <div onclick="window.toggleGranskaDetails(${e.originalIndex})" 
                         style="margin-top:10px; font-size:0.9em; background:#f8f9fa; padding:10px; border-radius:4px; cursor:pointer; border:1px solid #eee; transition: background 0.2s;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong><i class="fa-solid fa-microchip"></i> Teknisk data & Karta (Klicka för info):</strong>
                            <i id="granska-icon-${e.originalIndex}" class="fa-solid fa-chevron-down"></i>
                        </div>
                        <div style="margin-top:5px; color:#555;">
                            RBC: ${e.rbc || '-'}, ${routeInfo}
                        </div>
                    </div>

                    <div id="granska-details-${e.originalIndex}" style="display:none; margin-top:15px; border-top:1px dashed #ccc; padding-top:10px;">
                        ${detailsHtml}
                        ${miniMapHtml}
                    </div>
                </div>
                <div style="text-align:right; margin-left:20px; flex-shrink: 0;">
                    <button onclick="approveEntry(${e.originalIndex})" class="btn-primary" style="background-color:#28a745; border:none; padding:10px 20px;">
                        <i class="fa-solid fa-check-double"></i> Godkänn
                    </button>
                </div>
            </div>
        `;
        listContainer.appendChild(div);
    });
};

window.approveEntry = (index) => {
    if(!confirm("Jag intygar att denna nedsättning är korrekt granskad.")) return;
    const allData = StorageManager.getAll();
    const entry = allData[index];
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const nowIso = new Date().toISOString();
    
    entry.status = "granskad";
    entry.granskadAv = currentUser.name || "Okänd";
    entry.granskadDatum = nowIso;
    entry.ibruktagenAv = currentUser.name || "Okänd";
    entry.ibruktagenDatum = nowIso;
    
    StorageManager.saveAll(allData);
    showToast("Nedsättningen är nu granskad och Aktiv!", "success");
    window.renderGranskaList();
};
