// Admin login
const adminEmail = "politi_admin@politi.dk";
const adminPassword = "Frederik240909";

// Betjente database (gemmes i localStorage)
let users = JSON.parse(localStorage.getItem("users")) || [
    {email: adminEmail, password: adminPassword, role: "admin"}
];

// Straffelov JSON (eksempel)
const crimes = [
    {name: "Tyveri", fine: 2000, jail: 30},
    {name: "Hærværk", fine: 1500, jail: 14},
    {name: "Røveri", fine: 0, jail: 120},
    {name: "Narkotikahandel", fine: 0, jail: 180}
];

// Sager database
let cases = JSON.parse(localStorage.getItem("cases")) || [];

// DOM elementer
const loginDiv = document.getElementById("loginDiv");
const adminDiv = document.getElementById("adminDiv");
const mdtDiv = document.getElementById("mdtDiv");
const loginMessage = document.getElementById("loginMessage");
const adminMessage = document.getElementById("adminMessage");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logoutBtn");

// Login funktion
document.getElementById("loginSubmit").addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const user = users.find(u => u.email === email && u.password === password);
    if(user){
        loginDiv.style.display = "none";
        logoutBtn.style.display = "inline-block";
        if(user.role === "admin") adminDiv.style.display = "block";
        mdtDiv.style.display = "block";
        populateCrimes();
        renderCases();
    } else {
        loginMessage.textContent = "Forkert email eller password!";
    }
});

// Logout
logoutBtn.addEventListener("click", () => {
    loginDiv.style.display = "block";
    adminDiv.style.display = "none";
    mdtDiv.style.display = "none";
    logoutBtn.style.display = "none";
});

// Opret betjent (kun admin)
document.getElementById("createOfficer").addEventListener("click", () => {
    const email = document.getElementById("newOfficerEmail").value;
    const password = document.getElementById("newOfficerPassword").value;
    if(users.find(u => u.email === email)){
        adminMessage.textContent = "Brugeren findes allerede!";
        return;
    }
    users.push({email, password, role:"officer"});
    localStorage.setItem("users", JSON.stringify(users));
    adminMessage.textContent = "Betjent oprettet!";
});

// Opret sag
document.getElementById("newCaseBtn").addEventListener("click", () => {
    document.getElementById("caseModal").style.display = "block";
});

document.getElementById("cancelCase").addEventListener("click", () => {
    document.getElementById("caseModal").style.display = "none";
});

document.getElementById("createCase").addEventListener("click", () => {
    const caseName = document.getElementById("caseName").value;
    const crime = document.getElementById("crimeSelect").value;
    const selectedCrime = crimes.find(c => c.name === crime);
    cases.push({caseName, crime:selectedCrime.name, fine:selectedCrime.fine, jail:selectedCrime.jail});
    localStorage.setItem("cases", JSON.stringify(cases));
    renderCases();
    document.getElementById("caseModal").style.display = "none";
});

// Populer dropdown med straffe
function populateCrimes(){
    const crimeSelect = document.getElementById("crimeSelect");
    crimeSelect.innerHTML = "";
    crimes.forEach(c => {
        const option = document.createElement("option");
        option.value = c.name;
        option.textContent = `${c.name} - Bøde: ${c.fine}kr, Fængsel: ${c.jail} dage`;
        crimeSelect.appendChild(option);
    });
}

// Render sager
function renderCases(){
    const list = document.getElementById("casesList");
    list.innerHTML = "";
    cases.forEach(c => {
        const div = document.createElement("div");
        div.textContent = `${c.caseName} | ${c.crime} | Bøde: ${c.fine}kr | Fængsel: ${c.jail} dage`;
        list.appendChild(div);
    });
}

// Initial load
populateCrimes();
renderCases();
