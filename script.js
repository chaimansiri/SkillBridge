
/* ==============================
   SKILLBRIDGE - SEARCH SYSTEM
================================ */

// Select HTML elements
const searchInput = document.getElementById("skillSearch");
const searchButton = document.getElementById("searchBtn");
const skillCards = document.querySelectorAll(".skill-card");
const skillsGrid = document.querySelector(".skills-grid");

// Create empty message
const emptyMessage = document.createElement("p");

emptyMessage.className = "empty-message";
emptyMessage.textContent = "No skills found. Try another search!";

emptyMessage.style.display = "none";
emptyMessage.style.textAlign = "center";
emptyMessage.style.color = "#9CA3B8";
emptyMessage.style.padding = "30px";

skillsGrid.after(emptyMessage);


// Search function
function searchSkills() {

    const searchValue = searchInput.value
        .toLowerCase()
        .trim();

    let visibleSkills = 0;

    skillCards.forEach(card => {

        const skillName = card
            .querySelector("h3")
            .textContent.toLowerCase();

        const skillCategory = card
            .querySelector(".skill-category")
            .textContent.toLowerCase();

        const skillDescription = card
            .querySelector("p")
            .textContent.toLowerCase();

        const matches =
            skillName.includes(searchValue) ||
            skillCategory.includes(searchValue) ||
            skillDescription.includes(searchValue);

        if (matches) {

            card.style.display = "block";
            visibleSkills++;

        } else {

            card.style.display = "none";

        }

    });


    // Show empty message if no result
    if (visibleSkills === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }

}


// Search button
searchButton.addEventListener("click", searchSkills);


// Search while typing
searchInput.addEventListener("input", searchSkills);


// Reset search when input is empty
searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        searchInput.value = "";
        searchSkills();

    }

});


// Explore buttons
const exploreButtons = document.querySelectorAll(".skill-footer a");

exploreButtons.forEach(button => {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        const card = button.closest(".skill-card");

        const skillName = card.querySelector("h3").textContent;

        alert("You selected: " + skillName +
            "\n\nMore details coming soon!");

    });

});


console.log("SkillBridge is ready!");


/* ==============================
   SKILLBRIDGE - AUTHENTICATION
================================ */

const authForm = document.getElementById("authForm");

if (authForm) {

    let isLogin = false;

    const authTitle = document.getElementById("authTitle");
    const authSubtitle = document.getElementById("authSubtitle");
    const authSubmit = document.getElementById("authSubmit");
    const switchMode = document.getElementById("switchMode");
    const switchText = document.getElementById("switchText");
    const nameGroup = document.getElementById("nameGroup");
    const confirmGroup = document.getElementById("confirmGroup");
    const authMessage = document.getElementById("authMessage");

    function updateAuthMode() {

        authMessage.textContent = "";

        isLogin = !isLogin;

        if (isLogin) {

            authTitle.textContent = "Welcome Back";
            authSubtitle.textContent = "Log in to continue your journey.";
            authSubmit.textContent = "Log In →";
            switchText.textContent = "Don't have an account?";
            switchMode.textContent = "Sign Up";

            nameGroup.style.display = "none";
            confirmGroup.style.display = "none";

        } else {

            authTitle.textContent = "Create Your Account";
            authSubtitle.textContent = "Join our community and start exchanging skills.";
            authSubmit.textContent = "Create Account →";
            switchText.textContent = "Already have an account?";
            switchMode.textContent = "Log In";

            nameGroup.style.display = "block";
            confirmGroup.style.display = "block";

        }

        authForm.reset();
    }

    switchMode.addEventListener("click", updateAuthMode);


    authForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const users = JSON.parse(localStorage.getItem("skillBridgeUsers")) || [];

        if (!isLogin) {

            if (!name) {
                authMessage.textContent = "Please enter your full name.";
                return;
            }

            if (password.length < 8) {
                authMessage.textContent = "Password must contain at least 8 characters.";
                return;
            }

            if (password !== confirmPassword) {
                authMessage.textContent = "Passwords do not match.";
                return;
            }

            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                authMessage.textContent = "This email is already registered.";
                return;
            }

            users.push({
                name: name,
                email: email,
                password: password
            });

            localStorage.setItem("skillBridgeUsers", JSON.stringify(users));

            alert("Account created successfully!");

        } else {

            const user = users.find(user =>
                user.email === email &&
                user.password === password
            );

            if (!user) {
                authMessage.textContent = "Incorrect email or password.";
                return;
            }

            alert("Welcome back, " + user.name + "!");

            localStorage.setItem("skillBridgeCurrentUser", JSON.stringify({
                name: user.name,
                email: user.email
            }));

            window.location.href = "index.html";
            return;
        }

        authForm.reset();

    });

}


