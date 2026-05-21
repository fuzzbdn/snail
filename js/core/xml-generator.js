import { Utils } from './storage.js';

// ==========================================
// XML GENERATOR FÖR TSR (BOMBARDIER)
// ==========================================

export function generateXML() {
    const val = (id) => Utils.escapeXml(document.getElementById(id)?.value || "");
    
    let xml = `<?xml version="1.0" encoding="iso-8859-1"?>\r\n<TSRXML xmlns="http://www.bombardier.com/rcs/OPS">\r\n`;
    
    const fields = ["rbc", "identitet", "sth", "orsaktext", "axellast", "taglangd", "riktning"];
    const map = { 
        rbc: "RBCName", identitet: "Identity", sth: "STH", 
        orsaktext: "Cause", axellast: "WeightPerAxle", 
        taglangd: "Front", riktning: "Direction" 
    };

    fields.forEach(f => {
        xml += `\t<${map[f]}>${val(f)}</${map[f]}>\r\n`;
    });
    
    xml += `\t<DistanceToShow>1500</DistanceToShow>\r\n\t<TSRLine>\r\n`;
    
    // Hämta delsträckor från tabellen
    document.querySelectorAll(".route-body tr").forEach(tr => {
        const sels = tr.querySelectorAll("select");
        
        let objData = null;
        try {
            objData = sels[2].value ? JSON.parse(sels[2].value) : null;
        } catch (e) {
            console.warn("Kunde inte parsa objektdata i XML-genereringen", e);
            return; // Hoppa över raden om den är korrupt
        }
        
        if (!objData) return;
        
        const type = Utils.escapeXml(sels[1].value);
        const dir = sels[3].value === "Med" ? "Medriktad" : (sels[3].value === "Mot" ? "Motriktad" : "");
        const side = sels[4].value;
        const dirFull = (type === "Växel" && side) ? `${dir} ${side}` : dir;
        const offset = tr.cells[6].querySelector("input").value || "0";
        
        xml += `\t\t<TSRObj>\r\n\t\t\t<Name>${Utils.escapeXml(objData.objekt)}</Name>\r\n\t\t\t<Type>${type}</Type>\r\n\t\t\t<Direction>${dirFull}</Direction>\r\n\t\t\t<Offset>${offset}</Offset>\r\n\t\t</TSRObj>\r\n`;
    });
    
    xml += `\t</TSRLine>\r\n</TSRXML>`;
    
    let rawId = document.getElementById('identitet')?.value.trim() || "";
    let filename = rawId ? rawId.replace(/[^a-z0-9_\-\.]/gi, '_') : "nedsattning";
    
    downloadFile(filename + ".xml", xml, "application/xml");
}

function downloadFile(name, content, type) {
    const blob = new Blob([new Uint8Array([...content].map(c => c.charCodeAt(0)))], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
}

// Fäst på window så "Generera XML"-knappen i HTML-filen hittar den
window.generateXML = generateXML;
