// js/pages/visual.js

// --- KONFIGURATION ---
const PX_PER_M = 0.6;   
const START_METER = 1356000; 

// Design & Geometri
const Y_BASE = 300;     
const TRACK_GAP = 60;   
const SLOPE_PX = 20;    

// Färger
const COLOR_NEUTRAL = "#9ca3af"; // Grå
const COLOR_START   = "#22c55e"; // Grön
const COLOR_END     = "#ef4444"; // Röd

// Variabler (Modul-skopade)
let currentWorkRange = null; 
let elDistLine = null;       
let elDistText = null;       
let elReadout = null; 
let isDragging = false; 
let svg = null;
let layerRange = null;

const stations = [
    { name: "Harrå",     km: 1357640, yOffset: -180, startM: 1356000, endM: 1359000, tracks: [1, 2, 3], mainTrack: 3 },
    { name: "Fjällåsen", km: 1370750, yOffset: -100, startM: 1369000, endM: 1372000, tracks: [1, 2],    mainTrack: 2 }
];

const TRACK_DEFINITIONS = [
    { id: 'h2', start: 1357123, end: 1358052, levelFrom: 0, levelTo: -1, trackNum: 2, parentId: null }, 
    { id: 'h1', start: 1357546, end: 1357717, levelFrom: -1, levelTo: -2, trackNum: 1, parentId: 'h2' },
    { id: 'f1', start: 1370400, end: 1371063, levelFrom: 0, levelTo: 1, trackNum: 1, parentId: null }
];

