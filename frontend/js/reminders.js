
document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/reminders";

    const reminderList = document.getElementById("reminderList");
    const remindersEmpty = document.getElementById("remindersEmpty");
    const reminderFormSection = document.getElementById("reminderFormSection");
    const reminderForm = document.getElementById("reminderForm");
    const todayReminderCount = document.getElementById("todayReminderCount");
    const reminderCountLabel = document.getElementById("reminderCountLabel");

    const addReminderButton = document.getElementById("addReminderButton");
    const emptyAddReminderButton = document.getElementById("emptyAddReminderButton");
    const closeReminderForm = document.getElementById("closeReminderForm");
    const cancelReminderButton = document.getElementById("cancelReminderButton");

    const medicineInput = document.getElementById("reminderMedicine");
    const dosageInput = document.getElementById("reminderDosage");
    const frequencyInput = document.getElementById("reminderFrequency");
    const timeInput = document.getElementById("reminderTime");
    const startDateInput = document.getElementById("reminderStartDate");
    const notesInput = document.getElementById("reminderNotes");

    let reminders = [];
    let editingReminderId = null;
    let isSaving = false;

    function getToken() {
        return localStorage.getItem("healthcareToken");
    }

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(dateString) {
        if (!dateString) return "Date unavailable";

        const date = new Date(`${String(dateString).slice(0, 10)}T00:00:00`);

        if (Number.isNaN(date.getTime())) return "Date unavailable";

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function formatTime(time) {
        if (!time) return "";

        const [hours, minutes] = String(time).slice(0, 5).split(":");
        const date = new Date();
        date.setHours(Number(hours), Number(minutes), 0, 0);

        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    async function apiRequest(path = "", options = {}) {
        const token = getToken();

        if (!token) {
            throw new Error("Please log in to manage your medicine reminders.");
        }

        const response = await fetch(`${API_URL}${path}`, {
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
            throw new Error(result.message || "The request could not be completed.");
        }

        return result;
    }

    function showError(message) {
        if (typeof window.showMessage === "function") {
            window.showMessage(message, "error");
        } else {
            window.alert(message);
        }
    }

    function openForm() {
        reminderFormSection?.classList.add("visible");
        reminderFormSection?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        medicineInput?.focus();
    }

    function closeForm() {
        reminderFormSection?.classList.remove("visible");
        reminderForm?.reset();
        editingReminderId = null;

        if (startDateInput) {
            startDateInput.value = getTodayDate();
        }
    }

    addReminderButton?.addEventListener("click", () => {
        editingReminderId = null;
        reminderForm?.reset();
        startDateInput.value = getTodayDate();
        openForm();
    });

    emptyAddReminderButton?.addEventListener("click", () => {
        editingReminderId = null;
        reminderForm?.reset();
        startDateInput.value = getTodayDate();
        openForm();
    });

    closeReminderForm?.addEventListener("click", closeForm);
    cancelReminderButton?.addEventListener("click", closeForm);

    function renderEmptyState(message = "Your medicine reminders will appear here.") {
        if (remindersEmpty) {
            remindersEmpty.classList.add("visible");

            const messageElement = remindersEmpty.querySelector("p");
            if (messageElement) {
                messageElement.textContent = message;
            }
        }

        if (reminderList) {
            reminderList.innerHTML = "";
        }
    }

    function renderReminders() {
        if (!reminderList) return;

        const activeReminders = reminders
            .filter(reminder => reminder.active !== false)
            .sort((a, b) => a.time.localeCompare(b.time));

        if (todayReminderCount) {
            todayReminderCount.textContent = activeReminders.length;
        }

        if (reminderCountLabel) {
            reminderCountLabel.textContent =
                `${activeReminders.length} ${activeReminders.length === 1 ? "reminder" : "reminders"}`;
        }

        if (!activeReminders.length) {
            renderEmptyState();
            return;
        }

        remindersEmpty?.classList.remove("visible");

        reminderList.innerHTML = activeReminders.map(reminder => `
            <article class="reminder-card" data-id="${escapeHtml(reminder.id)}">
                <div class="reminder-time-block">
                    <span class="reminder-time">${escapeHtml(formatTime(reminder.time))}</span>
                    <span class="reminder-time-label">reminder</span>
                </div>

                <div class="reminder-card-icon">
                    <i class="bi bi-capsule"></i>
                </div>

                <div class="reminder-card-content">
                    <div class="reminder-card-heading">
                        <div>
                            <span class="reminder-active-badge">
                                <span></span>
                                Active
                            </span>
                            <h3>${escapeHtml(reminder.medicine)}</h3>
                        </div>
                    </div>

                    <div class="reminder-details">
                        <span><i class="bi bi-capsule"></i> ${escapeHtml(reminder.dosage)}</span>
                        <span><i class="bi bi-arrow-repeat"></i> ${escapeHtml(reminder.frequency)}</span>
                        <span><i class="bi bi-calendar3"></i> From ${formatDate(reminder.startDate)}</span>
                    </div>

                    ${reminder.notes ? `
                        <div class="reminder-note">
                            <i class="bi bi-info-circle"></i>
                            ${escapeHtml(reminder.notes)}
                        </div>
                    ` : ""}

                    <div class="reminder-card-actions">
                        <button class="reminder-edit-button" type="button"
                                data-action="edit" data-id="${escapeHtml(reminder.id)}">
                            <i class="bi bi-pencil"></i> Edit
                        </button>

                        <button class="reminder-delete-button" type="button"
                                data-action="delete" data-id="${escapeHtml(reminder.id)}">
                            <i class="bi bi-trash3"></i> Remove
                        </button>
                    </div>
                </div>
            </article>
        `).join("");
    }

    async function loadReminders() {
        if (!reminderList) return;

        reminderList.innerHTML = `
            <div class="doctor-loading">
                <div class="loading-spinner"></div>
                <p>Loading your reminders...</p>
            </div>
        `;

        try {
            const result = await apiRequest("/my");
            reminders = Array.isArray(result.data) ? result.data : [];
            renderReminders();
        } catch (error) {
            console.error("Load reminders error:", error);
            renderEmptyState(error.message);
            showError(error.message);
        }
    }

    reminderForm?.addEventListener("submit", async event => {
        event.preventDefault();

        if (isSaving) return;

        const medicine = medicineInput.value.trim();
        const dosage = dosageInput.value.trim();
        const frequency = frequencyInput.value;
        const time = timeInput.value;
        const startDate = startDateInput.value;
        const notes = notesInput.value.trim();

        if (!medicine || !dosage || !frequency || !time || !startDate) {
            showError("Please complete all required reminder fields.");
            return;
        }

        const payload = { medicine, dosage, frequency, time, startDate, notes };
        const submitButton = reminderForm.querySelector('[type="submit"]');

        isSaving = true;
        if (submitButton) submitButton.disabled = true;

        try {
            if (editingReminderId !== null) {
                const result = await apiRequest(`/${editingReminderId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });

                reminders = reminders.map(reminder =>
                    String(reminder.id) === String(editingReminderId)
                        ? result.data
                        : reminder
                );
            } else {
                const result = await apiRequest("", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });

                reminders.push(result.data);
            }

            closeForm();
            renderReminders();
        } catch (error) {
            console.error("Save reminder error:", error);
            showError(error.message);
        } finally {
            isSaving = false;
            if (submitButton) submitButton.disabled = false;
        }
    });

    reminderList?.addEventListener("click", async event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = button.dataset.id;
        const reminder = reminders.find(item => String(item.id) === id);
        if (!reminder) return;

        if (button.dataset.action === "delete") {
            if (!window.confirm(`Remove the reminder for ${reminder.medicine}?`)) {
                return;
            }

            button.disabled = true;

            try {
                await apiRequest(`/${id}`, { method: "DELETE" });
                reminders = reminders.filter(item => String(item.id) !== id);
                renderReminders();
            } catch (error) {
                console.error("Delete reminder error:", error);
                showError(error.message);
                button.disabled = false;
            }

            return;
        }

        if (button.dataset.action === "edit") {
            editingReminderId = reminder.id;

            medicineInput.value = reminder.medicine;
            dosageInput.value = reminder.dosage;
            frequencyInput.value = reminder.frequency;
            timeInput.value = reminder.time;
            startDateInput.value = String(reminder.startDate).slice(0, 10);
            notesInput.value = reminder.notes || "";

            openForm();
        }
    });

    if (startDateInput) {
        startDateInput.value = getTodayDate();
    }

    loadReminders();
});
