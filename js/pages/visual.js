import { CSV_DATA } from '../core/data.js';
import { Utils } from '../core/storage.js';

export function initVisualPage() {
    let page = document.getElementById("visual-page");
    if (!page) return;

    // Bygger upp exakt det gränssnitt som fanns på originalbilden
    let container = document.getElementById("visualContainer");
    if (!container) {
        const uiHtml = `
            <div style="background: #f4f6f9; min-height: 100vh; padding: 40px 20px; font-family: 'Segoe UI', sans-serif;">
                <div style="max-width: 1200px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    
                    <!-- Sökfält och Knappar -->
                    <div style="display: flex; gap: 20px; align-items: flex-end; margin-bottom: 30px;">
                        <div>
                            <label style="display:block; font-size:11px; color:#666; margin-bottom:5px; text-transform:uppercase;">Från (km)</label>
                            <input type="text" id="vis-from" value="1356+000" style="padding:10px; border:1px solid #ccc; border-radius:4px; width:150px;">
                        </div>
                        <div>
                            <label style="display:block; font-size:11px; color:#666; margin-bottom:5px; text-transform:uppercase;">Till (km)</label>
                            <input type="text" id="vis-to" value="1358+900" style="padding:10px; border:1px solid #ccc; border-radius:4px; width:150px;">
                        </div>
                        <div>
                            <label style="display:block; font-size:11px; color:#666; margin-bottom:5px; text-transform:uppercase;">Spårval</label>
                            <input type="text" id="vis-track" placeholder="Ange sträcka och klicka Visa..." style="padding:10px; border:1px solid #ccc; border-radius:4px; width:250px;">
                        </div>
                        <button id="btn-visa" style="padding:10px 20px; background:#0078d4; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Visa Utbredning</button>
                        <button id="btn-rensa" style="padding:10px 20px; background:#fff; color:#333; border:1px solid #ccc; border-radius:4px; cursor:pointer;">Rensa</button>
                    </div>
                    
                    <!-- Infopanel -->
                    <div style="font-size:13px; margin-bottom:20px; color:#333;">
                        Signal: <span id="lbl-signal">-</span> &nbsp;&nbsp;&nbsp;&nbsp; 
                        Position: <span id="lbl-pos">-</span> &nbsp;&nbsp;&nbsp;&nbsp; 
                        Justering: <strong style="color:#0078d4;">0 m</strong>
                    </div>
                    
                    <!-- SVG Karta -->
                    <div id="svg-container" style="border: 1px solid #eaeaea; border-radius: 8px; padding: 40px 20px; overflow-x: auto; background: #fff; min-height: 450px; display: flex; align-items: center;">
                        <!-- Renderas här -->
                    </div>
                    
                    <!-- Instruktioner -->
                    <div style="font-size:13px; color:#666; margin-top:20px;">
                        Klicka på en signal: 1 klick=Start (Grön), 2 klick=Slut (Röd).
                    </div>
                </div>
            </div>
        `;
        
        // Letar upp navbar och lägger inyn UI direkt under
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.insertAdjacentHTML('afterend', uiHtml);
        } else {
            document.body.insertAdjacentHTML('beforeend', uiHtml);
        }
    }

    renderSVG();

    // Event listeners
    document.getElementById('btn-rensa')?.addEventListener('click', () => {
        document.getElementById('vis-from').value = '';
        document.getElementById('vis-to').value = '';
        document.getElementById('vis-track').value = '';
        renderSVG();
    });

    document.getElementById('btn-visa')?.addEventListener('click', () => {
        renderSVG();
    });
}

