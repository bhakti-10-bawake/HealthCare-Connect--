const API_BASE_URL = "http://localhost:5000/api";

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
        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}

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


// ===============================
// LOGIN
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage(
                "Please enter your email and password.",
                "warning"
            );

            return;
        }

        try {
            showMessage("Signing you in...", "info");

            const data = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            });

            // Store authentication information
            localStorage.setItem("healthcareToken", data.token);

            localStorage.setItem(
                "healthcareUser",
                JSON.stringify(data.user)
            );

            showMessage(
                "Login successful. Redirecting...",
                "success"
            );

            // Redirect based on user role
            setTimeout(() => {

                const role = data.user.role;

                if (role === "DOCTOR") {
                    window.location.href = "doctor-dashboard.html";
                } else if (role === "PHARMACY") {
                    window.location.href = "pharmacy-dashboard.html";
                } else if (role === "ADMIN") {
                    window.location.href = "admin-dashboard.html";
                } else {
                    window.location.href = "dashboard.html";
                }

            }, 800);

        } catch (error) {

            console.error("Login error:", error);

            showMessage(
                error.message || "Login failed.",
                "danger"
            );
        }
    });

});