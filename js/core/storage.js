import { DEFAULT_USERS } from './config.js';

// ==========================================
// HANTERING AV ANVÄNDARDATA
// ==========================================
export function getActiveUsers() {
    const stored = localStorage.getItem('app_users_v1');
    if (stored) {
        const users = JSON.parse(stored);
        
        // KOLL: Om datan verkar gammal, skriv över med default.
        if (users.length > 0 && (!users[0].hasOwnProperty('email') || !users[0].hasOwnProperty('company'))) {
            console.log("Upptäckte gammal dataformat. Uppdaterar till ny lista.");
            saveActiveUsers(DEFAULT_USERS);
            return DEFAULT_USERS;
        }
        return users;
    }
    return DEFAULT_USERS;
}

export function saveActiveUsers(usersArray) {
    localStorage.setItem('app_users_v1', JSON.stringify(usersArray));
}

// ==========================================
// HJÄLPFUNKTIONER FÖR POSTER
// ==========================================
export function getEntryStatus(entry) {
    if (entry.status) return entry.status; 
    return entry.projected ? 'projekterad' : 'planerad';
}

// ==========================================
// STORAGE MANAGER & UTILS
// ==========================================
export const StorageManager = {
    KEY: "hns_entries_v1",
    getAll: function() {
        try {
            const raw = localStorage.getItem(this.KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    },
    saveAll: function(data) {
        localStorage.setItem(this.KEY, JSON.stringify(data));
    },
    add: function(entry) {
        const data = this.getAll();
        data.push(entry);
        this.saveAll(data);
    },
    remove: function(index) {
        const data = this.getAll();
        data.splice(index, 1);
        this.saveAll(data);
    },
    clear: function() {
        localStorage.removeItem(this.KEY);
    }
};

export const Utils = {
    toMeters: (val) => {
        if (!val) return 0;
        let s = String(val).replace(/\s+/g, '').replace(',', '.');
        if (s.includes('+')) {
            const [km, m] = s.split('+').map(n => parseInt(n, 10) || 0);
            return (km * 1000) + m;
        }
        return (parseFloat(s) || 0) * 1000;
    },
    escapeXml: (unsafe) => {
        if (!unsafe) return "";
        return unsafe.replace(/[<>&'"]/g, c => ({
            '<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;'
        })[c]);
    }
};
