// ==========================================
// TOAST NOTIFICATIONS (Ersätter alert)
// ==========================================

export function showToast(message, type = 'success') {
    // 1. Skapa en container om den inte redan finns i DOM
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // 2. Skapa själva toast-rutan
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Välj ikon baserat på typ
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    // Lägg in HTML i toasten
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    // 3. Lägg till toasten i containern så den syns
    container.appendChild(toast);

    // 4. Sätt en timer för att ta bort den efter 4 sekunder
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        // Vänta tills animationen är klar innan vi tar bort elementet från DOM
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000); 
}

// Fäst på window så HTML-filerna kan anropa den via inbyggda event (ex. onclick)
window.showToast = showToast;
