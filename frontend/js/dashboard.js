document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------
       Dashboard elements
    -------------------------------- */

    const patientName =
        document.getElementById("patientName");

    const appointmentCount =
        document.getElementById("appointmentCount");

    const recordCount =
        document.getElementById("recordCount");

    const medicineCount =
        document.getElementById("medicineCount");

    const reminderCount =
        document.getElementById("reminderCount");

    const upcomingAppointment =
        document.getElementById("upcomingAppointment");


    /* --------------------------------
       Load patient profile
    -------------------------------- */

    loadPatientProfile();


    /* --------------------------------
       Load dashboard statistics
    -------------------------------- */

    loadDashboardData();


    /* =================================
       Patient Profile
    ================================= */

    function loadPatientProfile() {

        const savedProfile =
            localStorage.getItem("healthcareProfile");

        if (!patientName) return;

        if (savedProfile) {

            try {

                const profile =
                    JSON.parse(savedProfile);

                if (profile.fullName) {

                    const firstName =
                        profile.fullName
                            .trim()
                            .split(" ")[0];

                    patientName.textContent =
                        firstName || "there";
                }

            } catch (error) {

                console.error(
                    "Unable to load profile:",
                    error
                );

            }

        }
    }


    /* =================================
       Dashboard Data
    ================================= */

    function loadDashboardData() {

        const appointments =
            getLocalStorageArray(
                "healthcareAppointments"
            );

        const reminders =
            getLocalStorageArray(
                "healthcareReminders"
            );

        const records =
            getHealthRecords();

        const medicines =
            getMedicineCount();


        /* Appointment count */

        if (appointmentCount) {

            const upcoming =
                appointments.filter(
                    appointment =>
                        appointment.status === "Upcoming"
                );

            appointmentCount.textContent =
                upcoming.length;
        }


        /* Health records */

        if (recordCount) {

            recordCount.textContent =
                records.length;
        }


        /* Medicines */

        if (medicineCount) {

            medicineCount.textContent =
                medicines;
        }


        /* Reminders */

        if (reminderCount) {

            reminderCount.textContent =
                reminders.length;
        }


        /* Upcoming appointment */

        renderUpcomingAppointment(
            appointments
        );
    }


    /* =================================
       Upcoming Appointment
    ================================= */

    function renderUpcomingAppointment(
        appointments
    ) {

        if (!upcomingAppointment) return;


        const upcomingAppointments =
            appointments
                .filter(
                    appointment =>
                        appointment.status === "Upcoming"
                )
                .sort(
                    (a, b) =>
                        getAppointmentDate(a) -
                        getAppointmentDate(b)
                );


        if (!upcomingAppointments.length) {

            upcomingAppointment.innerHTML = `
                <div class="appointment-empty">

                    <div class="appointment-empty-icon">
                        <i class="bi bi-calendar2-check"></i>
                    </div>

                    <div class="appointment-empty-copy">
                        <strong>No upcoming appointments</strong>

                        <span>
                            Book a consultation when you need one.
                        </span>
                    </div>

                    <a
                        href="doctors.html"
                        class="appointment-book-link"
                    >
                        Find a doctor
                        <i class="bi bi-arrow-right"></i>
                    </a>

                </div>
            `;

            return;
        }


        const appointment =
            upcomingAppointments[0];


        const date =
            formatDate(appointment.date);


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

                        <strong>
                            ${escapeHtml(
                                appointment.doctorName
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                appointment.specialization
                            )}
                        </span>

                    </div>

                </div>


                <div class="appointment-preview-meta">

                    <div>
                        <i class="bi bi-calendar3"></i>
                        ${date}
                    </div>

                    <div>
                        <i class="bi bi-clock"></i>
                        ${escapeHtml(
                            appointment.time
                        )}
                    </div>

                </div>

            </div>
        `;
    }


    /* =================================
       Health Records
    ================================= */

    function getHealthRecords() {

        /*
         * Health records currently use
         * synthetic frontend data.
         *
         * This keeps the dashboard working
         * before the backend is connected.
         */

        return [
            {
                id: 1,
                type: "Lab Report"
            },
            {
                id: 2,
                type: "Consultation"
            },
            {
                id: 3,
                type: "Prescription"
            },
            {
                id: 4,
                type: "Lab Report"
            },
            {
                id: 5,
                type: "Consultation"
            },
            {
                id: 6,
                type: "Prescription"
            },
            {
                id: 7,
                type: "Lab Report"
            },
            {
                id: 8,
                type: "Consultation"
            }
        ];
    }


    /* =================================
       Medicine Count
    ================================= */

    function getMedicineCount() {

        /*
         * Medicine catalogue is currently
         * maintained by medicines.js.
         *
         * This number represents the available
         * medicine catalogue rather than
         * medicines prescribed to the patient.
         */

        return 30;
    }


    /* =================================
       Local Storage Helper
    ================================= */

    function getLocalStorageArray(key) {

        const stored =
            localStorage.getItem(key);

        if (!stored) {
            return [];
        }

        try {

            const parsed =
                JSON.parse(stored);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                `Unable to read ${key}:`,
                error
            );

            return [];
        }
    }


    /* =================================
       Appointment Date Helper
    ================================= */

    function getAppointmentDate(
        appointment
    ) {

        if (!appointment.date) {
            return new Date(0);
        }

        const date =
            new Date(appointment.date);

        if (appointment.time) {

            const timeMatch =
                appointment.time.match(
                    /(\d{1,2}):(\d{2})\s*(AM|PM)/i
                );

            if (timeMatch) {

                let hours =
                    Number(timeMatch[1]);

                const minutes =
                    Number(timeMatch[2]);

                const period =
                    timeMatch[3].toUpperCase();


                if (period === "PM" && hours !== 12) {
                    hours += 12;
                }

                if (period === "AM" && hours === 12) {
                    hours = 0;
                }

                date.setHours(
                    hours,
                    minutes,
                    0,
                    0
                );
            }
        }

        return date;
    }


    /* =================================
       Date Formatting
    ================================= */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "Date not available";
        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }


    /* =================================
       HTML Safety
    ================================= */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});