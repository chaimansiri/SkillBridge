
/* =================================
   SKILLBRIDGE - ADMIN DASHBOARD
================================= */

// This is a frontend demo panel, not secure admin authentication.

const totalUsers = document.getElementById("totalUsers");
const totalSkills = document.getElementById("totalSkills");
const totalMessages = document.getElementById("totalMessages");
const totalNotifications = document.getElementById("totalNotifications");

const usersTableBody = document.getElementById("usersTableBody");
const usersEmpty = document.getElementById("usersEmpty");
const userSearch = document.getElementById("userSearch");

const skillsOverview = document.getElementById("skillsOverview");
const activityList = document.getElementById("activityList");

const adminLogout = document.getElementById("adminLogout");

// Load registered users
function getUsers() {
    try {
        return JSON.parse(
            localStorage.getItem("skillBridgeUsers")
        ) || [];
    } catch (error) {
        return [];
    }
}

// Load all local storage entries matching a prefix
function getStoredEntries(prefix) {
    const entries = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith(prefix)) {
            try {
                entries.push({
                    key,
                    data: JSON.parse(localStorage.getItem(key))
                });
            } catch (error) {
                // Ignore invalid stored data
            }
        }
    }

    return entries;
}

// Calculate statistics
function updateStatistics() {
    const users = getUsers();

    const dataEntries = getStoredEntries("skillBridgeData_");
    const messageEntries = getStoredEntries("skillBridgeMessages_");
    const notificationEntries = getStoredEntries("skillBridgeNotifications_");

    let skillCount = 0;
    let messageCount = 0;
    let notificationCount = 0;

    dataEntries.forEach(entry => {
        const data = entry.data;

        if (data && Array.isArray(data.skills)) {
            skillCount += data.skills.length;
        }
    });

    messageEntries.forEach(entry => {
        const conversations = entry.data;

        if (conversations && typeof conversations === "object") {
            Object.values(conversations).forEach(messages => {
                if (Array.isArray(messages)) {
                    messageCount += messages.length;
                }
            });
        }
    });

    notificationEntries.forEach(entry => {
        if (Array.isArray(entry.data)) {
            notificationCount += entry.data.length;
        }
    });

    totalUsers.textContent = users.length;
    totalSkills.textContent = skillCount;
    totalMessages.textContent = messageCount;
    totalNotifications.textContent = notificationCount;
}

// Render users table
function renderUsers(search = "") {
    const users = getUsers();

    usersTableBody.innerHTML = "";

    const filteredUsers = users.filter(user => {
        const name = user.name || user.fullName || "";
        const email = user.email || "";

        return (
            name.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase())
        );
    });

    usersEmpty.classList.toggle(
        "hidden",
        filteredUsers.length !== 0
    );

    filteredUsers.forEach(user => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const userInfo = document.createElement("div");
        userInfo.className = "admin-user-cell";

        const avatar = document.createElement("div");
        avatar.className = "table-avatar";
        avatar.textContent = user.avatar || "👤";

        const name = document.createElement("strong");
        name.textContent = user.name || user.fullName || "User";

        userInfo.append(avatar, name);
        nameCell.appendChild(userInfo);

        const emailCell = document.createElement("td");
        emailCell.textContent = user.email || "";

        const interestsCell = document.createElement("td");
        interestsCell.textContent = Array.isArray(user.interests)
            ? user.interests.join(", ") || "Not specified"
            : "Not specified";

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-user";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(
                "Delete this account from this browser?"
            );

            if (!confirmed) return;

            deleteUser(user.email);
        });

        actionCell.appendChild(deleteButton);

        row.append(
            nameCell,
            emailCell,
            interestsCell,
            actionCell
        );

        usersTableBody.appendChild(row);
    });
}

// Delete user from demo local storage
function deleteUser(email) {
    if (!email) return;

    const users = getUsers();

    const updatedUsers = users.filter(user =>
        user.email.toLowerCase() !== email.toLowerCase()
    );

    localStorage.setItem(
        "skillBridgeUsers",
        JSON.stringify(updatedUsers)
    );

    // Remove account-specific data
    const prefixes = [
        "skillBridgeData_",
        "skillBridgeRequests_",
        "skillBridgeMessages_",
        "skillBridgeNotifications_"
    ];

    prefixes.forEach(prefix => {
        localStorage.removeItem(prefix + email.toLowerCase());
    });

    // Remove active session if it belongs to this account
    try {
        const session = JSON.parse(
            localStorage.getItem("skillBridgeCurrentUser")
        );

        if (
            session &&
            session.email.toLowerCase() === email.toLowerCase()
        ) {
            localStorage.removeItem("skillBridgeCurrentUser");
        }
    } catch (error) {
        // Ignore invalid session data
    }

    refreshDashboard();
}

// Skills overview
function renderSkills() {
    skillsOverview.innerHTML = "";

    const entries = getStoredEntries("skillBridgeData_");

    const skillCounts = {};

    entries.forEach(entry => {
        const data = entry.data;

        if (data && Array.isArray(data.skills)) {
            data.skills.forEach(skill => {
                const skillName =
                    typeof skill === "string"
                        ? skill
                        : skill.name || skill.title || "Other";

                skillCounts[skillName] =
                    (skillCounts[skillName] || 0) + 1;
            });
        }
    });

    const skillNames = Object.keys(skillCounts);

    if (skillNames.length === 0) {
        const empty = document.createElement("p");
        empty.className = "admin-empty";
        empty.textContent = "No saved skills found yet.";
        skillsOverview.appendChild(empty);
        return;
    }

    skillNames.forEach(skill => {
        const card = document.createElement("div");
        card.className = "skill-admin-card";

        const title = document.createElement("strong");
        title.textContent = skill;

        const count = document.createElement("span");
        count.textContent = skillCounts[skill] + " saved entries";

        card.append(title, count);
        skillsOverview.appendChild(card);
    });
}

// Activity list
function renderActivity() {
    activityList.innerHTML = "";

    const users = getUsers();

    if (users.length === 0) {
        const empty = document.createElement("p");
        empty.className = "admin-empty";
        empty.textContent = "No registered users yet.";
        activityList.appendChild(empty);
        return;
    }

    users.slice(-5).reverse().forEach(user => {
        const item = document.createElement("div");
        item.className = "activity-item";

        const icon = document.createElement("div");
        icon.className = "activity-icon";
        icon.textContent = "♙";

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent =
            (user.name || user.fullName || "A user") +
            " registered an account";

        const description = document.createElement("p");
        description.textContent =
            user.email || "Account registration";

        details.append(title, description);
        item.append(icon, details);

        activityList.appendChild(item);
    });
}

// Refresh all sections
function refreshDashboard() {
    updateStatistics();
    renderUsers(userSearch.value);
    renderSkills();
    renderActivity();
}

// Search
userSearch.addEventListener("input", () => {
    renderUsers(userSearch.value);
});

// Logout admin demo
adminLogout.addEventListener("click", () => {
    window.location.href = "index.html";
});

// Initial loading
refreshDashboard();
