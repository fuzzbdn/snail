import { StorageManager } from '../core/storage.js';
import { showToast } from '../core/ui.js';

export function initSavedPage() {
    const container = document.getElementById("savedDataDisplay");
    const data = StorageManager.getAll();
    if (container) container.textContent = data.length === 0 ? "// Inga poster." : JSON.stringify(data, null, 4);

    window.copySavedData = function() {
        navigator.clipboard.writeText(JSON.stringify(data, null, 4))
            .then(() => showToast("Data kopierad!", "success"));
    };
}
