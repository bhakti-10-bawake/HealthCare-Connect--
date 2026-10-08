document.addEventListener("DOMContentLoaded", async () => {

    // ============================================================
    // ELEMENTS
    // ============================================================

    const appointmentList =
        document.getElementById("appointmentList");

    const appointmentCount =
        document.getElementById("appointmentCount");

    const nextAppointmentLabel =
        document.getElementById("nextAppointmentLabel");

    const filterButtons =
        document.querySelectorAll(
            "[data-appointment-filter]"
        );


    // ============================================================
    // STATE
    // ============================================================

    let appointments = [];

    let currentFilter = "all";


    // ============================================================
    // LOAD APPOINTMENTS
    // ============================================================

    await loadAppointments();


    // ============================================================
    // FILTER BUTTONS
    // ============================================================

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            currentFilter =
                button.dataset.appointmentFilter ||
                "all";


            filterButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            renderAppointments();
        });

    });


    // ============================================================
    // FETCH FROM API
    // ============================================================

    async function loadAppointments() {

        showLoading();

        try {

            if (
                typeof isLoggedIn === "function" &&
                !isLoggedIn()
            ) {

                window.location.href =
                    "login.html";

                return;
            }


            const response =
                await apiRequest(
                    "/appointments/my",
                    {
                        method: "GET"
                    }
                );


            appointments =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            updateSummary();

            renderAppointments();


        } catch (error) {

            console.error(
                "Appointments loading error:",
                error
            );

            showError(
                error.message ||
                "Unable to load your appointments."
            );
        }
    }


    // ============================================================
    // SUMMARY
    // ============================================================

    function updateSummary() {

        if (appointmentCount) {

            appointmentCount.textContent =
                appointments.length;
        }


        const upcomingAppointments =
            appointments
                .filter(
                    appointment =>
                        isUpcoming(appointment)
                )
                .sort(
                    compareAppointments
                );


        if (
            nextAppointmentLabel
        ) {

            if (
                upcomingAppointments.length === 0
            ) {

                nextAppointmentLabel.textContent =
                    "No upcoming appointments";

            } else {

                const next =
                    upcomingAppointments[0];

                nextAppointmentLabel.textContent =
                    `Next: ${formatDate(
                        next.date
                    )} · ${formatTime(
                        next.time
                    )}`;
            }
        }
    }


    // ============================================================
    // RENDER
    // ============================================================

    function renderAppointments() {

        if (!appointmentList) {
            return;
        }


        let filteredAppointments =
            [...appointments];


        if (currentFilter === "upcoming") {

            filteredAppointments =
                filteredAppointments.filter(
                    appointment =>
                        isUpcoming(appointment)
                );

        } else if (
            currentFilter === "completed"
        ) {

            filteredAppointments =
                filteredAppointments.filter(
                    appointment =>
                        normalizeStatus(
                            appointment.status
                        ) === "COMPLETED"
                );
        }


        filteredAppointments.sort(
            compareAppointments
        );


        if (
            filteredAppointments.length === 0
        ) {

            renderEmptyState();

            return;
        }


        appointmentList.innerHTML =
            filteredAppointments
                .map(
                    createAppointmentCard
                )
                .join("");
    }


    // ============================================================
    // APPOINTMENT CARD
    // ============================================================

    function createAppointmentCard(
        appointment
    ) {

        const status =
            normalizeStatus(
                appointment.status
            );


        const statusLabel =
            formatStatus(status);


        const statusClass =
            getStatusClass(status);


        const initials =
            getInitials(
                appointment.doctorName
            );


        const fee =
            Number.isFinite(
                Number(appointment.fee)
            )
                ? `₹${Number(
                    appointment.fee
                )}`
                : "—";


        const location =
            appointment.healthcareCentre ||
            "Healthcare centre";


        const reason =
            appointment.reason ||
            "General consultation";


        return `
            <article
                class="appointment-card"
                data-appointment-id="${escapeHtml(
                    appointment.id
                )}"
            >

                <div class="appointment-card-top">

                    <div class="appointment-doctor">

                        <div class="appointment-avatar">
                            ${escapeHtml(initials)}
                        </div>

                        <div>

                            <h3>
                                ${escapeHtml(
                                    appointment.doctorName ||
                                    "Doctor"
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    appointment.specialization ||
                                    "Healthcare Professional"
                                )}
                            </p>

                        </div>

                    </div>


                    <span
                        class="appointment-status ${statusClass}"
                    >
                        ${escapeHtml(statusLabel)}
                    </span>

                </div>


                <div class="appointment-card-details">

                    <div class="appointment-detail">

                        <i class="bi bi-calendar3"></i>

                        <div>
                            <span>Date</span>
                            <strong>
                                ${escapeHtml(
                                    formatDate(
                                        appointment.date
                                    )
                                )}
                            </strong>
                        </div>

                    </div>


                    <div class="appointment-detail">

                        <i class="bi bi-clock"></i>

                        <div>
                            <span>Time</span>
                            <strong>
                                ${escapeHtml(
                                    formatTime(
                                        appointment.time
                                    )
                                )}
                            </strong>
                        </div>

                    </div>


                    <div class="appointment-detail">

                        <i class="bi bi-hospital"></i>

                        <div>
                            <span>Healthcare centre</span>
                            <strong>
                                ${escapeHtml(location)}
                            </strong>
                        </div>

                    </div>


                    <div class="appointment-detail">

                        <i class="bi bi-cash"></i>

                        <div>
                            <span>Consultation fee</span>
                            <strong>
                                ${escapeHtml(fee)}
                            </strong>
                        </div>

                    </div>

                </div>


                <div class="appointment-card-reason">

                    <span>Reason for visit</span>

                    <p>
                        ${escapeHtml(reason)}
                    </p>

                </div>


                ${
                    appointment.queueNumber
                        ? `
                            <div class="appointment-queue">
                                <i class="bi bi-people"></i>
                                <span>
                                    Queue number
                                </span>
                                <strong>
                                    ${escapeHtml(
                                        appointment.queueNumber
                                    )}
                                </strong>
                            </div>
                        `
                        : ""
                }

            </article>
        `;
    }


    // ============================================================
    // EMPTY STATE
    // ============================================================

    function renderEmptyState() {

        let title =
            "No appointments yet";

        let description =
            "Your booked appointments will appear here.";


        if (currentFilter === "upcoming") {

            title =
                "No upcoming appointments";

            description =
                "You don't have any upcoming appointments.";

        } else if (
            currentFilter === "completed"
        ) {

            title =
                "No completed appointments";

            description =
                "Your completed appointments will appear here.";
        }


        appointmentList.innerHTML = `
            <div class="appointment-empty">

                <div class="appointment-empty-icon">
                    <i class="bi bi-calendar2-check"></i>
                </div>

                <h3>
                    ${escapeHtml(title)}
                </h3>

                <p>
                    ${escapeHtml(description)}
                </p>

                <a
                    href="doctors.html"
                    class="appointment-book-link"
                >
                    Find a doctor
                    <i class="bi bi-arrow-right"></i>
                </a>

            </div>
        `;
    }


    // ============================================================
    // LOADING
    // ============================================================

    function showLoading() {

        if (!appointmentList) {
            return;
        }


        appointmentList.innerHTML = `
            <div class="appointment-loading">

                <div class="appointment-loading-spinner"></div>

                <p>
                    Loading your appointments...
                </p>

            </div>
        `;
    }


    // ============================================================
    // ERROR
    // ============================================================

    function showError(message) {

        if (!appointmentList) {
            return;
        }


        appointmentList.innerHTML = `
            <div class="appointment-empty appointment-error">

                <div class="appointment-empty-icon">
                    <i class="bi bi-exclamation-circle"></i>
                </div>

                <h3>
                    Unable to load appointments
                </h3>

                <p>
                    ${escapeHtml(message)}
                </p>

                <button
                    type="button"
                    class="appointment-book-link"
                    id="retryAppointmentsButton"
                >
                    Try again
                </button>

            </div>
        `;


        const retryButton =
            document.getElementById(
                "retryAppointmentsButton"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadAppointments
            );
        }
    }


    // ============================================================
    // UPCOMING CHECK
    // ============================================================

    function isUpcoming(appointment) {

        const status =
            normalizeStatus(
                appointment.status
            );


        if (
            status === "CANCELLED" ||
            status === "COMPLETED" ||
            status === "NO_SHOW"
        ) {
            return false;
        }


        if (!appointment.date) {
            return false;
        }


        const appointmentDate =
            new Date(
                `${appointment.date}T${
                    appointment.time || "00:00:00"
                }`
            );


        return (
            !Number.isNaN(
                appointmentDate.getTime()
            ) &&
            appointmentDate >= new Date()
        );
    }


    // ============================================================
    // SORT
    // ============================================================

    function compareAppointments(
        first,
        second
    ) {

        const firstDate =
            getAppointmentTimestamp(
                first
            );

        const secondDate =
            getAppointmentTimestamp(
                second
            );


        return (
            secondDate - firstDate
        );
    }


    function getAppointmentTimestamp(
        appointment
    ) {

        const value =
            new Date(
                `${appointment.date}T${
                    appointment.time || "00:00:00"
                }`
            );


        const timestamp =
            value.getTime();


        return Number.isNaN(timestamp)
            ? 0
            : timestamp;
    }


    // ============================================================
    // STATUS
    // ============================================================

    function normalizeStatus(status) {

        return String(
            status || ""
        )
            .trim()
            .toUpperCase();
    }


    function formatStatus(status) {

        const labels = {
            UPCOMING: "Upcoming",
            CONFIRMED: "Confirmed",
            COMPLETED: "Completed",
            CANCELLED: "Cancelled",
            NO_SHOW: "No show"
        };


        return (
            labels[status] ||
            "Appointment"
        );
    }


    function getStatusClass(status) {

        const classes = {
            UPCOMING: "status-upcoming",
            CONFIRMED: "status-confirmed",
            COMPLETED: "status-completed",
            CANCELLED: "status-cancelled",
            NO_SHOW: "status-cancelled"
        };


        return (
            classes[status] ||
            "status-upcoming"
        );
    }


    // ============================================================
    // DATE FORMAT
    // ============================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "—";
        }


        const date =
            new Date(
                `${dateValue}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(dateValue);
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


    // ============================================================
    // TIME FORMAT
    // ============================================================

    function formatTime(timeValue) {

        if (!timeValue) {
            return "—";
        }


        const parts =
            String(timeValue)
                .split(":");


        if (parts.length < 2) {
            return String(timeValue);
        }


        let hour =
            Number(parts[0]);


        const minute =
            parts[1];


        if (
            Number.isNaN(hour)
        ) {
            return String(timeValue);
        }


        const period =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12 || 12;


        return `${hour}:${minute} ${period}`;
    }


    // ============================================================
    // INITIALS
    // ============================================================

    function getInitials(name) {

        if (!name) {
            return "DR";
        }


        const cleanName =
            String(name)
                .replace(
                    /^Dr\.?\s*/i,
                    ""
                )
                .trim();


        const words =
            cleanName.split(
                /\s+/
            );


        if (
            words.length === 1
        ) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();
        }


        return (
            words[0].charAt(0) +
            words[
                words.length - 1
            ].charAt(0)
        ).toUpperCase();
    }


    // ============================================================
    // SAFE HTML
    // ============================================================

    function escapeHtml(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }

});