
document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/profile/me";

    let profile = null;
    let originalProfile = null;
    let isSaving = false;

    const profileInitials = document.getElementById("profileInitials");
    const profileRole = document.getElementById("profileRole");
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    const profileFullName = document.getElementById("profileFullName");
    const profilePhone = document.getElementById("profilePhone");
    const profileEmailInput = document.getElementById("profileEmailInput");
    const profileAddress = document.getElementById("profileAddress");

    const editProfileButton = document.getElementById("editProfileButton");
    const saveProfileButton = document.getElementById("saveProfileButton");
    const cancelProfileButton = document.getElementById("cancelProfileButton");
    const profileForm = document.getElementById("profileForm");
    const profileActions = document.getElementById("profileActions");
    const logoutButton = document.getElementById("logoutButton");

    const editableFields = [
        profileFullName,
        profilePhone,
        profileAddress
    ].filter(Boolean);

    const saveButtonHTML =
        '<i class="bi bi-check2"></i> Save changes';

    function showNotice(message, type = "info") {
        if (typeof window.showMessage === "function") {
            window.showMessage(message, type);
        } else {
            window.alert(message);
        }
    }

    function getInitials(name) {
        return String(name || "Patient")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join("");
    }

    function getToken() {
        return localStorage.getItem("healthcareToken");
    }

    async function apiRequest(options = {}) {
        const token = getToken();

        if (!token) {
            throw new Error("Your session has expired. Please log in again.");
        }

        const response = await fetch(API_URL, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...(options.headers || {})
            }
        });

        const result = await response.json().catch(() => ({}));

        if (response.status === 401) {
            throw new Error("Your session has expired. Please log in again.");
        }

        if (!response.ok || result.success !== true) {
            throw new Error(
                result.message || "Unable to process your profile."
            );
        }

        return result;
    }

    function renderProfile() {
        if (!profile) return;

        if (profileInitials) {
            profileInitials.textContent = getInitials(profile.name);
        }

        if (profileName) {
            profileName.textContent = profile.name || "Patient";
        }

        if (profileEmail) {
            profileEmail.textContent = profile.email || "";
        }

        if (profileRole) {
            profileRole.textContent = profile.role || "PATIENT";
        }

        if (profileFullName) {
            profileFullName.value = profile.name || "";
        }

        if (profilePhone) {
            profilePhone.value = profile.phone || "";
        }

        if (profileEmailInput) {
            profileEmailInput.value = profile.email || "";
        }

        if (profileAddress) {
            profileAddress.value = profile.address || "";
        }
    }

    function setEditing(editing) {
        if (profileForm) {
            profileForm.classList.toggle("editing", editing);
        }

        // Explicitly enable or disable the editable inputs.
        editableFields.forEach(field => {
            field.disabled = !editing || isSaving;
        });

        // Email remains read-only.
        if (profileEmailInput) {
            profileEmailInput.disabled = false;
            profileEmailInput.readOnly = true;
        }

        if (profileActions) {
            profileActions.hidden = !editing;
        }

        if (saveProfileButton) {
            saveProfileButton.disabled = !editing || isSaving;
            saveProfileButton.innerHTML = isSaving
                ? '<i class="bi bi-hourglass-split"></i> Saving...'
                : saveButtonHTML;
        }

        if (cancelProfileButton) {
            cancelProfileButton.disabled = !editing || isSaving;
        }

        if (editProfileButton) {
            editProfileButton.disabled = editing || isSaving;
        }
    }

    function openEditMode() {
        if (!profile || isSaving) return;

        originalProfile = { ...profile };

        renderProfile();
        setEditing(true);

        profileFullName?.focus();

        profileForm?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function closeEditMode() {
        if (isSaving) return;

        if (originalProfile) {
            profile = { ...originalProfile };
        }

        renderProfile();
        setEditing(false);
        originalProfile = null;
    }

    async function loadProfile() {
        try {
            const result = await apiRequest();

            profile = result.data;

            if (!profile) {
                throw new Error("No profile data was returned by the server.");
            }

            renderProfile();
            setEditing(false);
        } catch (error) {
            console.error("Load profile error:", error);
            showNotice(error.message, "error");

            if (/log in again/i.test(error.message)) {
                localStorage.removeItem("healthcareToken");
                localStorage.removeItem("healthcareUser");

                window.location.href = "login.html";
            }
        }
    }

    editProfileButton?.addEventListener("click", openEditMode);

    cancelProfileButton?.addEventListener("click", closeEditMode);

    profileForm?.addEventListener("submit", async event => {
        event.preventDefault();

        if (isSaving || !profile) return;

        const name = profileFullName.value.trim();
        const phone = profilePhone.value.trim();
        const address = profileAddress.value.trim();

        if (!name) {
            showNotice("Full name is required.", "warning");
            profileFullName.focus();
            return;
        }

        if (name.length > 150) {
            showNotice("Name must be 150 characters or fewer.", "warning");
            return;
        }

        if (phone.length > 20) {
            showNotice("Phone number is too long.", "warning");
            return;
        }

        if (address.length > 500) {
            showNotice("Address must be 500 characters or fewer.", "warning");
            return;
        }

        isSaving = true;
        setEditing(true);

        try {
            const result = await apiRequest({
                method: "PUT",
                body: JSON.stringify({ name, phone, address })
            });

            profile = result.data;

            if (!profile) {
                throw new Error("The server did not return the updated profile.");
            }

            originalProfile = null;

            renderProfile();

            // Update cached user details for the rest of the application.
            try {
                const cachedUser = JSON.parse(
                    localStorage.getItem("healthcareUser") || "{}"
                );

                localStorage.setItem(
                    "healthcareUser",
                    JSON.stringify({
                        ...cachedUser,
                        id: profile.id ?? cachedUser.id,
                        fullName: profile.name,
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        address: profile.address,
                        role: profile.role
                    })
                );
            } catch (cacheError) {
                console.warn(
                    "Could not update cached user details:",
                    cacheError
                );
            }

            showNotice("Profile updated successfully.", "success");
        } catch (error) {
            console.error("Save profile error:", error);
            showNotice(error.message, "error");
        } finally {
            isSaving = false;

            // Return to view mode after a successful save.
            // Keep edit mode open if the request failed.
            const saveSucceeded = originalProfile === null;

            if (saveSucceeded) {
                setEditing(false);
            } else {
                setEditing(true);
            }
        }
    });

    logoutButton?.addEventListener("click", () => {
        if (!window.confirm("Are you sure you want to log out?")) {
            return;
        }

        localStorage.removeItem("healthcareToken");
        localStorage.removeItem("healthcareUser");
        localStorage.removeItem("healthcareProfile");

        window.location.href = "login.html";
    });

    loadProfile();
});
