/* ====================================================
   FUNDIFY JAVASCRIPT — FINAL FULL VERSION
==================================================== */

/* -------------------------------
   DEFAULT SAMPLE PROJECTS
-------------------------------- */
const defaultProjects = [
    {
        id: "d1",
        title: "Smart Irrigation System",
        description: "An IoT-based automated irrigation system that detects soil moisture and waters crops automatically.",
        amount: "5000",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=60",
        default: true
    },
    {
        id: "d2",
        title: "AI Student Assistant",
        description: "An AI-powered chatbot to answer student academic questions.",
        amount: "12000",
        image: "https://images.unsplash.com/photo-1581091012184-5c76a837d5b0?auto=format&fit=crop&w=900&q=60",
        default: true
    },
    {
        id: "d3",
        title: "Eco-friendly Packaging",
        description: "Packaging solutions made from biodegradable banana fiber and rice husk.",
        amount: "8000",
        image: "https://images.unsplash.com/photo-1607083206968-13611d6c9a50?auto=format&fit=crop&w=900&q=60",
        default: true
    },
    {
        id: "d4",
        title: "Campus Recycling App",
        description: "A reward-based mobile app promoting recycling in schools and colleges.",
        amount: "10000",
        image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=900&q=60",
        default: true
    },
    {
        id: "d5",
        title: "Solar Power Bank",
        description: "A low-cost, solar-powered portable charger for rural areas.",
        amount: "7000",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=60",
        default: true
    },
    {
        id: "d6",
        title: "Smart Attendance System",
        description: "Face recognition based automated attendance system for educational institutions.",
        amount: "15000",
        image: "https://images.unsplash.com/photo-1580894732444-8ecded184d66?auto=format&fit=crop&w=900&q=60",
        default: true
    }
];

/* -------------------------------
   LOGIN SYSTEM
-------------------------------- */
function login() {
    const user = document.getElementById("username")?.value;
    const pass = document.getElementById("password")?.value;

    if (!user || !pass) {
        alert("Please enter username and password!");
        return;
    }

    localStorage.setItem("fundifyUser", user);

    alert("Login successful!");
    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem("fundifyUser");
    alert("Logged out!");
    location.reload();
}

function checkLogin() {
    const user = localStorage.getItem("fundifyUser");
    const loginStatus = document.getElementById("loginStatus");

    if (!loginStatus) return;

    if (user) {
        loginStatus.textContent = "Logout";
        loginStatus.href = "#";
        loginStatus.onclick = logout;
    } else {
        loginStatus.textContent = "Login";
        loginStatus.href = "login.html";
        loginStatus.onclick = null;
    }
}

/* -------------------------------
   ADD PROJECT
-------------------------------- */
function addProject() {
    const user = localStorage.getItem("fundifyUser");
    const loginMessage = document.getElementById("loginMessage");

    if (!user) {
        loginMessage.style.display = "block";
        return;
    }

    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("description").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const imgFile = document.getElementById("imageUpload").files[0];

    if (!title || !desc || !amount || !imgFile) {
        alert("Please fill all fields!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const newProject = {
            id: Date.now().toString(),
            title,
            description: desc,
            amount,
            image: e.target.result,
            default: false,
            owner: user
        };

        const stored = JSON.parse(localStorage.getItem("fundifyProjects")) || [];
        stored.push(newProject);
        localStorage.setItem("fundifyProjects", JSON.stringify(stored));

        alert("Project Submitted Successfully!");
        window.location.href = "projects.html";
    };

    reader.readAsDataURL(imgFile);
}

/* -------------------------------
   DELETE PROJECT (User Only)
-------------------------------- */
function deleteProject(id) {
    let stored = JSON.parse(localStorage.getItem("fundifyProjects")) || [];
    stored = stored.filter(p => p.id !== id);
    localStorage.setItem("fundifyProjects", JSON.stringify(stored));

    alert("Project Deleted Successfully!");
    location.reload();
}

/* -------------------------------
   DISPLAY ALL PROJECTS
-------------------------------- */
function displayProjects() {
    checkLogin();

    const grid = document.getElementById("projectGrid");
    if (!grid) return;

    const userProjects = JSON.parse(localStorage.getItem("fundifyProjects")) || [];
    const allProjects = [...defaultProjects, ...userProjects];

    const user = localStorage.getItem("fundifyUser");

    grid.innerHTML = "";

    allProjects.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${p.image}" onclick="location.href='project.html?id=${p.id}'" style="cursor:pointer;">
            <h3>${p.title}</h3>
            <p>${p.description.substring(0, 80)}...</p>
            <p class="fund"><b>Funding Needed:</b> ₹${p.amount}</p>

            <button onclick="location.href='project.html?id=${p.id}'">View Details</button>
        `;

        // Add delete button for user-owned projects
        if (!p.default && p.owner === user) {
            const del = document.createElement("button");
            del.className = "delete-btn";
            del.textContent = "Delete Project";
            del.onclick = () => deleteProject(p.id);
            card.appendChild(del);
        }

        grid.appendChild(card);
    });
}

/* -------------------------------
   PROJECT DETAILS PAGE
-------------------------------- */
function loadProjectDetails() {
    checkLogin();

    const container = document.getElementById("detailsContainer");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const userProjects = JSON.parse(localStorage.getItem("fundifyProjects")) || [];
    const allProjects = [...defaultProjects, ...userProjects];

    const project = allProjects.find(p => p.id === id);
    const user = localStorage.getItem("fundifyUser");

    if (!project) {
        container.innerHTML = "<h3>Project Not Found</h3>";
        return;
    }

    container.innerHTML = `
        <img src="${project.image}">
        <h1>${project.title}</h1>
        <h3>Funding Needed: ₹${project.amount}</h3>
        <p style="font-size:18px; line-height:1.6;">${project.description}</p>

        <button class="button-primary" style="width:100%; margin-top:20px;">
            Invest in This Project
        </button>
    `;

    if (!project.default && project.owner === user) {
        container.innerHTML += `
            <button class="delete-btn" onclick="deleteProject('${project.id}')">
                Delete Project
            </button>
        `;
    }
}

/* -------------------------------
   INIT
-------------------------------- */
document.addEventListener("DOMContentLoaded", checkLogin);