// --- OBJEKT ---
let symbols = [
    { id: "102",  pos: 1356797, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "L201", pos: 1356964, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "151",  pos: 1357227, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "141",  pos: 1357339, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "142",  pos: 1357902, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "152",  pos: 1358003, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "L202", pos: 1358229, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "101",  pos: 1358447, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "153",  pos: 1357227, track: -1, dir: -1, offset: 0, labelPos: 1, measureMode: 0 },
    { id: "143",  pos: 1357339, track: -1, dir: -1,  offset: 0, labelPos: 1, measureMode: 0 },  
    { id: "123",  pos: 1357619, track: -1, dir: -1, offset: 0, labelPos: 1, measureMode: 0 },  
    { id: "120",  pos: 1357674, track: -1, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "140",  pos: 1357901, track: -1, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "150",  pos: 1358003, track: -1, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "125",  pos: 1357611, track: -2, dir: -1, offset: 0, labelPos: 1, measureMode: 0 }, 
    { id: "118",  pos: 1357674, track: -2, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "L212", pos: 1359704, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 },
    { id: "L241", pos: 1359704, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },
    { id: "L222", pos: 1362918, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 },
    { id: "L231", pos: 1362918, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },
    { id: "L222", pos: 1365100, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 },
    { id: "L231", pos: 1365100, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },
    { id: "L242", pos: 1369000, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 },
    { id: "L211", pos: 1369000, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },
    { id: "102",  pos: 1370008, track: 0, dir: 1,  offset: 0, labelPos: -1, measureMode: 0 }, 
    { id: "L201", pos: 1370184, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "151",  pos: 1370485, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "141",  pos: 1370598, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "142",  pos: 1370918, track: 0, dir: 1,  offset: 0, labelPos: -1,  measureMode: 0 },  
    { id: "152",  pos: 1371018, track: 0, dir: 1,  offset: 0, labelPos: -1,  measureMode: 0 },  
    { id: "L202", pos: 1371280, track: 0, dir: 1,  offset: 0, labelPos: -1,  measureMode: 0 },  
    { id: "149",  pos: 1370484, track: 1, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "139",  pos: 1370598, track: 1, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
    { id: "144",  pos: 1370918, track: 1, dir: 1,  offset: 0, labelPos: -1,  measureMode: 0 },  
    { id: "154",  pos: 1371019, track: 1, dir: 1,  offset: 0, labelPos: -1,  measureMode: 0 },  
    { id: "101",  pos: 1371486, track: 0, dir: -1, offset: 0, labelPos: 1,  measureMode: 0 },  
];

let activeSym = null; 
let startMouseX = 0; 
let initialOffset = 0;

export function initVisualPage() {
    const page = document.getElementById("visual-page");
    if (!page) return;

    // Bygg upp HTML-strukturen för din applikation och injicera CSS för SVG-elementen
    page.innerHTML = `
        <div class="navbar no-print">
            <div class="nav-left">
                <span class="logo">SNIGEL POC</span>
                <a href="home.html">Hem</a>
            </div>
            <div class="nav-right" id="user-display"></div>
        </div>
        
        <style>
            .track { stroke: #4b5563; stroke-width: 4px; stroke-linecap: round; }
            .station-name { font-size: 16px; font-weight: bold; fill: #111827; font-family: sans-serif; letter-spacing: 1px; }
            .distance-line { stroke-width: 2px; stroke-dasharray: 4; }
            .distance-text { font-size: 12px; font-weight: bold; font-family: sans-serif; }
            .range-track-line { stroke: #fbbf24; stroke-width: 8px; opacity: 0.5; }
            .km-marker { font-size: 9px; fill: #9ca3af; text-anchor: middle; font-family: sans-serif; }
            .symbol-label { font-size: 11px; font-weight: bold; fill: #111827; text-anchor: middle; font-family: sans-serif; }
            .track-highlight { stroke: #0078d4; stroke-width: 2px; opacity: 0.5; }
            .offset-line { stroke: #0078d4; stroke-width: 1.5px; stroke-dasharray: 2; }
            .offset-text { font-size: 11px; fill: #0078d4; text-anchor: middle; font-family: sans-serif; }
            .symbol-group { cursor: pointer; }
        </style>

        <div style="padding: 40px 20px; font-family: sans-serif; max-width: 1300px; margin: 0 auto;">
            <div style="background: #fff; padding: 30px; border-radius: 8px; border: 1px solid #eaeaea;">
                
                <!-- Kontrollpanelen (Input-fälten) -->
                <div style="display: flex; gap: 20px; align-items: flex-end; margin-bottom: 25px;">
                    <div>
                        <label style="display:block; font-size:11px; color:#666; text-transform:uppercase; margin-bottom:5px;">FRÅN (KM)</label>
                        <input type="text" id="inpStart" value="1357+100" style="padding:10px; border:1px solid #ccc; border-radius:4px; width:140px;">
                    </div>
                    <div>
                        <label style="display:block; font-size:11px; color:#666; text-transform:uppercase; margin-bottom:5px;">TILL (KM)</label>
                        <input type="text" id="inpEnd" value="1357+800" style="padding:10px; border:1px solid #ccc; border-radius:4px; width:140px;">
                    </div>
                    <div>
                        <label style="display:block; font-size:11px; color:#666; text-transform:uppercase; margin-bottom:5px;">SPÅRVAL</label>
                        <div id="track-selector" style="padding:10px; border:1px solid #ccc; border-radius:4px; min-width: 250px; display:flex; gap:15px; color:#999;">Ange sträcka och klicka Visa...</div>
                    </div>
                    <button id="btnVisa" style="padding:10px 20px; background:#0078d4; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Visa Utbredning</button>
                    <button id="btnRensa" style="padding:10px 20px; background:#fff; color:#333; border:1px solid #ccc; border-radius:4px; cursor:pointer;">Rensa</button>
                </div>

                <!-- Livedata -->
                <div style="font-size:13px; color:#333; margin-bottom: 20px;">
                    Signal: <strong id="uiId">-</strong> &nbsp;&nbsp;&nbsp;&nbsp; 
                    Position: <strong id="uiKm">-</strong> &nbsp;&nbsp;&nbsp;&nbsp; 
                    Justering: <strong id="uiOffset" style="color:#0078d4;">0 m</strong>
                </div>

                <!-- Kart-containern -->
                <div class="map-container" style="border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; background: #fff;">
                    <div id="mapWrapper" style="width: 100%; overflow-x: auto; white-space: nowrap; padding-bottom: 10px;">
                        <svg id="svgMap"></svg>
                    </div>
                </div>
                
                <!-- Här injiceras 'Klicka på en signal...' texten -->
            </div>
        </div>
    `;

    // Koppla knappar
    document.getElementById('btnVisa').addEventListener('click', () => drawRangeHighlight(false));
    document.getElementById('btnRensa').addEventListener('click', clearRange);

    // Konfigurera kartans storlek och rendera allt precis som i din fil
    svg = document.getElementById('svgMap');
    const lastPos = 1371600; 
    const totalW = (lastPos - START_METER) * PX_PER_M;

    svg.setAttribute('width', totalW + 300);
    svg.setAttribute('height', 600); 

    initMap();
}

// --------------------------------------------------------------------------
// DIN EXAKTA KOD BÖRJAR HÄR (Endast justerad för att fungera i modulen)
// --------------------------------------------------------------------------

function initMap() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const oldReadout = document.getElementById('measurement-readout');
        if(oldReadout) oldReadout.remove();

        elReadout = document.createElement('div');
        elReadout.id = 'measurement-readout';
        elReadout.style.marginTop = '15px';
        elReadout.style.fontSize = '13px';
        elReadout.style.color = '#666';
        elReadout.textContent = "Klicka på en signal: 1 klick=Start (Grön), 2 klick=Slut (Röd).";
        mapContainer.parentNode.insertBefore(elReadout, mapContainer.nextSibling);
    }

    const layerTracks = createGroup("layer-tracks");
    layerRange = createGroup("layer-range"); 
    const layerHighlights = createGroup("layer-highlights"); 
    const layerSymbols = createGroup("layer-symbols");
    const layerLabels = createGroup("layer-labels");
    const layerOverlay = createGroup("layer-overlay"); 
    
    // 1. RITA SPÅR
    createLine(layerTracks, 0, Y_BASE, parseInt(svg.getAttribute('width')), Y_BASE, "track");

    TRACK_DEFINITIONS.forEach(def => {
        drawFixedSiding(layerTracks, def.start, def.end, def.levelFrom, def.levelTo);
    });

    // Spårnummer & Stationer
    drawTrackLabel(layerLabels, "3", 1357640, 0); 
    drawTrackLabel(layerLabels, "2", 1357640, -1);
    drawTrackLabel(layerLabels, "1", 1357640, -2);
    drawTrackLabel(layerLabels, "2", 1370750, 0); 
    drawTrackLabel(layerLabels, "1", 1370750, 1);

    stations.forEach(st => {
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.textContent = st.name;
        txt.setAttribute("x", meterToPx(st.km));
        txt.setAttribute("y", Y_BASE + st.yOffset);
        txt.setAttribute("class", "station-name");
        txt.setAttribute("text-anchor", "middle");
        layerTracks.appendChild(txt);
    });

    // Skapa mät-elementen
    elDistLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    elDistLine.setAttribute("class", "distance-line");
    elDistLine.style.display = "none";
    layerOverlay.appendChild(elDistLine);

    elDistText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    elDistText.setAttribute("class", "distance-text");
    elDistText.style.display = "none";
    layerOverlay.appendChild(elDistText);

    // Symboler
    symbols.forEach((s, idx) => drawSymbol(s, idx, layerSymbols, layerHighlights));
}

