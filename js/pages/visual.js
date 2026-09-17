import { CSV_DATA } from '../core/data.js';
import { Utils } from '../core/storage.js';

export function initVisualPage() {
    let container = document.getElementById("visualContainer");
    if (!container) {
        document.body.innerHTML = `
            <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; min-height: 100vh;">
                <div class="no-print" style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="color: #1e293b; margin: 0 0 5px 0;">Spårplan</h1>
                        <p style="color: #64748b; margin: 0; font-size: 0.9em;">Genererad från anläggningsdata. Håll muspekaren över objekt för detaljer.</p>
                    </div>
                    <a href="home.html" style="padding: 8px 16px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Tillbaka</a>
                </div>
                <div id="visualContainer" style="overflow-x: auto; white-space: nowrap; cursor: grab; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 60px 20px;"></div>
            </div>
        `;
        container = document.getElementById("visualContainer");
    }

    if (!CSV_DATA) return;

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

    // Dimensioner och marginaler
    const minMeters = objects[0].meters - 300;
    const maxMeters = objects[objects.length - 1].meters + 300;
    
    const PX_PER_M = 0.6;  // Utsträckning på bredden
    const TRACK_GAP = 120; // Avstånd mellan spår i höjdled
    const Y_BASE = 250;
    const W_px = (maxMeters - minMeters) * PX_PER_M;
    const getX = (m) => (m - minMeters) * PX_PER_M;

    // Funktion för att rita ett "järnvägsspår" (mörkgrå bas + vita streckade syllar)
    const drawTrack = (x1, y1, x2, y2) => `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#475569" stroke-width="8" stroke-linecap="round" />
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f8fafc" stroke-width="4" stroke-dasharray="8 8" />
    `;

    // Starta SVG med drop-shadow-filter för 3D-känsla
    let svg = `<svg width="${W_px}" height="550" style="background: transparent; font-family: sans-serif; min-width: 100%;">
        <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.2"/>
            </filter>
        </defs>
    `;

    // 1. Rita huvudspåret genom hela ritytan
    svg += drawTrack(0, Y_BASE, W_px, Y_BASE);

    // 2. Hantera varje driftplats (stationer och sidospår)
    const stations = [...new Set(objects.map(o => o.station))];
    stations.forEach(st => {
        const stObjs = objects.filter(o => o.station === st);
        const stMin = Math.min(...stObjs.map(o => o.meters));
        const stMax = Math.max(...stObjs.map(o => o.meters));
        const midX = getX((stMin + stMax) / 2);

        // Stationsskylt med mörk bakgrund ovanför spåret
        svg += `
            <g transform="translate(${midX}, ${Y_BASE - 180})">
                <rect x="-80" y="-20" width="160" height="40" rx="4" fill="#1e293b" filter="url(#shadow)"/>
                <text x="0" y="5" fill="#fff" font-weight="bold" font-size="16" letter-spacing="2" text-anchor="middle">${st.toUpperCase()}</text>
                <line x1="0" y1="20" x2="0" y2="180" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 4" />
            </g>
        `;

        // Utritning av sidospår (-1 och 1)
        [-1, 1].forEach(tNum => {
            const tObjs = stObjs.filter(o => o.track === tNum);
            if (tObjs.length > 0) {
                const tMin = getX(Math.min(...tObjs.map(o => o.meters)) - 150);
                const tMax = getX(Math.max(...tObjs.map(o => o.meters)) + 150);
                const y = Y_BASE + (tNum * TRACK_GAP);
                const slope = 60; // Längd på vinkeln för växeln

                // Själva sidospåret
                svg += drawTrack(tMin + slope, y, tMax - slope, y);
                
                // Anslutningslinjerna in mot huvudspåret (ritas utan vita syllar för enklare "växel-look")
                svg += `<line x1="${tMin}" y1="${Y_BASE}" x2="${tMin + slope}" y2="${y}" stroke="#475569" stroke-width="6" stroke-linecap="round" />`;
                svg += `<line x1="${tMax}" y1="${Y_BASE}" x2="${tMax - slope}" y2="${y}" stroke="#475569" stroke-width="6" stroke-linecap="round" />`;
            }
        });
    });

    // 3. Placera ut alla anläggningsobjekt
    objects.forEach(o => {
        const x = getX(o.meters);
        const y = Y_BASE + (o.track * TRACK_GAP);
        const isUpper = o.track <= 0; // Objekt på spår 0 och -1 ritas pekande uppåt för att inte krocka

        svg += `<g transform="translate(${x}, ${y})" style="cursor: help;">`;
        
        // Native tooltip
        svg += `<title>${o.type}: ${o.name}\nKilometer: ${o.km}\nSpår: ${o.track}</title>`;

        // Kilometer-angivelse i en liten ljusgrå badge
        svg += `
            <rect x="-24" y="${isUpper ? -75 : 62}" width="48" height="16" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
            <text x="0" y="${isUpper ? -64 : 73}" font-size="9" fill="#475569" font-family="monospace" font-weight="bold" text-anchor="middle">${o.km}</text>
        `;

        if (o.type.toLowerCase() === "signal") {
            // Detaljerad Signal: Mast, svart huvud, och två "LED"-lampor (Grön/Röd)
            svg += `
                <line x1="0" y1="0" x2="0" y2="${isUpper ? -45 : 45}" stroke="#94a3b8" stroke-width="4" />
                <rect x="-9" y="${isUpper ? -55 : 25}" width="18" height="26" rx="3" fill="#0f172a" filter="url(#shadow)" />
                <circle cx="0" cy="${isUpper ? -47 : 33}" r="4" fill="#10b981" />
                <circle cx="0" cy="${isUpper ? -35 : 45}" r="4" fill="#ef4444" />
                <text x="0" y="${isUpper ? -82 : 93}" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">${o.name}</text>
            `;
        } else if (o.type.toLowerCase() === "stoppbock") {
            // Stoppbock: Röd frontbarriär
            svg += `
                <rect x="-8" y="-12" width="16" height="24" fill="#94a3b8" />
                <rect x="-10" y="-14" width="20" height="8" fill="#ef4444" filter="url(#shadow)" />
                <text x="0" y="${isUpper ? -25 : 35}" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">${o.name}</text>
            `;
        } else if (o.type.toLowerCase() === "växel") {
            // Växel: Gul/Orange markeringscirkel med vit text inuti
            svg += `
                <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#fff" stroke-width="2" filter="url(#shadow)" />
                <text x="0" y="${isUpper ? -20 : 25}" font-size="11" font-weight="bold" fill="#b45309" text-anchor="middle">${o.name}</text>
            `;
        }

        svg += `</g>`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
}
