// =========================================
// DATABASER & SYSTEM INITIALISERING
// =========================================

// Hoved-admin brugeren (Krav)
const ADMIN_USER = {
    email: 'politi_admin@politi.dk',
    password: 'Frederik240909',
    role: 'admin'
};

// Initialisér "database" i localStorage
function initDatabase() {
    let users = JSON.parse(localStorage.getItem('politi_users'));
    
    // Hvis der slet ingen brugere er, lav databasen med vores admin bruger
    if (!users) {
        users = [ADMIN_USER];
        localStorage.setItem('politi_users', JSON.stringify(users));
        console.log("🛠️ System: Database oprettet.");
    } else {
        // Sikkerhed: Sørg for at admin brugeren ALTID eksisterer
        const adminExists = users.some(u => u.email === ADMIN_USER.email);
        if (!adminExists) {
            users.push(ADMIN_USER);
            localStorage.setItem('politi_users', JSON.stringify(users));
            console.log("🛠️ System: Gendannede admin konto.");
        }
    }
}

// =========================================
// DOM ELEMENTER
// =========================================
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorText = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const userDisplay = document.getElementById('user-display');
const roleBadge = document.getElementById('role-badge');
const adminPanel = document.getElementById('admin-panel');

// =========================================
// LOGIK & STATE
// =========================================

// Tjek om der allerede er logget ind (Session Håndtering)
function checkSession() {
    initDatabase();
    
    // Log info i konsollen som bedt om af brugeren
    console.log("------------------------------------------");
    console.log("🚔 AARHUS POLITI SYSTEM INITIALISERET");
    console.log("Brug følgende STANDARD ADMIN LOGIN til test:");
    console.log(`Email: ${ADMIN_USER.email}`);
    console.log(`Kode:  ${ADMIN_USER.password}`);
    console.log("------------------------------------------");

    const loggedInUserEmail = localStorage.getItem('politi_session');
    
    if (loggedInUserEmail) {
        // Find brugerens fulde info i databasen
        const users = JSON.parse(localStorage.getItem('politi_users'));
        const activeUser = users.find(u => u.email === loggedInUserEmail);
        
        if (activeUser) {
            showDashboard(activeUser);
        } else {
            // "Ugyldig" session
            localStorage.removeItem('politi_session');
        }
    }
}

// Log ind funktion
function handleLogin(e) {
    e.preventDefault(); // Forhindrer siden i at genindlæse
    errorText.classList.add('hidden'); // Skjul tidligere fejl
    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    
    // Hent database
    const users = JSON.parse(localStorage.getItem('politi_users')) || [];
    
    // Tjek match
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
        // Succes
        localStorage.setItem('politi_session', foundUser.email);
        console.log(`✅ Login succes: ${foundUser.email} (${foundUser.role})`);
        
        // Smule delay for animationens skyld
        setTimeout(() => {
            showDashboard(foundUser);
            // Ryd input felter
            emailInput.value = '';
            passwordInput.value = '';
        }, 300);
    } else {
        // Fejl
        errorText.classList.remove('hidden');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Log ud funktion
function handleLogout() {
    localStorage.removeItem('politi_session');
    
    // Vis login skærm med fade animation
    dashboardScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    
    console.log("🔒 Nuværende session afsluttet.");
}

// Vis Dashboard baseret på bruger-type
function showDashboard(user) {
    // Opdater UI data
    userDisplay.textContent = user.email;
    
    if (user.role === 'admin') {
        roleBadge.textContent = 'Administrator';
        roleBadge.className = 'badge admin';
        adminPanel.classList.remove('hidden'); // Vis admin kontrolelementer
    } else {
        roleBadge.textContent = 'Betjent';
        roleBadge.className = 'badge betjent';
        adminPanel.classList.add('hidden'); // Skjul admin kontrolelementer
    }
    
    // Skift skærmbillede
    loginScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
}

// =========================================
// EVENT LISTENERS
// =========================================
document.addEventListener('DOMContentLoaded', checkSession);
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
