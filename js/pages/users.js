import { getActiveUsers, saveActiveUsers } from '../core/storage.js';
import { showToast } from '../core/ui.js';

export function initUsersPage() {
    const form = document.getElementById('userForm');
    const tableBody = document.getElementById('userTableBody');
    const editIndexInput = document.getElementById('editIndex');
    let userList = getActiveUsers();

    const renderTable = () => {
        tableBody.innerHTML = '';
        userList.forEach((u, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${u.name}</strong></td>
                <td>${u.company || '-'}</td>
                <td><a href="mailto:${u.email}" style="color:#0078d4;">${u.email || ''}</a></td>
                <td>${u.user}</td>
                <td><code>${u.pass}</code></td>
                <td><span style="background:#eee; padding:2px 6px; border-radius:4px; font-size:0.9em;">${u.role}</span></td>
                <td style="text-align:right;">
                    <button type="button" class="btn-ghost" onclick="editUser(${index})" title="Redigera">✏️</button>
                    <button type="button" class="btn-ghost btn-danger" onclick="removeUser(${index})" title="Ta bort">🗑️</button>
                </td>`;
            tableBody.appendChild(tr);
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = {
            name: document.getElementById('u_name').value, 
            email: document.getElementById('u_email').value,
            user: document.getElementById('u_user').value.toLowerCase(),
            pass: document.getElementById('u_pass').value, 
            role: document.getElementById('u_role').value,
            company: document.getElementById('u_company').value
        };
        const index = parseInt(editIndexInput.value);
        if (index >= 0) { 
            userList[index] = newUser; 
            editIndexInput.value = "-1"; 
            document.getElementById('userFormTitle').innerText = "Lägg till ny användare"; 
        } else { 
            userList.push(newUser); 
        }
        saveActiveUsers(userList); 
        renderTable(); 
        form.reset();
    });

    window.removeUser = (index) => { if(confirm('Ta bort användare?')) { userList.splice(index, 1); saveActiveUsers(userList); renderTable(); } };
    
    window.editUser = (index) => {
        const u = userList[index];
        document.getElementById('u_name').value = u.name; 
        document.getElementById('u_email').value = u.email || "";
        document.getElementById('u_user').value = u.user;
        document.getElementById('u_pass').value = u.pass; 
        document.getElementById('u_role').value = u.role;
        document.getElementById('u_company').value = u.company || "";
        editIndexInput.value = index; 
        document.getElementById('userFormTitle').innerText = `Redigera: ${u.name}`;
    };

    window.exportUsersToCode = () => {
        const jsonContent = JSON.stringify(userList, null, 4);
        const jsCode = `// Kopiera allt nedan och ersätt "DEFAULT_USERS" i din config.js:\n\nexport const DEFAULT_USERS = ${jsonContent};`;
        navigator.clipboard.writeText(jsCode).then(() => showToast("Koden kopierad!", "success"));
    };
    renderTable();
}