function drawFixedSiding(layer, startM, endM, fromLvl, toLvl) {
    const xStart = meterToPx(startM);
    const xEnd = meterToPx(endM);
    const yFrom = Y_BASE + (fromLvl * TRACK_GAP);
    const yTo = Y_BASE + (toLvl * TRACK_GAP);
    createLine(layer, xStart + SLOPE_PX, yTo, xEnd - SLOPE_PX, yTo, "track");
    createLine(layer, xStart, yFrom, xStart + SLOPE_PX, yTo, "track");
    createLine(layer, xEnd, yFrom, xEnd - SLOPE_PX, yTo, "track");
}

function updateTrackOptions(minM, maxM) {
    const container = document.getElementById('track-selector');
    if (!container) return;

    let activeStations = stations.filter(st => (st.startM < maxM && st.endM > minM));
    let availableTracks = new Set();
    
    if (activeStations.length === 0) {
        availableTracks.add(2); availableTracks.add(3);
    } else {
        activeStations.forEach(st => {
            if(st.tracks) st.tracks.forEach(t => availableTracks.add(t));
        });
    }

    const sortedTracks = Array.from(availableTracks).sort((a,b) => a - b);
    const signature = sortedTracks.join(',');
    if (container.dataset.signature === signature) return;

    container.dataset.signature = signature;
    container.style.color = '#333';
    container.innerHTML = ''; 

    sortedTracks.forEach(t => {
        const lbl = document.createElement('label');
        lbl.className = 'checkbox-item';
        lbl.style.cursor = 'pointer';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.value = t;
        chk.id = `chk-track-${t}`;
        chk.checked = true; 
        chk.onchange = () => drawRangeHighlight(true);
        lbl.appendChild(chk);
        lbl.appendChild(document.createTextNode(` Spår ${t}`));
        container.appendChild(lbl);
    });
}

