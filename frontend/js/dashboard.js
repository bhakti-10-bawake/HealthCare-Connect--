
document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "http://localhost:5000/api";

    const patientName = document.getElementById("patientName");
    const appointmentCount = document.getElementById("appointmentCount");
    const recordCount = document.getElementById("recordCount");
    const medicineCount = document.getElementById("medicineCount");
    const reminderCount = document.getElementById("reminderCount");
    const upcomingAppointment = document.getElementById("upcomingAppointment");

    const token = localStorage.getItem("healthcareToken");

    // Initialize counters while the real data loads.
    [
        appointmentCount,
        recordCount,
        medicineCount,
        reminderCount
    ].forEach(element => {
        if (element) element.textContent = "—";
    });

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadDashboard();

    async function apiRequest(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json().catch(() => ({}));

        if (response.status === 401) {
            localStorage.removeItem("healthcareToken");
            localStorage.removeItem("healthcareUser");
            localStorage.removeItem("healthcareProfile");
            window.location.href = "login.html";
            throw new Error("Your session has expired.");
        }

        if (!response.ok || result.success === false) {
            throw new Error(result.message || `Request failed: ${endpoint}`);
        }

        return result.data;
    }

    function getArray(data) {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.rows)) return data.rows;
        return [];
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function setPatientName(name) {
        if (!patientName) return;

        const cleanedName = String(name || "").trim();
        patientName.textContent = cleanedName
            ? cleanedName.split(/\s+/)[0]
            : "there";
    }

    async function loadDashboard() {
        // Use cached user information immediately, then refresh from the API.
        try {
            const cachedUser = JSON.parse(
                localStorage.getItem("healthcareUser") || "{}"
            );

            setPatientName(cachedUser.fullName || cachedUser.name || "there");
        } catch {
            setPatientName("there");
        }

        const results = await Promise.allSettled([
            apiRequest("/profile/me"),
            apiRequest("/appointments/my"),
            apiRequest("/health-records/my"),
            apiRequest("/reminders/my"),
            apiRequest("/medicines")
        ]);

        // Update each section independently so one failed request
        // doesn't prevent the other dashboard sections from loading.
        const [profileResult, appointmentsResult, recordsResult,
            remindersResult, medicinesResult] = results;

        if (profileResult.status === "fulfilled") {
            const profile = profileResult.value;
            if (profile) {
                setPatientName(profile.name || profile.fullName || "there");
            }
        } else {
            console.error("Dashboard profile error:", profileResult.reason);
        }

        let appointments = [];

        if (appointmentsResult.status === "fulfilled") {
            appointments = getArray(appointmentsResult.value);
            renderAppointmentStats(appointments);
        } else {
            console.error(
                "Dashboard appointments error:",
                appointmentsResult.reason
            );
            renderAppointmentStats([]);
            showSectionError(upcomingAppointment, "Unable to load appointments.");
        }

        if (recordsResult.status === "fulfilled") {
            const records = getArray(recordsResult.value);
            if (recordCount) recordCount.textContent = records.length;
        } else {
            console.error("Dashboard records error:", recordsResult.reason);
            if (recordCount) recordCount.textContent = "—";
        }

        if (remindersResult.status === "fulfilled") {
            const reminders = getArray(remindersResult.value);
            const activeReminders = reminders.filter(isActiveReminder);

            if (reminderCount) {
                reminderCount.textContent = activeReminders.length;
            }
        } else {
            console.error("Dashboard reminders error:", remindersResult.reason);
            if (reminderCount) reminderCount.textContent = "—";
        }

        if (medicinesResult.status === "fulfilled") {
            const medicines = getArray(medicinesResult.value);
            if (medicineCount) {
                medicineCount.textContent = medicines.length;
            }
        } else {
            console.error("Dashboard medicines error:", medicinesResult.reason);
            if (medicineCount) medicineCount.textContent = "—";
        }
    }

    function isActiveReminder(reminder) {
        if (reminder.active === false || reminder.is_active === 0 ||
            reminder.is_active === false) {
            return false;
        }

        if (String(reminder.active).toLowerCase() === "false") {
            return false;
        }

        return true;
    }

    function getAppointmentStatus(appointment) {
        return String(appointment.status || "")
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_");
    }

    function getAppointmentDateValue(appointment) {
        return appointment.date ||
            appointment.appointment_date ||
            appointment.appointmentDate ||
            "";
    }

    function getAppointmentTimeValue(appointment) {
        return appointment.time ||
            appointment.appointment_time ||
            appointment.appointmentTime ||
            "";
    }

    function getAppointmentDate(appointment) {
        const dateValue = getAppointmentDateValue(appointment);

        if (!dateValue) return null;

        // Parse YYYY-MM-DD as a local calendar date to avoid
        // timezone shifts when displaying MySQL DATE values.
        const match = String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})/);
        let date;

        if (match) {
            date = new Date(
                Number(match[1]),
                Number(match[2]) - 1,
                Number(match[3])
            );
        } else {
            date = new Date(dateValue);
        }

        if (Number.isNaN(date.getTime())) return null;

        const timeValue = String(getAppointmentTimeValue(appointment));

        const timeMatch = timeValue.match(
            /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i
        );

        if (timeMatch) {
            let hours = Number(timeMatch[1]);
            const minutes = Number(timeMatch[2]);
            const period = timeMatch[3]?.toUpperCase();

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            date.setHours(hours, minutes, 0, 0);
        }

        return date;
    }

    function isUpcomingAppointment(appointment) {
        const status = getAppointmentStatus(appointment);

        if (["CANCELLED", "COMPLETED", "NO_SHOW", "REJECTED"].includes(status)) {
            return false;
        }

        const date = getAppointmentDate(appointment);

        if (!date) return status === "UPCOMING" || status === "CONFIRMED";

        return date >= new Date();
    }

    function renderAppointmentStats(appointments) {
        const upcoming = appointments
            .filter(isUpcomingAppointment)
            .sort((a, b) => {
                const dateA = getAppointmentDate(a);
                const dateB = getAppointmentDate(b);

                return (dateA?.getTime() ?? Infinity) -
                    (dateB?.getTime() ?? Infinity);
            });

        if (appointmentCount) {
            appointmentCount.textContent = upcoming.length;
        }

        renderUpcomingAppointment(upcoming);
    }

    function renderUpcomingAppointment(appointments) {
        if (!upcomingAppointment) return;

        if (!appointments.length) {
            upcomingAppointment.innerHTML = `
                <div class="appointment-empty">
                    <div class="appointment-empty-icon">
                        <i class="bi bi-calendar2-check"></i>
                    </div>

                    <div class="appointment-empty-copy">
                        <strong>No upcoming appointments</strong>
                        <span>Book a consultation when you need one.</span>
                    </div>

                    <a href="doctors.html" class="appointment-book-link">
                        Find a doctor
                        <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
            `;
            return;
        }

        const appointment = appointments[0];

        const doctorName =
            appointment.doctorName ||
            appointment.doctor_name ||
            appointment.full_name ||
            "Doctor";

        const specialization =
            appointment.specialization ||
            appointment.doctorSpecialization ||
            "";

        const date = formatDate(getAppointmentDateValue(appointment));
        const time = formatTime(getAppointmentTimeValue(appointment));

        upcomingAppointment.innerHTML = `
            <div class="appointment-preview">
                <div class="appointment-preview-main">
                    <div class="appointment-preview-icon">
                        <i class="bi bi-person-circle"></i>
                    </div>

                    <div class="appointment-preview-info">
                        <span class="appointment-preview-label">
                            NEXT APPOINTMENT
                        </span>

                        <strong>${escapeHtml(doctorName)}</strong>
                        <span>${escapeHtml(specialization)}</span>
                    </div>
                </div>

                <div class="appointment-preview-meta">
                    <div>
                        <i class="bi bi-calendar3"></i>
                        ${escapeHtml(date)}
                    </div>

                    <div>
                        <i class="bi bi-clock"></i>
                        ${escapeHtml(time)}
                    </div>
                </div>
            </div>
        `;
    }

    function formatDate(value) {
        if (!value) return "Date not available";

        const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

        const date = match
            ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
            : new Date(value);

        if (Number.isNaN(date.getTime())) return String(value);

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function formatTime(value) {
        if (!value) return "Time not available";

        const time = String(value);
        const match = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

        if (!match) return time;

        const date = new Date();
        date.setHours(Number(match[1]), Number(match[2]), 0, 0);

        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    function showSectionError(element, message) {
        if (!element) return;

        element.innerHTML = `
            <div class="appointment-empty">
                <div class="appointment-empty-copy">
                    <strong>${escapeHtml(message)}</strong>
                    <span>Please refresh the page to try again.</span>
                </div>
            </div>
        `;
    }
});
