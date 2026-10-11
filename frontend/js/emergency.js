
document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://healthcare-connect-api.onrender.com/api/emergency-contacts";
    const container = document.getElementById("emergencyContacts");

    if (!container) return;

    const token = localStorage.getItem("healthcareToken");

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function validPhone(value) {
        const phone = String(value ?? "").trim();

        // Allow common international prefixes, spaces, and phone punctuation.
        if (!/^[+()\d\s.-]+$/.test(phone)) return false;

        const digits = phone.replace(/\D/g, "");
        return digits.length >= 3 && digits.length <= 15;
    }

    function getIcon(type) {
        const value = String(type || "").toLowerCase();

        if (value.includes("ambulance")) return "bi-truck";
        if (value.includes("hospital")) return "bi-hospital";
        if (value.includes("police")) return "bi-shield-check";
        if (value.includes("fire")) return "bi-fire";
        if (value.includes("helpline")) return "bi-headset";

        return "bi-telephone";
    }

    function renderContacts(contacts) {
        if (!contacts.length) {
            container.innerHTML = `
                <div class="emergency-empty">
                    <i class="bi bi-info-circle"></i>
                    No emergency contacts are currently available.
                    If you need urgent help in India, call 112.
                </div>
            `;
            return;
        }

        container.innerHTML = contacts.map(contact => {
            const name = escapeHtml(contact.name || "Emergency contact");
            const type = escapeHtml(contact.type || "Emergency service");

            const location = [
                contact.address,
                contact.city,
                contact.state
            ]
                .filter(Boolean)
                .join(", ");

            const safeLocation = escapeHtml(location || "Location not specified");
            const icon = getIcon(contact.type);
            const phoneIsValid = validPhone(contact.phone);
            const phone = String(contact.phone ?? "").trim();

            const callAction = phoneIsValid
                ? `<a href="tel:${encodeURIComponent(phone)}">
                       <i class="bi bi-telephone-fill"></i>
                       Call ${escapeHtml(phone)}
                   </a>`
                : `<span>Phone number unavailable</span>`;

            return `
                <article class="emergency-contact-card">
                    <div class="emergency-contact-icon">
                        <i class="bi ${icon}" aria-hidden="true"></i>
                    </div>

                    <div class="emergency-contact-content">
                        <h3>${name}</h3>
                        <p>
                            ${type}<br>
                            ${safeLocation}
                        </p>
                        ${callAction}
                    </div>
                </article>
            `;
        }).join("");
    }

    async function loadEmergencyContacts() {
        if (!token) {
            container.innerHTML = `
                <div class="emergency-error">
                    <i class="bi bi-lock"></i>
                    Please log in to view emergency contacts.
                    <a href="login.html">Log in</a>
                </div>
            `;
            return;
        }

        try {
            const response = await fetch(API_URL, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            const result = await response.json().catch(() => ({}));

            if (response.status === 401) {
                localStorage.removeItem("healthcareToken");
                localStorage.removeItem("healthcareUser");
                localStorage.removeItem("healthcareProfile");

                window.location.href = "login.html";
                return;
            }

            if (!response.ok || result.success !== true) {
                throw new Error(
                    result.message || "Unable to load emergency contacts."
                );
            }

            const contacts = Array.isArray(result.data)
                ? result.data
                : [];

            renderContacts(contacts);
        } catch (error) {
            console.error("Emergency contacts error:", error);

            container.innerHTML = `
                <div class="emergency-error">
                    <i class="bi bi-exclamation-circle"></i>
                    Emergency contacts could not be loaded.
                    You can still use the emergency call button above.
                    Please try again later.
                </div>
            `;
        }
    }

    loadEmergencyContacts();
});