function drawRangeHighlight(skipUpdateOptions = false) {
    if (!layerRange) layerRange = document.getElementById("layer-range");
    if (layerRange) layerRange.innerHTML = ''; 

    const val1 = document.getElementById('inpStart').value;
    const val2 = document.getElementById('inpEnd').value;
    const startM = parseKmInput(val1);
    const endM = parseKmInput(val2);

    if (isNaN(startM) || isNaN(endM)) { return; }
    
    const minM = Math.min(startM, endM);
    const maxM = Math.max(startM, endM);

    currentWorkRange = { start: minM, end: maxM };

    if (!skipUpdateOptions) { updateTrackOptions(minM, maxM); }

    const selectedTracks = [];
    const container = document.getElementById('track-selector');
    if (container) {
        container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
            if (chk.checked) selectedTracks.push(parseInt(chk.value));
        });
    }

    selectedTracks.forEach(trackNum => {
        drawHierarchicalTrack(minM, maxM, trackNum);
    });

    drawRangeBox(minM, maxM, selectedTracks);
    
    updateReadout();
    if (activeSym) updateDistanceVisuals(activeSym);
}

function drawHierarchicalTrack(reqStart, reqEnd, trackNum) {
    let points = new Set([reqStart, reqEnd]);
    TRACK_DEFINITIONS.forEach(d => {
        points.add(d.start);
        points.add(d.end);
        points.add(pxToMeter(meterToPx(d.start) + SLOPE_PX));
        points.add(pxToMeter(meterToPx(d.end) - SLOPE_PX));
    });

    let sortedPoints = Array.from(points)
        .filter(p => p >= reqStart && p <= reqEnd)
        .sort((a,b) => a - b);

    for (let i = 0; i < sortedPoints.length - 1; i++) {
        let segStart = sortedPoints[i];
        let segEnd = sortedPoints[i+1];
        let mid = (segStart + segEnd) / 2;

        let level = getLevelAt(mid, trackNum);
        let lvlStart = getLevelAt(segStart + 0.1, trackNum); 
        let lvlEnd = getLevelAt(segEnd - 0.1, trackNum);

        const x1 = meterToPx(segStart);
        const x2 = meterToPx(segEnd);
        const y1 = Y_BASE + (lvlStart * TRACK_GAP);
        const y2 = Y_BASE + (lvlEnd * TRACK_GAP);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1); line.setAttribute("x2", x2);
        line.setAttribute("y1", y1); line.setAttribute("y2", y2);
        line.setAttribute("class", "range-track-line"); 
        layerRange.appendChild(line);
    }
}

