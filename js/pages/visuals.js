import { CSV_DATA } from '../core/data.js';
import { Utils } from '../core/storage.js';

export function initVisualPage() {
    // 1. Hitta eller skapa en container för kartan
    let container = document.getElementById("visualContainer");
    if (!container) {
        document.body.innerHTML = `
            <div style="padding: 20px; font-family: sans-serif; background: #fff;">
                <h1 style="color: #333;"><i class="fa-solid fa-map"></i> Dynamisk Spårplan</h1>
                <p style="color: #666;">Kartan genereras automatiskt från anläggningsdatan (data.js).</p>
                <div id="visualContainer" style="overflow-x: auto; white-space: nowrap; padding-top: 40px; cursor: grab;"></div>
            </div>
        `;
        container = document.getElementById("visualContainer");
    }

    if (!CSV_DATA) {
        container.innerHTML = "<p style='color:red;'>Saknar anläggningsdata (CSV_DATA).</p>";
        return;
    }

    // 2. Läs in och rensa datan
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

    const objects = lines.slice(1).map(line => {
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

    // 3. Räkna ut kartans dimensioner
    const minMeters = objects[0].meters - 500;
    const maxMeters = objects[objects.length - 1].meters + 500;

    const PX_PER_M = 0.5; // Skala: 1 meter = 0.5 pixlar
    const TRACK_GAP = 80; // Avstånd mellan spåren
    const Y_BASE = 250;   // Huvudspårets Y-position
    const W_px = (maxMeters - minMeters) * PX_PER_M;

    const getX = (m) => (m - minMeters) * PX_PER_M;

    let svg = `<svg width="${W_px}" height="500" style="background: #f8f9fa; border-radius: 8px; border: 1px solid #ddd; font-family: sans-serif; min-width: 100%;">`;

    // 4. Rita Huvudspåret (Spår 0)
    svg += `<line x1="0" y1="${Y_BASE}" x2="${W_px}" y2="${Y_BASE}" stroke="#374151" stroke-width="4" stroke-linecap="round" />`;

    // 5. Rita Sidospår & Stationsnamn per driftplats
    const stations = [...new Set(objects.map(o => o.station))];
    
    stations.forEach(st => {
        const stObjs = objects.filter(o => o.station === st);
        const stMin = Math.min(...stObjs.map(o => o.meters));
        const stMax = Math.max(...stObjs.map(o => o.meters));

        // Vattenstämpel med stationsnamnet
        const midX = getX((stMin + stMax) / 2);
        svg += `<text x="${midX}" y="${Y_BASE - 120}" fill="#000" opacity="0.05" font-weight="900" font-size="80" text-anchor="middle" letter-spacing="8">${st.toUpperCase()}</text>`;

        // Rita ut avvikande spår (-1 och 1)
        [-1, 1].forEach(tNum => {
            const tObjs = stObjs.filter(o => o.track === tNum);
            if (tObjs.length > 0) {
                // Lägg till lite marginal för sidospåren
                const tMin = getX(Math.min(...tObjs.map(o => o.meters)) - 100);
                const tMax = getX(Math.max(...tObjs.map(o => o.meters)) + 100);
                const y = Y_BASE + (tNum * TRACK_GAP);
                const slope = 40; // Hur brant växeln ritats

                svg += `<line x1="${tMin + slope}" y1="${y}" x2="${tMax - slope}" y2="${y}" stroke="#6b7280" stroke-width="4" stroke-linecap="round" />`;
                svg += `<line x1="${tMin}" y1="${Y_BASE}" x2="${tMin + slope}" y2="${y}" stroke="#6b7280" stroke-width="4" stroke-linecap="round" />`;
                svg += `<line x1="${tMax}" y1="${Y_BASE}" x2="${tMax - slope}" y2="${y}" stroke="#6b7280" stroke-width="4" stroke-linecap="round" />`;
            }
        });
    });

    // 6. Placera ut alla anläggningsobjekt
    objects.forEach(o => {
        const x = getX(o.meters);
        const y = Y_BASE + (o.track * TRACK_GAP);

        svg += `<g transform="translate(${x}, ${y})">`;
        
        // Kilometertal
        svg += `<text x="0" y="-22" font-size="10" fill="#888" text-anchor="middle" font-family="monospace">${o.km}</text>`;

        if (o.type.toLowerCase() === "signal") {
            svg += `<path d="M -7 -7 L 7 0 L -7 7 Z" fill="#9ca3af" stroke="#4b5563" stroke-width="1.5" />`;
            svg += `<text x="0" y="22" font-size="11" font-weight="bold" fill="#111827" text-anchor="middle">${o.name}</text>`;
        
        } else if (o.type.toLowerCase() === "stoppbock") {
            svg += `<rect x="-3" y="-12" width="6" height="24" fill="#dc3545" />`;
            svg += `<text x="0" y="26" font-size="10" font-weight="bold" fill="#dc3545" text-anchor="middle">${o.name}</text>`;
        
        } else if (o.type.toLowerCase() === "växel") {
            svg += `<circle cx="0" cy="0" r="5" fill="#f59e0b" stroke="#b45309" stroke-width="2" />`;
            svg += `<text x="0" y="20" font-size="10" font-weight="bold" fill="#b45309" text-anchor="middle">${o.name}</text>`;
        }

        svg += `</g>`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
}