// ==============================
// HOME PAGE USER STATUS
// ==============================

const currentUser = JSON.parse(
    localStorage.getItem("skillBridgeCurrentUser")
);

const navButtons = document.querySelector(".nav-buttons");

if (currentUser && navButtons) {

    navButtons.innerHTML = `
        <span class="login-btn">Hello, ${currentUser.name.replace(/[&<>"']/g, "")}</span>
        <button class="signup-btn" id="logoutBtn">Log Out</button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", function() {

        localStorage.removeItem("skillBridgeCurrentUser");

        window.location.reload();

    });

}


// ==============================
// SIGN UP / LOGIN NAVIGATION
// ==============================

if (!currentUser && navButtons) {

    const signupLink = navButtons.querySelector(".signup-btn");
    const loginLink = navButtons.querySelector(".login-btn");

    if (signupLink) {
        signupLink.href = "auth.html";
    }

    if (loginLink) {
        loginLink.href = "auth.html";
    }

}


/* ==============================
   SKILLBRIDGE - USER DASHBOARD
================================ */

const dashboardPage = document.querySelector(".dashboard-body");

if (dashboardPage) {

    const loggedUser = JSON.parse(
        localStorage.getItem("skillBridgeCurrentUser")
    );

    // Protect the dashboard
    if (!loggedUser) {

        window.location.href = "auth.html";

    } else {

        // User information
        document.getElementById("userName").textContent =
            loggedUser.name;

        document.getElementById("userAvatar").textContent =
            loggedUser.name.charAt(0).toUpperCase();


        // Load user data
        const storageKey =
            "skillBridgeData_" + encodeURIComponent(loggedUser.email);

        let userData = JSON.parse(
            localStorage.getItem(storageKey)
        ) || {
            skills: [],
            learning: []
        };


        // Save data
        function saveDashboardData() {

            localStorage.setItem(
                storageKey,
                JSON.stringify(userData)
            );

        }


        // Update statistics
        function updateStatistics() {

            document.getElementById("offeredCount").textContent =
                userData.skills.length;

            document.getElementById("learningCount").textContent =
                userData.learning.length;

            document.getElementById("connectionCount").textContent =
                "0";

        }


        // Display list items safely
        function displayItems(items, containerId, emptyText, type) {

            const container = document.getElementById(containerId);

            container.innerHTML = "";

            if (items.length === 0) {

                const empty = document.createElement("div");

                empty.className = "empty-list";
                empty.textContent = emptyText;

                container.appendChild(empty);

                return;
            }

            items.forEach((item, index) => {

                const card = document.createElement("div");
                card.className = "dashboard-item";

                const information = document.createElement("div");

                const title = document.createElement("h3");
                title.textContent = item;

                const subtitle = document.createElement("span");
                subtitle.textContent =
                    type === "skills" ? "Available to teach" : "Learning goal";

                information.append(title, subtitle);

                const deleteButton = document.createElement("button");

                deleteButton.className = "delete-item";
                deleteButton.textContent = "Remove";

                deleteButton.addEventListener("click", function() {

                    items.splice(index, 1);

                    saveDashboardData();
                    renderDashboard();

                });

                card.append(information, deleteButton);

                container.appendChild(card);

            });

        }


        // Render dashboard
        function renderDashboard() {

            displayItems(
                userData.skills,
                "mySkillsList",
                "No skills added yet. Start sharing your knowledge!",
                "skills"
            );

            displayItems(
                userData.learning,
                "learningList",
                "No learning goals yet. Add your first goal!",
                "learning"
            );

            updateStatistics();

        }


        // Add a skill
        document.getElementById("addSkillForm")
            .addEventListener("submit", function(event) {

                event.preventDefault();

                const input = document.getElementById("skillInput");

                const skill = input.value.trim();

                if (!skill) return;

                const alreadyExists = userData.skills.some(
                    item => item.toLowerCase() === skill.toLowerCase()
                );

                if (alreadyExists) {

                    alert("This skill already exists!");

                    return;
                }

                userData.skills.push(skill);

                saveDashboardData();
                renderDashboard();

                input.value = "";

            });


        // Add a learning goal
        document.getElementById("addLearningForm")
            .addEventListener("submit", function(event) {

                event.preventDefault();

                const input = document.getElementById("learningInput");

                const goal = input.value.trim();

                if (!goal) return;

                const alreadyExists = userData.learning.some(
                    item => item.toLowerCase() === goal.toLowerCase()
                );

                if (alreadyExists) {

                    alert("This learning goal already exists!");

                    return;
                }

                userData.learning.push(goal);

                saveDashboardData();
                renderDashboard();

                input.value = "";

            });


        // Logout
        document.getElementById("dashboardLogout")
            .addEventListener("click", function() {

                localStorage.removeItem("skillBridgeCurrentUser");

                window.location.href = "index.html";

            });


        // Initial display
        renderDashboard();

    }

}


// ==============================
// DASHBOARD NAVIGATION LINK
// ==============================

if (currentUser && navButtons) {

    const dashboardLink = document.createElement("a");

    dashboardLink.href = "dashboard.html";
    dashboardLink.textContent = "Dashboard";
    dashboardLink.className = "login-btn";

    navButtons.prepend(dashboardLink);

}


/* =========================================
   SKILLBRIDGE - COMPLETE JAVASCRIPT
========================================= */


/* =========================================
   1. HOME PAGE SEARCH
========================================= */

const searchInput = document.getElementById("skillSearch");
const searchButton = document.getElementById("searchBtn");

if (searchInput && searchButton) {

    const skillCards = document.querySelectorAll(".skill-card");
    const skillsGrid = document.querySelector(".skills-grid");

    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "No skills found. Try another search!";
    emptyMessage.style.display = "none";
    emptyMessage.style.textAlign = "center";
    emptyMessage.style.padding = "30px";
    emptyMessage.style.color = "#9CA3B8";

    skillsGrid.after(emptyMessage);

    function searchSkills() {

        const value = searchInput.value.toLowerCase().trim();
        let count = 0;

        skillCards.forEach(card => {

            const content = card.textContent.toLowerCase();
            const matches = content.includes(value);

            card.style.display = matches ? "block" : "none";

            if (matches) count++;

        });

        emptyMessage.style.display = count === 0 ? "block" : "none";

    }

    searchButton.addEventListener("click", searchSkills);
    searchInput.addEventListener("input", searchSkills);

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            searchInput.value = "";
            searchSkills();
        }

    });

    document.querySelectorAll(".skill-footer a").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const card = button.closest(".skill-card");
            alert("You selected: " + card.querySelector("h3").textContent);

        });

    });

}


/* =========================================
   2. AUTHENTICATION
========================================= */

const authForm = document.getElementById("authForm");

if (authForm) {

    let isLogin = false;

    const authTitle = document.getElementById("authTitle");
    const authSubtitle = document.getElementById("authSubtitle");
    const authSubmit = document.getElementById("authSubmit");
    const switchMode = document.getElementById("switchMode");
    const switchText = document.getElementById("switchText");
    const nameGroup = document.getElementById("nameGroup");
    const confirmGroup = document.getElementById("confirmGroup");
    const authMessage = document.getElementById("authMessage");

    switchMode.addEventListener("click", function() {

        isLogin = !isLogin;

        authMessage.textContent = "";
        authForm.reset();

        if (isLogin) {

            authTitle.textContent = "Welcome Back";
            authSubtitle.textContent = "Log in to continue your journey.";
            authSubmit.textContent = "Log In →";
            switchText.textContent = "Don't have an account?";
            switchMode.textContent = "Sign Up";

            nameGroup.style.display = "none";
            confirmGroup.style.display = "none";

        } else {

            authTitle.textContent = "Create Your Account";
            authSubtitle.textContent = "Join our community and start exchanging skills.";
            authSubmit.textContent = "Create Account →";
            switchText.textContent = "Already have an account?";
            switchMode.textContent = "Log In";

            nameGroup.style.display = "block";
            confirmGroup.style.display = "block";

        }

    });


    authForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const users = JSON.parse(
            localStorage.getItem("skillBridgeUsers")
        ) || [];

        if (!isLogin) {

            if (!name) {
                authMessage.textContent = "Please enter your full name.";
                return;
            }

            if (password.length < 8) {
                authMessage.textContent = "Password must contain at least 8 characters.";
                return;
            }

            if (password !== confirmPassword) {
                authMessage.textContent = "Passwords do not match.";
                return;
            }

            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                authMessage.textContent = "This email is already registered.";
                return;
            }

            users.push({
                name: name,
                email: email,
                password: password
            });

            localStorage.setItem(
                "skillBridgeUsers",
                JSON.stringify(users)
            );

            alert("Account created successfully! Please log in.");

            isLogin = true;
            authTitle.textContent = "Welcome Back";
            authSubtitle.textContent = "Log in to continue your journey.";
            authSubmit.textContent = "Log In →";
            switchText.textContent = "Don't have an account?";
            switchMode.textContent = "Sign Up";
            nameGroup.style.display = "none";
            confirmGroup.style.display = "none";
            authMessage.textContent = "";

            document.getElementById("email").value = email;
            document.getElementById("password").value = "";

            return;

        }


        const user = users.find(user =>
            user.email === email &&
            user.password === password
        );

        if (!user) {
            authMessage.textContent = "Incorrect email or password.";
            return;
        }

        localStorage.setItem(
            "skillBridgeCurrentUser",
            JSON.stringify({
                name: user.name,
                email: user.email
            })
        );

        window.location.href = "dashboard.html";

    });

}


/* =========================================
   3. CURRENT USER & HOME NAVIGATION
========================================= */

const currentUser = JSON.parse(
    localStorage.getItem("skillBridgeCurrentUser")
);

const navButtons = document.querySelector(".nav-buttons");

if (navButtons) {

    if (currentUser) {

        navButtons.innerHTML = "";

        const welcome = document.createElement("span");
        welcome.className = "login-btn";
        welcome.textContent = "Hello, " + currentUser.name;

        const dashboardLink = document.createElement("a");
        dashboardLink.href = "dashboard.html";
        dashboardLink.className = "login-btn";
        dashboardLink.textContent = "Dashboard";

        const logoutButton = document.createElement("button");
        logoutButton.className = "signup-btn";
        logoutButton.textContent = "Log Out";

        logoutButton.addEventListener("click", function() {

            localStorage.removeItem("skillBridgeCurrentUser");
            window.location.reload();

        });

        navButtons.append(welcome, dashboardLink, logoutButton);

    } else {

        const loginLink = navButtons.querySelector(".login-btn");
        const signupLink = navButtons.querySelector(".signup-btn");

        if (loginLink) loginLink.href = "auth.html";
        if (signupLink) signupLink.href = "auth.html";

    }

}


/* =========================================
   4. USER DASHBOARD
========================================= */

const dashboardPage = document.querySelector(".dashboard-body");

if (dashboardPage) {

    if (!currentUser) {

        window.location.href = "auth.html";

    } else {

        document.getElementById("userName").textContent = currentUser.name;

        document.getElementById("userAvatar").textContent =
            currentUser.name.charAt(0).toUpperCase();

        const storageKey =
            "skillBridgeData_" + encodeURIComponent(currentUser.email);

        let userData = JSON.parse(
            localStorage.getItem(storageKey)
        ) || {
            skills: [],
            learning: []
        };

        function saveDashboardData() {

            localStorage.setItem(storageKey, JSON.stringify(userData));

        }

        function updateStatistics() {

            document.getElementById("offeredCount").textContent =
                userData.skills.length;

            document.getElementById("learningCount").textContent =
                userData.learning.length;

            document.getElementById("connectionCount").textContent = "0";

        }

        function displayItems(items, containerId, emptyText, type) {

            const container = document.getElementById(containerId);

            container.innerHTML = "";

            if (items.length === 0) {

                const empty = document.createElement("div");
                empty.className = "empty-list";
                empty.textContent = emptyText;

                container.appendChild(empty);
                return;

            }

            items.forEach((item, index) => {

                const card = document.createElement("div");
                card.className = "dashboard-item";

                const information = document.createElement("div");

                const title = document.createElement("h3");
                title.textContent = item;

                const subtitle = document.createElement("span");
                subtitle.textContent =
                    type === "skills" ? "Available to teach" : "Learning goal";

                information.append(title, subtitle);

                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-item";
                deleteButton.textContent = "Remove";

                deleteButton.addEventListener("click", function() {

                    items.splice(index, 1);
                    saveDashboardData();
                    renderDashboard();

                });

                card.append(information, deleteButton);
                container.appendChild(card);

            });

        }

        function renderDashboard() {

            displayItems(
                userData.skills,
                "mySkillsList",
                "No skills added yet. Start sharing your knowledge!",
                "skills"
            );

            displayItems(
                userData.learning,
                "learningList",
                "No learning goals yet. Add your first goal!",
                "learning"
            );

            updateStatistics();

        }

        function addItem(inputId, listName) {

            const input = document.getElementById(inputId);
            const value = input.value.trim();

            if (!value) return;

            const exists = userData[listName].some(
                item => item.toLowerCase() === value.toLowerCase()
            );

            if (exists) {
                alert("This item already exists!");
                return;
            }

            userData[listName].push(value);

            saveDashboardData();
            renderDashboard();

            input.value = "";

        }

        document.getElementById("addSkillForm")
            .addEventListener("submit", function(event) {

                event.preventDefault();
                addItem("skillInput", "skills");

            });

        document.getElementById("addLearningForm")
            .addEventListener("submit", function(event) {

                event.preventDefault();
                addItem("learningInput", "learning");

            });

        document.getElementById("dashboardLogout")
            .addEventListener("click", function() {

                localStorage.removeItem("skillBridgeCurrentUser");
                window.location.href = "index.html";

            });

        renderDashboard();

    }

}


/* =========================================
   5. EXPLORE SKILLS - SAMPLE USERS
========================================= */

const people = [

    {
        id: 1,
        name: "Sophia Martin",
        role: "Frontend Developer",
        category: "Technology",
        skill: "JavaScript",
        learning: "UI / UX Design",
        description: "I enjoy building interactive websites and sharing my coding knowledge.",
        location: "Tunisia"
    },

    {
        id: 2,
        name: "Adam Wilson",
        role: "Graphic Designer",
        category: "Design",
        skill: "UI / UX Design",
        learning: "Web Development",
        description: "Passionate about creative design and building beautiful user experiences.",
        location: "Tunisia"
    },

    {
        id: 3,
        name: "Emma Johnson",
        role: "Language Tutor",
        category: "Languages",
        skill: "English",
        learning: "Photography",
        description: "I love helping people improve their English communication skills.",
        location: "Tunisia"
    },

    {
        id: 4,
        name: "Lucas Brown",
        role: "Photographer",
        category: "Creative",
        skill: "Photography",
        learning: "Digital Marketing",
        description: "I capture moments and enjoy teaching the basics of photography.",
        location: "Tunisia"
    },

    {
        id: 5,
        name: "Olivia Davis",
        role: "Marketing Specialist",
        category: "Business",
        skill: "Digital Marketing",
        learning: "English",
        description: "Interested in marketing strategies, branding and communication.",
        location: "Tunisia"
    },

    {
        id: 6,
        name: "Noah Garcia",
        role: "Python Developer",
        category: "Technology",
        skill: "Python",
        learning: "JavaScript",
        description: "I work with Python and enjoy solving programming challenges.",
        location: "Tunisia"
    },

    {
        id: 7,
        name: "Mia Anderson",
        role: "Illustrator",
        category: "Creative",
        skill: "Digital Illustration",
        learning: "UI / UX Design",
        description: "Creative illustrator interested in digital art and visual design.",
        location: "Tunisia"
    },

    {
        id: 8,
        name: "Ethan Thomas",
        role: "Business Student",
        category: "Business",
        skill: "Project Management",
        learning: "Python",
        description: "I enjoy organizing projects and exploring new technologies.",
        location: "Tunisia"
    }

];


/* =========================================
   6. EXPLORE PAGE
========================================= */

const peopleGrid = document.getElementById("peopleGrid");

if (peopleGrid) {

    const exploreSearch = document.getElementById("exploreSearch");
    const exploreSearchBtn = document.getElementById("exploreSearchBtn");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const exploreEmpty = document.getElementById("exploreEmpty");
    const resultsCount = document.getElementById("resultsCount");
    const myRequests = document.getElementById("myRequests");

    const modal = document.getElementById("profileModal");
    const profileDetails = document.getElementById("profileDetails");

    let selectedCategory = "All";

    const requestKey = currentUser
        ? "skillBridgeRequests_" + encodeURIComponent(currentUser.email)
        : null;

    let requests = requestKey
        ? JSON.parse(localStorage.getItem(requestKey)) || []
        : [];


    function saveRequests() {

        if (!requestKey) return;

        localStorage.setItem(requestKey, JSON.stringify(requests));

    }


    // Create people cards
    function renderPeople() {

        const searchValue = exploreSearch.value.toLowerCase().trim();

        const filteredPeople = people.filter(person => {

            const matchesCategory =
                selectedCategory === "All" ||
                person.category === selectedCategory;

            const searchableText = [
                person.name,
                person.role,
                person.category,
                person.skill,
                person.learning,
                person.description
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(searchValue);

            return matchesCategory && matchesSearch;

        });

        peopleGrid.innerHTML = "";

        filteredPeople.forEach(person => {

            const card = document.createElement("article");
            card.className = "person-card";

            const top = document.createElement("div");
            top.className = "person-top";

            const avatar = document.createElement("div");
            avatar.className = "person-avatar";
            avatar.textContent = person.name.charAt(0);

            const userInfo = document.createElement("div");

            const name = document.createElement("h3");
            name.textContent = person.name;

            const role = document.createElement("p");
            role.textContent = person.role;

            userInfo.append(name, role);
            top.append(avatar, userInfo);

            const category = document.createElement("span");
            category.className = "person-category";
            category.textContent = person.category;

            const skillLabel = document.createElement("p");
            skillLabel.className = "person-skill-label";
            skillLabel.textContent = "SKILL OFFERED";

            const skill = document.createElement("h4");
            skill.className = "person-skill";
            skill.textContent = person.skill;

            const description = document.createElement("p");
            description.className = "person-description";
            description.textContent = person.description;

            const learningBox = document.createElement("div");
            learningBox.className = "person-learning";

            const learningLabel = document.createElement("span");
            learningLabel.textContent = "WANTS TO LEARN";

            const learning = document.createElement("strong");
            learning.textContent = person.learning;

            learningBox.append(learningLabel, learning);

            const actions = document.createElement("div");
            actions.className = "person-actions";

            const viewButton = document.createElement("button");
            viewButton.className = "view-profile-btn";
            viewButton.textContent = "View Profile";

            viewButton.addEventListener("click", () => {
                openProfile(person);
            });

            const requestButton = document.createElement("button");
            requestButton.className = "send-request-btn";

            const alreadyRequested = requests.some(
                request => request.id === person.id
            );

            requestButton.textContent = alreadyRequested
                ? "Request Sent"
                : "Send Request";

            requestButton.disabled = alreadyRequested;

            requestButton.addEventListener("click", () => {
                sendRequest(person);
            });

            actions.append(viewButton, requestButton);

            card.append(
                top,
                category,
                skillLabel,
                skill,
                description,
                learningBox,
                actions
            );

            peopleGrid.appendChild(card);

        });

        resultsCount.textContent =
            filteredPeople.length + " people";

        exploreEmpty.style.display =
            filteredPeople.length === 0 ? "block" : "none";

        peopleGrid.style.display =
            filteredPeople.length === 0 ? "none" : "grid";

    }


    // Search
    exploreSearchBtn.addEventListener("click", renderPeople);

    exploreSearch.addEventListener("input", renderPeople);


    // Category filtering
    categoryButtons.forEach(button => {

        button.addEventListener("click", function() {

            categoryButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            selectedCategory = button.dataset.category;

            renderPeople();

        });

    });


    // Reset filters
    document.getElementById("resetExplore")
        .addEventListener("click", function() {

            exploreSearch.value = "";
            selectedCategory = "All";

            categoryButtons.forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.category === "All"
                );

            });

            renderPeople();

        });


    // Profile details
    function openProfile(person) {

        profileDetails.innerHTML = "";

        const content = document.createElement("div");
        content.className = "profile-details-content";

        const avatar = document.createElement("div");
        avatar.className = "person-avatar";
        avatar.textContent = person.name.charAt(0);

        const name = document.createElement("h2");
        name.textContent = person.name;

        const role = document.createElement("span");
        role.className = "person-category";
        role.textContent = person.role;

        const description = document.createElement("p");
        description.textContent = person.description;

        const locationBox = document.createElement("div");
        locationBox.className = "profile-detail-box";

        const locationLabel = document.createElement("span");
        locationLabel.textContent = "LOCATION";

        const location = document.createElement("strong");
        location.textContent = person.location;

        locationBox.append(locationLabel, location);

        const skillBox = document.createElement("div");
        skillBox.className = "profile-detail-box";

        const skillLabel = document.createElement("span");
        skillLabel.textContent = "SKILL OFFERED";

        const skill = document.createElement("strong");
        skill.textContent = person.skill;

        skillBox.append(skillLabel, skill);

        const goalBox = document.createElement("div");
        goalBox.className = "profile-detail-box";

        const goalLabel = document.createElement("span");
        goalLabel.textContent = "WANTS TO LEARN";

        const goal = document.createElement("strong");
        goal.textContent = person.learning;

        goalBox.append(goalLabel, goal);

        content.append(
            avatar,
            name,
            role,
            description,
            locationBox,
            skillBox,
            goalBox
        );

        profileDetails.appendChild(content);

        modal.classList.add("show");

    }


    document.getElementById("closeModal")
        .addEventListener("click", function() {

            modal.classList.remove("show");

        });

    modal.addEventListener("click", function(event) {

        if (event.target === modal) {
            modal.classList.remove("show");
        }

    });


    // Send exchange request
    function sendRequest(person) {

        if (!currentUser) {

            alert("Please log in to send an exchange request.");

            window.location.href = "auth.html";

            return;

        }

        const alreadyRequested = requests.some(
            request => request.id === person.id
        );

        if (alreadyRequested) return;

        requests.push({
            id: person.id,
            name: person.name,
            skill: person.skill,
            date: new Date().toLocaleDateString(),
            status: "Pending"
        });

        saveRequests();

        renderPeople();
        renderRequests();

        alert("Your exchange request has been saved!");

    }


    // Display requests
    function renderRequests() {

        myRequests.innerHTML = "";

        if (!currentUser) {

            const message = document.createElement("p");
            message.className = "request-empty";
            message.textContent = "Log in to manage your exchange requests.";

            myRequests.appendChild(message);
            return;

        }

        if (requests.length === 0) {

            const message = document.createElement("p");
            message.className = "request-empty";
            message.textContent = "You haven't sent any requests yet.";

            myRequests.appendChild(message);
            return;

        }

        requests.forEach(request => {

            const item = document.createElement("div");
            item.className = "request-item";

            const information = document.createElement("div");

            const name = document.createElement("h3");
            name.textContent = request.name;

            const details = document.createElement("p");
            details.textContent =
                request.skill + " • Sent " + request.date;

            information.append(name, details);

            const status = document.createElement("span");
            status.className = "request-status";
            status.textContent = request.status;

            item.append(information, status);

            myRequests.appendChild(item);

        });

    }


    // Account link
    const accountLink = document.getElementById("exploreAccountLink");

    if (currentUser) {

        accountLink.href = "dashboard.html";
        accountLink.textContent = "My Dashboard";

    }

    renderPeople();
    renderRequests();

}


// ==============================
// SKILLBRIDGE MESSAGING SYSTEM
// ==============================

// Check current user
let currentUser = null;

try {
    currentUser = JSON.parse(
        localStorage.getItem("skillBridgeCurrentUser")
    );
} catch (error) {
    currentUser = null;
}

if (!currentUser || !currentUser.email) {
    alert("Please log in to access your messages.");
    window.location.href = "auth.html";
}

// Demo contacts
const contacts = [
    { id: "sarah", name: "Sarah Johnson", role: "UI/UX Designer", initials: "SJ" },
    { id: "adam", name: "Adam Smith", role: "Web Developer", initials: "AS" },
    { id: "emma", name: "Emma Wilson", role: "Graphic Designer", initials: "EW" },
    { id: "james", name: "James Brown", role: "Data Analyst", initials: "JB" },
    { id: "sophia", name: "Sophia Davis", role: "Digital Marketer", initials: "SD" },
    { id: "oliver", name: "Oliver Taylor", role: "Software Developer", initials: "OT" },
    { id: "mia", name: "Mia Anderson", role: "Content Creator", initials: "MA" },
    { id: "noah", name: "Noah Martin", role: "Business Student", initials: "NM" }
];

// Storage
const userEmail = currentUser?.email?.toLowerCase() || "guest";
const storageKey = `skillBridgeMessages_${userEmail}`;

let conversations = {};

try {
    conversations = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch (error) {
    conversations = {};
}

let selectedContact = null;

// HTML elements
const contactsList = document.getElementById("contactsList");
const contactSearch = document.getElementById("contactSearch");
const conversationCount = document.getElementById("conversationCount");
const noContacts = document.getElementById("noContacts");

const chatWelcome = document.getElementById("chatWelcome");
const activeChat = document.getElementById("activeChat");

const chatAvatar = document.getElementById("chatAvatar");
const chatName = document.getElementById("chatName");
const chatRole = document.getElementById("chatRole");

const chatMessages = document.getElementById("chatMessages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

// Save conversations
function saveConversations() {
    localStorage.setItem(storageKey, JSON.stringify(conversations));
}

// Display contacts
function displayContacts(searchText = "") {
    contactsList.innerHTML = "";

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchText.toLowerCase())
    );

    conversationCount.textContent = contacts.length;
    noContacts.style.display = filteredContacts.length ? "none" : "block";

    filteredContacts.forEach(contact => {
        const lastMessages = conversations[contact.id] || [];
        const lastMessage = lastMessages.length
            ? lastMessages[lastMessages.length - 1].text
            : contact.role;

        const contactElement = document.createElement("div");

        contactElement.className = "contact-item";

        if (selectedContact === contact.id) {
            contactElement.classList.add("selected");
        }

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = contact.initials;

        const info = document.createElement("div");
        info.className = "contact-info";

        const name = document.createElement("h3");
        name.textContent = contact.name;

        const preview = document.createElement("p");
        preview.textContent = lastMessage;

        info.append(name, preview);
        contactElement.append(avatar, info);

        contactElement.addEventListener("click", () => {
            openConversation(contact.id);
        });

        contactsList.appendChild(contactElement);
    });
}

// Open a conversation
function openConversation(contactId) {
    selectedContact = contactId;

    const contact = contacts.find(item => item.id === contactId);

    if (!contact) return;

    chatWelcome.classList.add("hidden");
    activeChat.classList.remove("hidden");

    chatAvatar.textContent = contact.initials;
    chatName.textContent = contact.name;
    chatRole.textContent = contact.role;

    displayContacts(contactSearch.value);
    displayMessages();
}

// Display messages
function displayMessages() {
    chatMessages.innerHTML = "";

    const messages = conversations[selectedContact] || [];

    if (messages.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "chat-empty";
        emptyMessage.textContent =
            "No messages yet. Start your conversation!";
        chatMessages.appendChild(emptyMessage);
        return;
    }

    messages.forEach(message => {
        const messageElement = document.createElement("div");

        messageElement.className = message.sender === userEmail
            ? "message sent"
            : "message received";

        const text = document.createElement("span");
        text.textContent = message.text;

        const time = document.createElement("span");
        time.className = "message-time";
        time.textContent = message.time;

        messageElement.append(text, time);
        chatMessages.appendChild(messageElement);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send a message
messageForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!selectedContact) return;

    const text = messageInput.value.trim();

    if (!text) return;

    if (!conversations[selectedContact]) {
        conversations[selectedContact] = [];
    }

    const newMessage = {
        text: text,
        sender: userEmail,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    };

    conversations[selectedContact].push(newMessage);

    saveConversations();

    messageInput.value = "";

    displayMessages();
    displayContacts(contactSearch.value);
});

// Search contacts
contactSearch.addEventListener("input", function() {
    displayContacts(this.value);
});

// Initial display
displayContacts();