function getLevelAt(meter, trackNum) {
    let def = TRACK_DEFINITIONS.find(d => d.trackNum === trackNum && meter >= d.start && meter <= d.end);
    if (def) {
        let x = meterToPx(meter);
        let xStart = meterToPx(def.start);
        let xEnd = meterToPx(def.end);
        if (x < xStart + SLOPE_PX) {
            let parentLvl = def.levelFrom; 
            let ratio = (x - xStart) / SLOPE_PX;
            return parentLvl + (def.levelTo - parentLvl) * ratio;
        } else if (x > xEnd - SLOPE_PX) {
            let parentLvl = def.levelFrom;
            let ratio = (xEnd - x) / SLOPE_PX;
            return parentLvl + (def.levelTo - parentLvl) * ratio;
        } else {
            return def.levelTo;
        }
    }
    let relevantDef = null;
    if (meter < 1360000) relevantDef = TRACK_DEFINITIONS.find(d => d.trackNum === trackNum && d.id.startsWith('h'));
    else if (meter > 1368000) relevantDef = TRACK_DEFINITIONS.find(d => d.trackNum === trackNum && d.id.startsWith('f'));

    if (relevantDef && relevantDef.parentId) {
        let parentDef = TRACK_DEFINITIONS.find(d => d.id === relevantDef.parentId);
        if (parentDef) return getLevelAt(meter, parentDef.trackNum);
    }
    return 0;
}

function drawRangeBox(minM, maxM, selectedTracks) {
    const x1 = meterToPx(minM);
    const x2 = meterToPx(maxM);
    let minLvl = 0, maxLvl = 0;

    if (selectedTracks.length > 1) {
        if (minM < 1360000) { minLvl = -2; maxLvl = 0; } 
        else if (maxM > 1368000) { minLvl = 0; maxLvl = 1; } 
    } else if (selectedTracks.length === 1) {
        minLvl = -0.5; maxLvl = 0.5;
    }

    const boxTop = Y_BASE + (minLvl * TRACK_GAP) - 60;
    const boxBottom = Y_BASE + (maxLvl * TRACK_GAP) + 60;
    const boxH = boxBottom - boxTop;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x1); rect.setAttribute("y", boxTop);
    rect.setAttribute("width", x2 - x1); rect.setAttribute("height", boxH);
    rect.setAttribute("fill", "#fbbf24"); rect.setAttribute("opacity", "0.2");
    layerRange.appendChild(rect);

    createRangeBorder(x1, boxTop, boxBottom);
    createRangeBorder(x2, boxTop, boxBottom);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.textContent = `Längd på nedsättning: ${maxM - minM} m`;
    label.setAttribute("x", x1 + 10); label.setAttribute("y", boxTop - 10);
    label.setAttribute("class", "offset-text"); label.style.textAnchor = "start";
    label.style.fill = "#dc3545"; label.style.fontSize = "16px"; label.style.fontWeight = "bold";
    layerRange.appendChild(label);

    requestAnimationFrame(() => {
        const wrapper = document.getElementById('mapWrapper');
        if (wrapper) wrapper.scrollTo({ left: Math.max(0, x1 - 150), behavior: 'smooth' });
    });
}

