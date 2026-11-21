
/* =================================
   SKILLBRIDGE - MESSAGING SYSTEM
================================= */

// Check logged-in user
const currentUser = JSON.parse(
    localStorage.getItem("skillBridgeCurrentUser")
);

if (!currentUser || !currentUser.email) {
    window.location.href = "auth.html";
}

// Demo contacts
const contacts = [
    {
        id: "sarah",
        name: "Sarah Johnson",
        skill: "UI/UX Design",
        avatar: "S"
    },
    {
        id: "adam",
        name: "Adam Smith",
        skill: "Web Development",
        avatar: "A"
    },
    {
        id: "lina",
        name: "Lina Martinez",
        skill: "Machine Learning",
        avatar: "L"
    },
    {
        id: "youssef",
        name: "Youssef Ben Ali",
        skill: "Python Programming",
        avatar: "Y"
    },
    {
        id: "emma",
        name: "Emma Wilson",
        skill: "Digital Marketing",
        avatar: "E"
    },
    {
        id: "alex",
        name: "Alex Brown",
        skill: "Graphic Design",
        avatar: "A"
    }
];

// DOM elements
const userNameElement = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const contactsList = document.getElementById("contactsList");
const contactSearch = document.getElementById("contactSearch");
const conversationCount = document.getElementById("conversationCount");

const emptyChat = document.getElementById("emptyChat");
const activeChat = document.getElementById("activeChat");

const chatAvatar = document.getElementById("chatAvatar");
const chatName = document.getElementById("chatName");
const chatSkill = document.getElementById("chatSkill");

const messagesList = document.getElementById("messagesList");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

// Current selected contact
let selectedContact = null;

// Unique storage key for each account
const storageKey =
    "skillBridgeMessages_" + currentUser.email.toLowerCase();

// Load saved conversations
let conversations = {};

try {
    conversations = JSON.parse(
        localStorage.getItem(storageKey)
    ) || {};
} catch (error) {
    conversations = {};
}

// Display user name
userNameElement.textContent =
    currentUser.name || currentUser.fullName || "My Account";

// Save conversations
function saveConversations() {
    localStorage.setItem(
        storageKey,
        JSON.stringify(conversations)
    );
}

// Get conversation messages
function getMessages(contactId) {
    if (!conversations[contactId]) {
        conversations[contactId] = [];
    }

    return conversations[contactId];
}

// Format message time
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Get last message
function getLastMessage(contactId) {
    const messages = getMessages(contactId);

    if (messages.length === 0) {
        return "Start a conversation";
    }

    return messages[messages.length - 1].text;
}

// Render contacts
function renderContacts(searchValue = "") {
    contactsList.innerHTML = "";

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        contact.skill.toLowerCase().includes(searchValue.toLowerCase())
    );

    conversationCount.textContent = contacts.length;

    if (filteredContacts.length === 0) {
        contactsList.innerHTML =
            '<p class="no-contacts">No conversations found.</p>';
        return;
    }

    filteredContacts.forEach(contact => {
        const messages = getMessages(contact.id);
        const lastMessage = messages.length > 0
            ? messages[messages.length - 1]
            : null;

        const button = document.createElement("button");
        button.className = "contact-item";

        if (selectedContact && selectedContact.id === contact.id) {
            button.classList.add("selected");
        }

        const avatar = document.createElement("div");
        avatar.className = "contact-avatar";
        avatar.textContent = contact.avatar;

        const details = document.createElement("div");
        details.className = "contact-details";

        const name = document.createElement("h3");
        name.textContent = contact.name;

        const preview = document.createElement("p");
        preview.textContent = getLastMessage(contact.id);

        details.append(name, preview);

        const meta = document.createElement("div");
        meta.className = "contact-meta";

        if (lastMessage) {
            const time = document.createElement("span");
            time.className = "contact-time";
            time.textContent = formatTime(lastMessage.time);
            meta.appendChild(time);
        }

        button.append(avatar, details, meta);

        button.addEventListener("click", () => {
            openConversation(contact);
        });

        contactsList.appendChild(button);
    });
}

// Open a conversation
function openConversation(contact) {
    selectedContact = contact;

    emptyChat.classList.add("hidden");
    activeChat.classList.remove("hidden");

    chatAvatar.textContent = contact.avatar;
    chatName.textContent = contact.name;
    chatSkill.textContent = contact.skill;

    renderMessages();
    renderContacts(contactSearch.value);

    messageInput.focus();
}

// Display messages
function renderMessages() {
    if (!selectedContact) return;

    messagesList.innerHTML = "";

    const messages = getMessages(selectedContact.id);

    if (messages.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "no-contacts";
        emptyMessage.textContent =
            "No messages yet. Say hello and start learning together!";
        messagesList.appendChild(emptyMessage);
        return;
    }

    messages.forEach(message => {
        const row = document.createElement("div");

        row.className = message.sender === "me"
            ? "message-row sent"
            : "message-row received";

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.textContent = message.text;

        const time = document.createElement("span");
        time.className = "message-time";
        time.textContent = formatTime(message.time);

        row.append(bubble, time);
        messagesList.appendChild(row);
    });

    messagesList.scrollTop = messagesList.scrollHeight;
}

// Send message
messageForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!selectedContact) return;

    const text = messageInput.value.trim();

    if (text === "") return;

    const messages = getMessages(selectedContact.id);

    messages.push({
        sender: "me",
        text: text,
        time: Date.now()
    });

    saveConversations();

    messageInput.value = "";

    renderMessages();
    renderContacts(contactSearch.value);
});

// Search contacts
contactSearch.addEventListener("input", function() {
    renderContacts(this.value);
});

// Logout
logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("skillBridgeCurrentUser");
    window.location.href = "auth.html";
});

// Initial display
renderContacts();
