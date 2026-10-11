const API_BASE_URL = "https://healthcare-connect-api.onrender.com/api";


/* =========================================
   API REQUEST
========================================= */

async function apiRequest(endpoint, options = {}) {

    const token =
        localStorage.getItem("healthcareToken");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };


    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );


    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }


    if (!response.ok) {

        if (response.status === 401) {

            localStorage.removeItem(
                "healthcareToken"
            );

            localStorage.removeItem(
                "healthcareUser"
            );
        }


        throw new Error(
            data.message ||
            "Something went wrong. Please try again."
        );
    }


    return data;
}


/* =========================================
   SHOW MESSAGE
========================================= */

function showMessage(
    message,
    type = "info"
) {

    const existing =
        document.querySelector(".app-message");

    if (existing) {
        existing.remove();
    }


    const messageElement =
        document.createElement("div");

    messageElement.className =
        `alert alert-${type} app-message`;


    Object.assign(
        messageElement.style,
        {
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "1000",
            maxWidth: "350px",
            boxShadow:
                "0 8px 24px rgba(23, 53, 52, 0.12)"
        }
    );


    messageElement.textContent = message;

    document.body.appendChild(
        messageElement
    );


    setTimeout(() => {

        if (messageElement.parentNode) {
            messageElement.remove();
        }

    }, 4000);
}


/* =========================================
   CURRENT USER
========================================= */

function getCurrentUser() {

    const storedUser =
        localStorage.getItem("healthcareUser");

    if (!storedUser) {
        return null;
    }


    try {
        return JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Unable to read current user:",
            error
        );

        return null;
    }
}


/* =========================================
   AUTH CHECK
========================================= */

function isLoggedIn() {

    return Boolean(
        localStorage.getItem(
            "healthcareToken"
        )
    );
}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem(
        "healthcareToken"
    );

    localStorage.removeItem(
        "healthcareUser"
    );

    window.location.href =
        "login.html";
}


/* =========================================
   HTML ESCAPING
========================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   INITIALS
========================================= */

function getInitials(name) {

    if (!name) {
        return "HC";
    }


    return name
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();
}


/* =========================================
   ACTIVE NAVIGATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        document
            .querySelectorAll(
                "[data-nav-page]"
            )
            .forEach(link => {

                const targetPage =
                    link.dataset.navPage;

                if (
                    targetPage &&
                    targetPage === currentPage
                ) {
                    link.classList.add("active");
                }
            });


        /* Global logout buttons */

        document
            .querySelectorAll(
                "[data-action='logout']"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    logoutUser
                );
            });

    }
);