function updateDistanceVisuals(sym) {
    if (!currentWorkRange || !sym || sym.measureMode === 0) {
        if(elDistLine) elDistLine.style.display = 'none';
        if(elDistText) elDistText.style.display = 'none';
        return;
    }

    const currentSymPos = sym.pos + sym.offset;
    let targetM = 0;
    let diffVal = 0;

    if (sym.measureMode === 1) {
        targetM = currentWorkRange.start;
        diffVal = currentSymPos - targetM;
    } else if (sym.measureMode === 2) {
        targetM = currentWorkRange.end;
        diffVal = targetM - currentSymPos;
    }

    elDistLine.style.display = 'block';
    elDistText.style.display = 'block';

    const yPos = Y_BASE + (sym.track * TRACK_GAP);
    const xSym = meterToPx(currentSymPos);
    const xTarget = meterToPx(targetM);

    elDistLine.setAttribute("x1", xSym);
    elDistLine.setAttribute("y1", yPos);
    elDistLine.setAttribute("x2", xTarget);
    elDistLine.setAttribute("y2", yPos);

    elDistLine.style.stroke = sym.measureMode === 1 ? COLOR_START : COLOR_END;
    elDistText.style.fill = sym.measureMode === 1 ? COLOR_START : COLOR_END;

    const midX = (xSym + xTarget) / 2;
    const sign = diffVal > 0 ? "+" : "";
    elDistText.textContent = `offset ${sign}${Math.round(diffVal)}`;
    elDistText.setAttribute("x", midX);
    elDistText.setAttribute("y", yPos - 10);
}

function updateReadout() {
    if (!elReadout) return;
    if (!currentWorkRange) {
        elReadout.textContent = "Ange nedsättning och klicka på signaler.";
        return;
    }

    const startSym = symbols.find(s => s.measureMode === 1);
    let txtStart = "Start: -";

    if (startSym) {
        const currentPos = startSym.pos + startSym.offset;
        const diffStart = currentPos - currentWorkRange.start;
        const signStart = diffStart > 0 ? "+" : "";
        txtStart = `Start: ${formatKm(currentWorkRange.start)} ${signStart}${Math.round(diffStart)} m`;
    }

    const endSym = symbols.find(s => s.measureMode === 2);
    let txtEnd = "Slut: -";

    if (endSym) {
        const currentPos = endSym.pos + endSym.offset;
        const diffEnd = currentWorkRange.end - currentPos;
        const signEnd = diffEnd > 0 ? "+" : "";
        txtEnd = `Slut: ${formatKm(currentWorkRange.end)} ${signEnd}${Math.round(diffEnd)} m`;
    }

    elReadout.textContent = `${txtStart}      ${txtEnd}`;
}

function formatKm(meter) {
    const k = Math.floor(meter / 1000);
    const m = Math.round(meter % 1000);
    return `${k}+${m.toString().padStart(3, '0')}`;
}

function updateSymbolColor(sym, index) {
    const group = document.querySelector(`.symbol-group[data-index='${index}']`);
    if(!group) return;
    const path = group.querySelector('.symbol-shape');
    
    if (sym.measureMode === 1) path.style.fill = COLOR_START;
    else if (sym.measureMode === 2) path.style.fill = COLOR_END;
    else path.style.fill = COLOR_NEUTRAL;
    
    path.style.stroke = "#333";
}

