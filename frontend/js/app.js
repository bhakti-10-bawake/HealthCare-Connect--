/**
 * Healthcare Connect
 * Global Frontend Utilities
 */

const API_BASE_URL = "http://localhost:5000/api";

/**
 * API helper
 *
 * All frontend API requests will eventually
 * go through this function.
 */
async function apiRequest(endpoint, options = {}) {

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong."
        );
    }

    return data;
}


/**
 * Display a simple application message.
 */
function showMessage(message, type = "info") {

    const existing = document.querySelector(".app-message");

    if (existing) {
        existing.remove();
    }

    const messageElement = document.createElement("div");

    messageElement.className = `alert alert-${type} app-message`;

    messageElement.style.position = "fixed";
    messageElement.style.top = "20px";
    messageElement.style.right = "20px";
    messageElement.style.zIndex = "1000";
    messageElement.style.maxWidth = "350px";

    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 4000);
}


/**
 * Global login form handler.
 *
 * The actual authentication API will be connected
 * when we build the authentication module.
 */
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        if (!email || !password) {
            showMessage(
                "Please enter your email and password.",
                "warning"
            );

            return;
        }

        /*
         * Authentication endpoint will be connected
         * after the backend authentication module
         * is implemented.
         */

        showMessage(
            "Login system is being connected to the backend.",
            "info"
        );
    });

});