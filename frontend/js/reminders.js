document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "healthcareReminders";

    const reminderList = document.getElementById("reminderList");
    const remindersEmpty = document.getElementById("remindersEmpty");

    const reminderFormSection =
        document.getElementById("reminderFormSection");

    const reminderForm =
        document.getElementById("reminderForm");

    const todayReminderCount =
        document.getElementById("todayReminderCount");

    const reminderCountLabel =
        document.getElementById("reminderCountLabel");


    const addReminderButton =
        document.getElementById("addReminderButton");

    const emptyAddReminderButton =
        document.getElementById("emptyAddReminderButton");

    const closeReminderForm =
        document.getElementById("closeReminderForm");

    const cancelReminderButton =
        document.getElementById("cancelReminderButton");


    const medicineInput =
        document.getElementById("reminderMedicine");

    const dosageInput =
        document.getElementById("reminderDosage");

    const frequencyInput =
        document.getElementById("reminderFrequency");

    const timeInput =
        document.getElementById("reminderTime");

    const startDateInput =
        document.getElementById("reminderStartDate");

    const notesInput =
        document.getElementById("reminderNotes");


    let editingReminderId = null;


    /* ---------------------------------------------------------
       Helpers
       --------------------------------------------------------- */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getTodayDate() {

        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function formatDate(dateString) {

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }


    function formatTime(time) {

        if (!time) return "";

        const [hours, minutes] = time.split(":");

        const date = new Date();

        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));

        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }


    function getReminders() {

        try {

            const stored =
                localStorage.getItem(STORAGE_KEY);

            if (stored) {
                return JSON.parse(stored);
            }

        } catch (error) {

            console.error(
                "Unable to read reminders:",
                error
            );

        }

        return null;
    }


    function saveReminders(reminders) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(reminders)
        );

    }


    /* ---------------------------------------------------------
       Initial synthetic reminders
       --------------------------------------------------------- */

    function createInitialReminders() {

        return [

            {
                id: 1,
                medicine: "Metformin 500 mg",
                dosage: "1 tablet",
                frequency: "Twice daily",
                time: "08:00",
                startDate: getTodayDate(),
                notes: "Take after breakfast",
                active: true
            },

            {
                id: 2,
                medicine: "Vitamin D3",
                dosage: "1 tablet",
                frequency: "Once daily",
                time: "13:00",
                startDate: getTodayDate(),
                notes: "Take after lunch",
                active: true
            },

            {
                id: 3,
                medicine: "Amlodipine 5 mg",
                dosage: "1 tablet",
                frequency: "Once daily",
                time: "20:30",
                startDate: getTodayDate(),
                notes: "Take after dinner",
                active: true
            },

            {
                id: 4,
                medicine: "Iron + Folic Acid",
                dosage: "1 tablet",
                frequency: "Once daily",
                time: "21:00",
                startDate: getTodayDate(),
                notes: "Take with water",
                active: true
            }

        ];

    }


    let reminders = getReminders();


    if (!reminders) {

        reminders = createInitialReminders();

        saveReminders(reminders);

    }


    /* ---------------------------------------------------------
       Form visibility
       --------------------------------------------------------- */

    function openForm() {

        reminderFormSection.classList.add("visible");

        setTimeout(() => {

            medicineInput.focus();

        }, 150);

        reminderFormSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    function closeForm() {

        reminderFormSection.classList.remove("visible");

        reminderForm.reset();

        editingReminderId = null;

        startDateInput.value = getTodayDate();

    }


    addReminderButton.addEventListener(
        "click",
        openForm
    );


    emptyAddReminderButton.addEventListener(
        "click",
        openForm
    );


    closeReminderForm.addEventListener(
        "click",
        closeForm
    );


    cancelReminderButton.addEventListener(
        "click",
        closeForm
    );


    /* ---------------------------------------------------------
       Render
       --------------------------------------------------------- */

    function renderReminders() {

        const activeReminders =
            reminders.filter(reminder => reminder.active !== false);


        todayReminderCount.textContent =
            activeReminders.length;


        reminderCountLabel.textContent =
            `${activeReminders.length} ${
                activeReminders.length === 1
                    ? "reminder"
                    : "reminders"
            }`;


        if (!activeReminders.length) {

            reminderList.innerHTML = "";

            remindersEmpty.classList.add("visible");

            return;

        }


        remindersEmpty.classList.remove("visible");


        activeReminders.sort((a, b) =>
            a.time.localeCompare(b.time)
        );


        reminderList.innerHTML =
            activeReminders.map(reminder => `

                <article
                    class="reminder-card"
                    data-id="${reminder.id}"
                >

                    <div class="reminder-time-block">

                        <span class="reminder-time">
                            ${formatTime(reminder.time)}
                        </span>

                        <span class="reminder-time-label">
                            reminder
                        </span>

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

                                <h3>
                                    ${escapeHtml(reminder.medicine)}
                                </h3>

                            </div>

                        </div>


                        <div class="reminder-details">

                            <span>
                                <i class="bi bi-capsule"></i>
                                ${escapeHtml(reminder.dosage)}
                            </span>

                            <span>
                                <i class="bi bi-arrow-repeat"></i>
                                ${escapeHtml(reminder.frequency)}
                            </span>

                            <span>
                                <i class="bi bi-calendar3"></i>
                                From ${formatDate(reminder.startDate)}
                            </span>

                        </div>


                        ${
                            reminder.notes
                                ? `
                                    <div class="reminder-note">
                                        <i class="bi bi-info-circle"></i>
                                        ${escapeHtml(reminder.notes)}
                                    </div>
                                `
                                : ""
                        }


                        <div class="reminder-card-actions">

                            <button
                                class="reminder-edit-button"
                                data-action="edit"
                                data-id="${reminder.id}"
                            >
                                <i class="bi bi-pencil"></i>
                                Edit
                            </button>

                            <button
                                class="reminder-delete-button"
                                data-action="delete"
                                data-id="${reminder.id}"
                            >
                                <i class="bi bi-trash3"></i>
                                Remove
                            </button>

                        </div>

                    </div>

                </article>

            `).join("");

    }


    /* ---------------------------------------------------------
       Add / Edit
       --------------------------------------------------------- */

    reminderForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const medicine =
                medicineInput.value.trim();

            const dosage =
                dosageInput.value.trim();

            const frequency =
                frequencyInput.value;

            const time =
                timeInput.value;

            const startDate =
                startDateInput.value;

            const notes =
                notesInput.value.trim();


            if (
                !medicine ||
                !dosage ||
                !frequency ||
                !time ||
                !startDate
            ) {

                return;

            }


            if (editingReminderId !== null) {

                reminders =
                    reminders.map(reminder => {

                        if (
                            reminder.id !==
                            editingReminderId
                        ) {
                            return reminder;
                        }


                        return {

                            ...reminder,

                            medicine,
                            dosage,
                            frequency,
                            time,
                            startDate,
                            notes

                        };

                    });

            } else {

                const newReminder = {

                    id: Date.now(),

                    medicine,
                    dosage,
                    frequency,
                    time,
                    startDate,
                    notes,

                    active: true

                };


                reminders.push(newReminder);

            }


            saveReminders(reminders);

            closeForm();

            renderReminders();

        }
    );


    /* ---------------------------------------------------------
       Edit / Delete
       --------------------------------------------------------- */

    reminderList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button[data-action]");

            if (!button) return;


            const id =
                Number(button.dataset.id);

            const action =
                button.dataset.action;


            const reminder =
                reminders.find(
                    item => item.id === id
                );


            if (!reminder) return;


            if (action === "delete") {

                const confirmed =
                    window.confirm(
                        `Remove the reminder for ${reminder.medicine}?`
                    );


                if (!confirmed) return;


                reminders =
                    reminders.filter(
                        item => item.id !== id
                    );


                saveReminders(reminders);

                renderReminders();

                return;

            }


            if (action === "edit") {

                editingReminderId = id;


                medicineInput.value =
                    reminder.medicine;

                dosageInput.value =
                    reminder.dosage;

                frequencyInput.value =
                    reminder.frequency;

                timeInput.value =
                    reminder.time;

                startDateInput.value =
                    reminder.startDate;

                notesInput.value =
                    reminder.notes || "";


                openForm();

            }

        }
    );


    /* ---------------------------------------------------------
       Initial render
       --------------------------------------------------------- */

    startDateInput.value = getTodayDate();

    renderReminders();

});