function createGroup(id) { const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); g.id = id; svg.appendChild(g); return g; }
function parseKmInput(val) { if (!val) return null; val = val.toString().replace(/\s/g, '').replace(',', '.'); if (val.includes('+')) { const parts = val.split('+'); if (parts.length === 2) return parseInt(parts[0], 10) * 1000 + parseInt(parts[1], 10); } if (val.includes('.') && val.indexOf('.') < 5) return parseFloat(val) * 1000; return parseInt(val, 10); }
function createRangeBorder(x, y1, y2) { const l = document.createElementNS("http://www.w3.org/2000/svg", "line"); l.setAttribute("x1", x); l.setAttribute("y1", y1); l.setAttribute("x2", x); l.setAttribute("y2", y2); l.setAttribute("class", "range-border"); l.setAttribute("stroke", "#dc3545"); l.setAttribute("stroke-width", "2"); l.setAttribute("stroke-dasharray", "5,5"); layerRange.appendChild(l); }
function clearRange() { 
    if(layerRange) layerRange.innerHTML = ''; 
    currentWorkRange = null; 
    symbols.forEach((s, i) => { s.measureMode = 0; updateSymbolColor(s, i); });
    updateDistanceVisuals(null); 
    updateReadout();
    document.getElementById('inpStart').value = '';
    document.getElementById('inpEnd').value = '';
    const ts = document.getElementById('track-selector');
    if(ts) { ts.innerHTML = 'Ange sträcka och klicka Visa...'; ts.dataset.signature = ''; ts.style.color = '#999'; }
}
function createLine(parent, x1, y1, x2, y2, cls) { const l = document.createElementNS("http://www.w3.org/2000/svg", "line"); l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2); l.setAttribute("class", cls); parent.appendChild(l); }
function drawTrackLabel(layer, num, meterPos, trackLvl) { const x = meterToPx(meterPos); const y = Y_BASE + (trackLvl * TRACK_GAP); const txt = document.createElementNS("http://www.w3.org/2000/svg", "text"); txt.textContent = num; txt.setAttribute("x", x); txt.setAttribute("y", y - 10); txt.setAttribute("fill", "#666"); txt.setAttribute("font-size", "14px"); txt.setAttribute("font-weight", "bold"); layer.appendChild(txt); }

function drawSymbol(sym, index, layerSym, layerHigh) { 
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); 
    g.setAttribute("class", "symbol-group"); 
    g.dataset.index = index; 
    const x = meterToPx(sym.pos); 
    const y = Y_BASE + (sym.track * TRACK_GAP); 
    g.setAttribute("transform", `translate(${x}, ${y})`); 
    
    const posTxt = document.createElementNS("http://www.w3.org/2000/svg", "text"); 
    const kmPart = Math.floor(sym.pos / 1000); 
    const mPart = sym.pos % 1000; 
    posTxt.textContent = `${kmPart}+${mPart.toString().padStart(3, '0')}`; 
    posTxt.setAttribute("class", "km-marker"); 
    posTxt.setAttribute("y", (sym.labelPos === -1) ? -25 : 35); 
    g.appendChild(posTxt); 
    
    const hl = document.createElementNS("http://www.w3.org/2000/svg", "line"); 
    hl.setAttribute("class", "track-highlight"); 
    hl.setAttribute("x1", 0); hl.setAttribute("y1", 0); hl.setAttribute("x2", 0); hl.setAttribute("y2", 0); 
    hl.style.display = 'none'; hl.id = `hl-${index}`; 
    layerHigh.appendChild(hl); 
    
    const ol = document.createElementNS("http://www.w3.org/2000/svg", "line"); 
    ol.setAttribute("class", "offset-line"); ol.id = `ol-${index}`; ol.style.display = 'none'; 
    g.appendChild(ol); 
    
    const olTxt = document.createElementNS("http://www.w3.org/2000/svg", "text"); 
    olTxt.setAttribute("class", "offset-text"); olTxt.id = `ol-txt-${index}`; olTxt.style.display = 'none'; 
    g.appendChild(olTxt); 
    
    const shape = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
    if(sym.dir === 1) shape.setAttribute("d", "M -7 -6 L 7 0 L -7 6 Z"); 
    else shape.setAttribute("d", "M 7 -6 L -7 0 L 7 6 Z"); 
    shape.setAttribute("class", "symbol-shape"); 
    
    if(sym.measureMode === 1) shape.style.fill = COLOR_START;
    else if(sym.measureMode === 2) shape.style.fill = COLOR_END;
    else shape.style.fill = COLOR_NEUTRAL;
    g.appendChild(shape); 
    
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text"); 
    txt.textContent = sym.id; 
    txt.setAttribute("class", "symbol-label"); 
    txt.setAttribute("y", (sym.labelPos === 1) ? 22 : -12); 
    g.appendChild(txt); 
    
    g.addEventListener('mousedown', startDrag); 
    layerSym.appendChild(g); 
}

