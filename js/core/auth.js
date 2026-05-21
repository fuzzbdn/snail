import { getActiveUsers, StorageManager, getEntryStatus } from './storage.js';

// ==========================================
// AUTENTISERING & BEHÖRIGHETER
// ==========================================

export function initLoginPage(formElement) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const usernameInput = document.getElementById('username').value.toLowerCase();
        const passwordInput = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');
        
        const currentUsers = getActiveUsers();
        const foundUser = currentUsers.find(u => u.user === usernameInput && u.pass === passwordInput);

        if (foundUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
            window.location.href = 'home.html'; 
        } else {
            if(errorMsg) errorMsg.style.display = 'block';
        }
    });
}

export function checkLoginStatus() {
    const userData = sessionStorage.getItem('currentUser');
    
    // Om ingen är inloggad och vi inte är på inloggningssidan -> Gå till index
    if (!userData && !document.getElementById('loginForm')) {
         window.location.href = 'index.html'; 
         return;
    }

    if (userData) {
        const user = JSON.parse(userData);
        const path = window.location.pathname;

        // --- SÄKERHET FÖR TÅGLEDARE ---
        if (user.role === 'Tågledare') {
            if (document.getElementById('planera-page') || 
                document.getElementById('projektera-page') || 
                document.getElementById('radera-page') || 
                document.getElementById('users-page') ||
                document.getElementById('granska-page') ||
                document.getElementById('saved-page')) { 
                
                alert("Behörighet saknas.");
                window.location.href = 'home.html';
                return;
            }

            if (path.includes('home.html') || document.querySelector('.menu-grid')) {
                const links = document.querySelectorAll('.menu-grid a');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.includes('active.html')) {
                        link.style.opacity = '0.3';              
                        link.style.pointerEvents = 'none';       
                        link.style.cursor = 'default';           
                        link.style.filter = 'grayscale(100%)';   
                        link.style.boxShadow = 'none';           
                    }
                });
            }
        }

        // --- SÄKERHET FÖR PLANERARE ---
        if (user.role === 'Planerare') {
            if (document.getElementById('projektera-page') || 
                document.getElementById('radera-page') || 
                document.getElementById('users-page') ||
                document.getElementById('granska-page') ||
                document.getElementById('saved-page')) { 
                
                alert("Behörighet saknas. Endast åtkomst till planering och aktiva nedsättningar.");
                window.location.href = 'home.html';
                return;
            }

            if (path.includes('home.html') || document.querySelector('.menu-grid')) {
                const links = document.querySelectorAll('.menu-grid a');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.includes('planera.html') && !href.includes('active.html')) {
                        link.style.opacity = '0.3';              
                        link.style.pointerEvents = 'none';       
                        link.style.cursor = 'default';           
                        link.style.filter = 'grayscale(100%)';   
                        link.style.boxShadow = 'none';           
                    }
                });
            }
        }

        // --- SÄKERHET FÖR ADMIN ---
        if (user.role === 'Admin') {
            const debugLink = document.getElementById('admin-debug-link');
            if (debugLink) debugLink.style.display = 'flex';
			
            const visualLink = document.getElementById('admin-visual-link');
            if (visualLink) visualLink.style.display = 'flex';
        } 
        else if (document.getElementById('saved-page')) {
            alert("Åtkomst nekad: Endast för administratörer.");
            window.location.href = 'home.html';
            return;
        }

        // --- VISA INLOGGAD ANVÄNDARE ---
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) {
            userDisplay.innerHTML = `Inloggad som: <strong>${user.name}</strong> (${user.role}) | <a href="#" onclick="logout()">Logga ut</a>`;
        }
        
        const planerareInput = document.getElementById('planerare');
        if (planerareInput) planerareInput.value = user.name;

        // --- KOLLA NOTIFIERINGAR ---
        checkNotifications(user);
    }
}

export function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Fäst utloggningen på window så att länken i menyn fortfarande fungerar
window.logout = logout; 

// --- FUNKTIONER FÖR NOTIFIERINGAR (BLINKA TAB) ---
function checkNotifications(user) {
    if (user.role === 'Planerare' || user.role === 'Admin') {
        const allData = StorageManager.getAll();
        const unhandledCount = allData.filter(e => getEntryStatus(e) === 'planerad').length;

        if (unhandledCount > 0) {
            startBlinkingTitle(unhandledCount);
        }
    }
}

let titleInterval = null;
function startBlinkingTitle(count) {
    if (titleInterval) clearInterval(titleInterval); 
    
    const originalTitle = document.title;
    let isAlert = false;

    titleInterval = setInterval(() => {
        if (isAlert) {
            document.title = `(${count}) 🔔 ÅTGÄRD KRÄVS! - ${originalTitle}`;
        } else {
            document.title = originalTitle;
        }
        isAlert = !isAlert;
    }, 1000); 
}
