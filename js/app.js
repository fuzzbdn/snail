import { initLoginPage, checkLoginStatus } from './core/auth.js';
import { initPlaneraPage } from './pages/planera.js';
import { initProjekteraPage } from './pages/projektera.js';
import { initRaderaPage } from './pages/radera.js';
import { initUsersPage } from './pages/users.js';
import { initGranskaPage } from './pages/granska.js';
import { initAktivaPage } from './pages/aktiva.js';
import { initSavedPage } from './pages/debug.js';

// Koden körs direkt (type="module" väntar automatiskt tills HTML är inläst)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    initLoginPage(loginForm);
} else {
    checkLoginStatus();
}

if (document.getElementById('planera-page')) initPlaneraPage();
if (document.getElementById('projektera-page')) initProjekteraPage();
if (document.getElementById('radera-page')) initRaderaPage();
if (document.getElementById('users-page')) initUsersPage();
if (document.getElementById('granska-page')) initGranskaPage();
if (document.getElementById('aktiva-page')) initAktivaPage();
if (document.getElementById('saved-page')) initSavedPage();