function renderSVG() {
    if (!CSV_DATA) return;
    const container = document.getElementById("svg-container");
    
    const lines = CSV_DATA.split(/\r?\n/).filter(r => r.trim());
    const delimiter = lines[0].includes(";") ? ";" : ",";
    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
    
    const idx = {
        plstr: headers.indexOf("pl/str"),
        km: headers.indexOf("bdl kmtal till"),
        obj: headers.indexOf("objekt"),
        type: headers.indexOf("objekttyp"),
        spr: headers.indexOf("spr")
    };

    let objects = lines.slice(1).map(line => {
        const cols = line.split(delimiter).map(c => c.trim());
        return {
            station: cols[idx.plstr],
            km: cols[idx.km],
            meters: Utils.toMeters(cols[idx.km]),
            name: cols[idx.obj],
            type: cols[idx.type],
            track: parseInt(cols[idx.spr] || "0")
        };
    }).filter(o => !isNaN(o.meters)).sort((a,b) => a.meters - b.meters);

    if (objects.length === 0) return;

    // Filtrera på KM-inmatning
    const filterFrom = Utils.toMeters(document.getElementById('vis-from')?.value || "");
    const filterTo = Utils.toMeters(document.getElementById('vis-to')?.value || "");
    
    if (!isNaN(filterFrom) && filterFrom > 0) objects = objects.filter(o => o.meters >= filterFrom - 200);
    if (!isNaN(filterTo) && filterTo > 0) objects = objects.filter(o => o.meters <= filterTo + 200);

    if (objects.length === 0) {
        container.innerHTML = "<p style='color:#666;'>Inga objekt hittades i det angivna intervallet.</p>";
        return;
    }

    // Uträkning av canvas-storlek
    const minMeters = objects[0].meters - 200;
    const maxMeters = objects[objects.length - 1].meters + 200;
    
    const PX_PER_M = 0.8;
    const TRACK_GAP = -70; // Negativt värde gör att spår 1 ritas ovanför spår 0
    const Y_BASE = 250;
    const W_px = (maxMeters - minMeters) * PX_PER_M;
    const getX = (m) => (m - minMeters) * PX_PER_M;

    const strokeColor = "#4a5568"; // Den mörkblågrå färgen från originalet
    const strokeWidth = "4";

    let svg = `<svg width="${W_px}" height="400" style="background: transparent; font-family: sans-serif;">`;
    
    // Huvudspår (Spår 0)
    svg += `<line x1="0" y1="${Y_BASE}" x2="${W_px}" y2="${Y_BASE}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="butt" />`;

    const stations = [...new Set(objects.map(o => o.station))];
    
    stations.forEach(st => {
        const stObjs = objects.filter(o => o.station === st);
        const stMin = Math.min(...stObjs.map(o => o.meters));
        const stMax = Math.max(...stObjs.map(o => o.meters));
        const midX = getX((stMin + stMax) / 2);

        // Stationsnamn i mitten
        svg += `<text x="${midX}" y="${Y_BASE - 120}" fill="#000" font-weight="bold" font-size="16" letter-spacing="1" text-anchor="middle">${st}</text>`;

        // Sidospår och Växlar
        const tracks = [...new Set(stObjs.map(o => o.track))].filter(t => t !== 0);
        tracks.forEach(tNum => {
            const tObjs = stObjs.filter(o => o.track === tNum);
            const tMin = getX(Math.min(...tObjs.map(o => o.meters)) - 80);
            const tMax = getX(Math.max(...tObjs.map(o => o.meters)) + 80);
            const y = Y_BASE + (tNum * TRACK_GAP);
            const slope = 40;

            svg += `<line x1="${tMin + slope}" y1="${y}" x2="${tMax - slope}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
            svg += `<line x1="${tMin}" y1="${Y_BASE}" x2="${tMin + slope}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
            svg += `<line x1="${tMax}" y1="${Y_BASE}" x2="${tMax - slope}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
        });
    });

    // Objekt och Signaler
    objects.forEach((o) => {
        const x = getX(o.meters);
        const y = Y_BASE + (o.track * TRACK_GAP);
        const isUpper = o.track < 0; 

        if (o.type.toLowerCase() === "signal") {
            // Logik för att vända pilen mot/med baserat på namn
            const isLeftPointing = o.name.includes('L') || (parseInt(o.name) % 2 === 0);
            const points = isLeftPointing ? "-8,-6 8,0 -8,6" : "8,-6 -8,0 8,6"; 

            svg += `
                <g transform="translate(${x}, ${y})" class="sig-group" data-name="${o.name}" data-km="${o.km}" style="cursor:pointer;">
                    <!-- Klickzon för att göra det enklare att klicka -->
                    <circle cx="0" cy="0" r="15" fill="transparent" />
                    <!-- Själva signaltriangeln -->
                    <polygon points="${points}" fill="#cbd5e1" stroke="${strokeColor}" stroke-width="1.5" class="sig-poly" />
                    
                    <text x="0" y="${isUpper ? -20 : 25}" font-size="11" font-weight="bold" fill="#000" text-anchor="middle">${o.name}</text>
                    <text x="0" y="${isUpper ? -10 : 35}" font-size="9" fill="#94a3b8" text-anchor="middle">${o.km}</text>
                </g>
            `;
        } else if (o.type.toLowerCase() === "stoppbock") {
            svg += `
                <g transform="translate(${x}, ${y})">
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="${strokeColor}" stroke-width="3" />
                    <text x="0" y="${isUpper ? -15 : 25}" font-size="10" fill="#000" text-anchor="middle">${o.name}</text>
                </g>
            `;
        }
    });

    svg += `</svg>`;
    container.innerHTML = svg;

    // Interaktivitet för signalerna (Grön/Röd)
    document.querySelectorAll('.sig-group').forEach(el => {
        el.addEventListener('click', function() {
            const poly = this.querySelector('.sig-poly');
            const name = this.getAttribute('data-name');
            const km = this.getAttribute('data-km');
            
            let state = parseInt(this.getAttribute('data-state') || '0');
            state = (state + 1) % 3; // Cyklar mellan 0, 1, 2
            this.setAttribute('data-state', state);

            if (state === 0) {
                poly.setAttribute('fill', '#cbd5e1'); // Grå (Avmarkerad)
            } else if (state === 1) {
                poly.setAttribute('fill', '#22c55e'); // Grön (Start)
            } else if (state === 2) {
                poly.setAttribute('fill', '#ef4444'); // Röd (Slut)
            }

            document.getElementById('lbl-signal').innerText = name;
            document.getElementById('lbl-pos').innerText = km;
        });
    });
}
