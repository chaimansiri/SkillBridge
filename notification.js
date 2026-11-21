
/* =================================
   SKILLBRIDGE - NOTIFICATIONS
================================= */

const currentUser = JSON.parse(
    localStorage.getItem("skillBridgeCurrentUser")
);

if (!currentUser || !currentUser.email) {
    window.location.href = "auth.html";
}

const storageKey =
    "skillBridgeNotifications_" + currentUser.email.toLowerCase();

const notificationsList = document.getElementById("notificationsList");
const unreadCount = document.getElementById("unreadCount");
const emptyNotifications = document.getElementById("emptyNotifications");

const markAllReadBtn = document.getElementById("markAllRead");
const clearAllBtn = document.getElementById("clearAll");
const logoutBtn = document.getElementById("logoutBtn");

let activeFilter = "all";

let notifications = [];

try {
    notifications = JSON.parse(
        localStorage.getItem(storageKey)
    ) || [];
} catch (error) {
    notifications = [];
}

// Demo notifications for first visit
if (notifications.length === 0) {
    notifications = [
        {
            id: 1,
            type: "request",
            title: "Welcome to SkillBridge!",
            message: "Your learning journey starts here. Explore new skills and connect with learners.",
            time: Date.now() - 60000,
            read: false
        },
        {
            id: 2,
            type: "message",
            title: "New conversation available",
            message: "Visit your Messages page to discover your learning community.",
            time: Date.now() - 3600000,
            read: false
        },
        {
            id: 3,
            type: "learning",
            title: "Explore new skills",
            message: "Discover new opportunities and find people who share your interests.",
            time: Date.now() - 86400000,
            read: true
        }
    ];

    saveNotifications();
}

// Save notifications
function saveNotifications() {
    localStorage.setItem(
        storageKey,
        JSON.stringify(notifications)
    );
}

// Time display
function getTimeAgo(timestamp) {
    const difference = Date.now() - timestamp;

    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(difference / 3600000);
    const days = Math.floor(difference / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return minutes + " minutes ago";
    if (hours < 24) return hours + " hours ago";
    if (days < 7) return days + " days ago";

    return new Date(timestamp).toLocaleDateString();
}

// Notification icons
function getIcon(type) {
    const icons = {
        request: "♧",
        message: "✉",
        learning: "✦",
        system: "⚙"
    };

    return icons[type] || "♧";
}

// Update unread counter
function updateUnreadCount() {
    const count = notifications.filter(item => !item.read).length;
    unreadCount.textContent = count;
}

// Display notifications
function renderNotifications() {
    notificationsList.innerHTML = "";

    updateUnreadCount();

    let filtered = notifications;

    if (activeFilter === "unread") {
        filtered = notifications.filter(item => !item.read);
    }

    if (activeFilter === "read") {
        filtered = notifications.filter(item => item.read);
    }

    emptyNotifications.classList.toggle(
        "hidden",
        filtered.length !== 0
    );

    filtered.forEach(item => {
        const card = document.createElement("article");

        card.className = "notification-item";

        if (!item.read) {
            card.classList.add("unread");
        }

        const icon = document.createElement("div");
        icon.className = "notification-icon";
        icon.textContent = getIcon(item.type);

        const content = document.createElement("div");
        content.className = "notification-content";

        const title = document.createElement("h3");
        title.textContent = item.title;

        const message = document.createElement("p");
        message.textContent = item.message;

        const time = document.createElement("time");
        time.textContent = getTimeAgo(item.time);

        content.append(title, message, time);

        const actions = document.createElement("div");
        actions.className = "notification-actions";

        const readButton = document.createElement("button");
        readButton.textContent = item.read ? "Read" : "Mark as read";
        readButton.addEventListener("click", () => {
            item.read = true;
            saveNotifications();
            renderNotifications();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            notifications = notifications.filter(
                notification => notification.id !== item.id
            );

            saveNotifications();
            renderNotifications();
        });

        actions.append(readButton, deleteButton);

        card.append(icon, content, actions);

        if (!item.read) {
            const indicator = document.createElement("span");
            indicator.className = "unread-indicator";
            card.appendChild(indicator);
        }

        notificationsList.appendChild(card);
    });
}

// Filters
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        activeFilter = button.dataset.filter;

        renderNotifications();
    });
});

// Mark all as read
markAllReadBtn.addEventListener("click", () => {
    notifications.forEach(item => {
        item.read = true;
    });

    saveNotifications();
    renderNotifications();
});

// Clear all
clearAllBtn.addEventListener("click", () => {
    if (notifications.length === 0) return;

    const confirmed = confirm(
        "Are you sure you want to delete all notifications?"
    );

    if (!confirmed) return;

    notifications = [];

    saveNotifications();
    renderNotifications();
});

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("skillBridgeCurrentUser");
    window.location.href = "auth.html";
});

// Initial display
renderNotifications();