function startDrag(e) { 
    e.preventDefault(); 
    isDragging = false; 
    const g = e.currentTarget; 
    const idx = g.dataset.index;
    activeSym = symbols[idx]; 
    startMouseX = e.clientX; 
    initialOffset = activeSym.offset; 
    
    updateUI(); 
    updateDistanceVisuals(activeSym); 
    updateReadout(); 

    document.addEventListener('mousemove', onDrag); 
    document.addEventListener('mouseup', endDrag); 
}

function onDrag(e) { 
    if (!activeSym) return; 
    isDragging = true; 
    
    const dxPx = e.clientX - startMouseX; 
    const dxM = Math.round(dxPx / PX_PER_M); 
    activeSym.offset = initialOffset + dxM; 
    
    updateVisuals(activeSym); 
    updateUI(); 
    updateDistanceVisuals(activeSym); 
    updateReadout(); 
}

function endDrag() { 
    if (!isDragging && activeSym) {
        const newMode = (activeSym.measureMode + 1) % 3;
        activeSym.measureMode = newMode;

        if (newMode === 1) {
            symbols.forEach((s, i) => {
                if (s !== activeSym && s.measureMode === 1) {
                    s.measureMode = 0;
                    updateSymbolColor(s, i);
                }
            });
        } else if (newMode === 2) {
            symbols.forEach((s, i) => {
                if (s !== activeSym && s.measureMode === 2) {
                    s.measureMode = 0;
                    updateSymbolColor(s, i);
                }
            });
        }
        
        updateSymbolColor(activeSym, symbols.indexOf(activeSym));
        updateDistanceVisuals(activeSym);
        updateReadout(); 
    }
    
    document.removeEventListener('mousemove', onDrag); 
    document.removeEventListener('mouseup', endDrag); 
}

function updateVisuals(sym) { const idx = symbols.indexOf(sym); const hl = document.getElementById(`hl-${idx}`); const ol = document.getElementById(`ol-${idx}`); const olTxt = document.getElementById(`ol-txt-${idx}`); if (sym.offset === 0) { hl.style.display = 'none'; ol.style.display = 'none'; olTxt.style.display = 'none'; return; } hl.style.display = 'block'; ol.style.display = 'block'; olTxt.style.display = 'block'; const baseX = meterToPx(sym.pos); const targetX = baseX + (sym.offset * PX_PER_M); const y = Y_BASE + (sym.track * TRACK_GAP); hl.setAttribute("x1", baseX); hl.setAttribute("x2", targetX); hl.setAttribute("y1", y); hl.setAttribute("y2", y); const relTargetX = sym.offset * PX_PER_M; const lineY = (sym.labelPos === -1) ? -45 : 50; ol.setAttribute("x1", 0); ol.setAttribute("y1", lineY); ol.setAttribute("x2", relTargetX); ol.setAttribute("y2", lineY); olTxt.textContent = (sym.offset > 0 ? "+" : "") + sym.offset + "m"; olTxt.setAttribute("x", relTargetX / 2); olTxt.setAttribute("y", lineY - 4); }
function updateUI() { if(!activeSym) return; document.getElementById('uiId').textContent = activeSym.id; const kmPart = Math.floor(activeSym.pos / 1000); const mPart = activeSym.pos % 1000; document.getElementById('uiKm').textContent = `${kmPart}+${mPart.toString().padStart(3,'0')}`; const elOff = document.getElementById('uiOffset'); elOff.textContent = (activeSym.offset > 0 ? "+" : "") + activeSym.offset + " m"; elOff.style.color = activeSym.offset === 0 ? '#111827' : '#dc3545'; }
function meterToPx(m) { return (m - START_METER) * PX_PER_M; }
function pxToMeter(px) { return (px / PX_PER_M) + START_METER; }
