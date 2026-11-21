
/* =================================
   SKILLBRIDGE - PROFILE SETTINGS
================================= */

// Check current account
let currentUser = JSON.parse(
    localStorage.getItem("skillBridgeCurrentUser")
);

if (!currentUser || !currentUser.email) {
    window.location.href = "auth.html";
}

// Elements
const profileForm = document.getElementById("profileForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const bioInput = document.getElementById("bio");
const avatarSelect = document.getElementById("avatarSelect");

const previewAvatar = document.getElementById("previewAvatar");
const largeAvatar = document.getElementById("largeAvatar");

const previewName = document.getElementById("previewName");
const previewEmail = document.getElementById("previewEmail");

const saveMessage = document.getElementById("saveMessage");

const logoutBtn = document.getElementById("logoutBtn");
const logoutBtnSecondary = document.getElementById("logoutBtnSecondary");

// Default profile data
const defaultProfile = {
    fullName: currentUser.name || currentUser.fullName || "",
    email: currentUser.email || "",
    bio: currentUser.bio || "",
    avatar: currentUser.avatar || "👤",
    interests: currentUser.interests || []
};

// Display profile
function loadProfile() {
    fullNameInput.value = defaultProfile.fullName;
    emailInput.value = defaultProfile.email;
    bioInput.value = defaultProfile.bio;
    avatarSelect.value = defaultProfile.avatar;

    document.querySelectorAll(
        'input[name="interests"]'
    ).forEach(checkbox => {
        checkbox.checked = defaultProfile.interests.includes(
            checkbox.value
        );
    });

    updatePreview();
}

// Update profile preview
function updatePreview() {
    const name = fullNameInput.value.trim() || "Your Name";
    const email = emailInput.value.trim() || "your@email.com";
    const avatar = avatarSelect.value;

    previewName.textContent = name;
    previewEmail.textContent = email;

    previewAvatar.textContent = avatar;
    largeAvatar.textContent = avatar;
}

// Update preview when editing
fullNameInput.addEventListener("input", updatePreview);
emailInput.addEventListener("input", updatePreview);
avatarSelect.addEventListener("change", updatePreview);

// Migrate account-specific local data after email change
function migrateUserData(oldEmail, newEmail) {
    const oldPrefix = oldEmail.toLowerCase();
    const newPrefix = newEmail.toLowerCase();

    const storageTypes = [
        "skillBridgeData_",
        "skillBridgeRequests_",
        "skillBridgeMessages_",
        "skillBridgeNotifications_"
    ];

    storageTypes.forEach(prefix => {
        const oldKey = prefix + oldPrefix;
        const newKey = prefix + newPrefix;

        const oldData = localStorage.getItem(oldKey);

        if (oldData !== null) {
            if (localStorage.getItem(newKey) === null) {
                localStorage.setItem(newKey, oldData);
            }

            localStorage.removeItem(oldKey);
        }
    });
}

// Update user record in the users list
function updateUsersList(oldEmail, updatedUser) {
    let users = [];

    try {
        users = JSON.parse(
            localStorage.getItem("skillBridgeUsers")
        ) || [];
    } catch (error) {
        users = [];
    }

    const userIndex = users.findIndex(user =>
        user.email &&
        user.email.toLowerCase() === oldEmail.toLowerCase()
    );

    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            ...updatedUser
        };

        localStorage.setItem(
            "skillBridgeUsers",
            JSON.stringify(users)
        );
    }
}

// Save profile
profileForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const bio = bioInput.value.trim();
    const avatar = avatarSelect.value;

    const interests = Array.from(
        document.querySelectorAll(
            'input[name="interests"]:checked'
        )
    ).map(checkbox => checkbox.value);

    if (!fullName || !email) {
        saveMessage.textContent =
            "Please complete your name and email.";
        saveMessage.style.color = "#ef9aa9";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        saveMessage.textContent =
            "Please enter a valid email address.";
        saveMessage.style.color = "#ef9aa9";
        return;
    }

    const oldEmail = currentUser.email;

    // Check if another account already uses this email
    let users = [];

    try {
        users = JSON.parse(
            localStorage.getItem("skillBridgeUsers")
        ) || [];
    } catch (error) {
        users = [];
    }

    const emailAlreadyUsed = users.some(user =>
        user.email &&
        user.email.toLowerCase() === email &&
        user.email.toLowerCase() !== oldEmail.toLowerCase()
    );

    if (emailAlreadyUsed) {
        saveMessage.textContent =
            "This email is already used by another account.";
        saveMessage.style.color = "#ef9aa9";
        return;
    }

    // Update account information
    const updatedUser = {
        ...currentUser,
        name: fullName,
        fullName: fullName,
        email: email,
        bio: bio,
        avatar: avatar,
        interests: interests
    };

    try {
        // Migrate local data if email changed
        if (oldEmail.toLowerCase() !== email) {
            migrateUserData(oldEmail, email);
        }

        // Update users list
        updateUsersList(oldEmail, updatedUser);

        // Update current session
        currentUser = updatedUser;

        localStorage.setItem(
            "skillBridgeCurrentUser",
            JSON.stringify(currentUser)
        );

        // Update saved form defaults
        Object.assign(defaultProfile, {
            fullName,
            email,
            bio,
            avatar,
            interests
        });

        updatePreview();

        saveMessage.textContent = "Profile updated successfully!";
        saveMessage.style.color = "#67d9a1";

    } catch (error) {
        saveMessage.textContent =
            "Unable to save changes. Please try again.";
        saveMessage.style.color = "#ef9aa9";
    }
});

// Reset form to last saved values
profileForm.addEventListener("reset", function() {
    setTimeout(() => {
        loadProfile();
        saveMessage.textContent = "";
    }, 0);
});

// Logout
function logout() {
    localStorage.removeItem("skillBridgeCurrentUser");
    window.location.href = "auth.html";
}

logoutBtn.addEventListener("click", logout);
logoutBtnSecondary.addEventListener("click", logout);

// Initial loading
loadProfile();

