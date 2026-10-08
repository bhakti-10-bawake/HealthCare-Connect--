document.addEventListener("DOMContentLoaded", () => {

    const appointmentList =
        document.getElementById("appointmentList");

    const appointmentCount =
        document.getElementById("appointmentCount");

    const nextAppointmentLabel =
        document.getElementById("nextAppointmentLabel");

    const appointmentFilters =
        document.getElementById("appointmentFilters");


    let selectedFilter = "all";


    /*
     * =========================================================
     * TEMPORARY SYNTHETIC APPOINTMENTS
     * =========================================================
     */

    const defaultAppointments = [

        {
            id: 1001,
            doctorId: 1,
            doctorName: "Dr. Ananya Sharma",
            specialization: "General Physician",
            date: getFutureDate(2),
            time: "10:30 AM",
            fee: 300,
            reason: "Routine health consultation",
            status: "Upcoming"
        },

        {
            id: 1002,
            doctorId: 2,
            doctorName: "Dr. Rahul Patil",
            specialization: "Pediatrician",
            date: getFutureDate(6),
            time: "11:00 AM",
            fee: 350,
            reason: "General consultation",
            status: "Upcoming"
        },

        {
            id: 1003,
            doctorId: 5,
            doctorName: "Dr. Meera Joshi",
            specialization: "Dermatologist",
            date: getPastDate(12),
            time: "2:30 PM",
            fee: 500,
            reason: "Skin consultation",
            status: "Completed"
        }

    ];


    /*
     * =========================================================
     * LOAD APPOINTMENTS
     * =========================================================
     */

    function getAppointments() {

        const stored =
            localStorage.getItem(
                "healthcareAppointments"
            );


        if (stored) {

            try {

                const parsed =
                    JSON.parse(stored);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

            } catch (error) {

                console.error(
                    "Unable to read appointments:",
                    error
                );

            }

        }


        localStorage.setItem(
            "healthcareAppointments",
            JSON.stringify(defaultAppointments)
        );


        return defaultAppointments;
    }


    let appointments =
        getAppointments();


    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    function renderAppointments() {

        let filtered =
            [...appointments];


        if (selectedFilter !== "all") {

            filtered =
                filtered.filter(
                    appointment =>
                        appointment.status ===
                        selectedFilter
                );

        }


        filtered.sort(
            (a, b) => {

                const dateA =
                    new Date(
                        `${a.date}T00:00:00`
                    );

                const dateB =
                    new Date(
                        `${b.date}T00:00:00`
                    );

                return dateA - dateB;

            }
        );


        if (filtered.length === 0) {

            renderEmptyState();

            return;
        }


        appointmentList.innerHTML =
            filtered
                .map(createAppointmentCard)
                .join("");


        attachCancelButtons();

        updateSummary();

    }


    /*
     * =========================================================
     * APPOINTMENT CARD
     * =========================================================
     */

    function createAppointmentCard(
        appointment
    ) {

        const date =
            formatDate(
                appointment.date
            );


        const statusClass =
            appointment.status
                .toLowerCase();


        const initials =
            getInitials(
                appointment.doctorName
            );


        const isUpcoming =
            appointment.status ===
            "Upcoming";


        return `
            <article
                class="appointment-card ${statusClass}"
            >

                <div class="appointment-card-main">

                    <div class="appointment-doctor-avatar">
                        ${escapeHtml(initials)}
                    </div>

                    <div class="appointment-doctor-info">

                        <span class="appointment-status ${statusClass}">
                            ${escapeHtml(
                                appointment.status
                            )}
                        </span>

                        <h3>
                            ${escapeHtml(
                                appointment.doctorName
                            )}
                        </h3>

                        <p>
                            ${escapeHtml(
                                appointment.specialization
                            )}
                        </p>

                    </div>

                </div>


                <div class="appointment-details">

                    <div class="appointment-detail">

                        <span>
                            <i class="bi bi-calendar3"></i>
                        </span>

                        <div>
                            <small>Date</small>
                            <strong>
                                ${date}
                            </strong>
                        </div>

                    </div>


                    <div class="appointment-detail">

                        <span>
                            <i class="bi bi-clock"></i>
                        </span>

                        <div>
                            <small>Time</small>
                            <strong>
                                ${escapeHtml(
                                    appointment.time
                                )}
                            </strong>
                        </div>

                    </div>


                    <div class="appointment-detail">

                        <span>
                            <i class="bi bi-cash-coin"></i>
                        </span>

                        <div>
                            <small>Fee</small>
                            <strong>
                                ₹${Number(
                                    appointment.fee || 0
                                )}
                            </strong>
                        </div>

                    </div>

                </div>


                <div class="appointment-card-footer">

                    <div class="appointment-reason">

                        <span>
                            Reason
                        </span>

                        <p>
                            ${escapeHtml(
                                appointment.reason ||
                                "General consultation"
                            )}
                        </p>

                    </div>


                    ${
                        isUpcoming
                            ? `
                                <button
                                    type="button"
                                    class="appointment-cancel-button"
                                    data-id="${appointment.id}"
                                >
                                    Cancel
                                </button>
                            `
                            : `
                                <span class="appointment-completed-label">
                                    <i class="bi bi-check2-circle"></i>
                                    Consultation completed
                                </span>
                            `
                    }

                </div>

            </article>
        `;
    }


    /*
     * =========================================================
     * SUMMARY
     * =========================================================
     */

    function updateSummary() {

        const upcoming =
            appointments.filter(
                appointment =>
                    appointment.status ===
                    "Upcoming"
            );


        appointmentCount.textContent =
            upcoming.length;


        if (upcoming.length === 0) {

            nextAppointmentLabel.textContent =
                "No appointment";

            return;
        }


        const sorted =
            [...upcoming].sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


        const next =
            sorted[0];


        nextAppointmentLabel.textContent =
            formatShortDate(next.date);

    }


    /*
     * =========================================================
     * CANCEL APPOINTMENT
     * =========================================================
     */

    function attachCancelButtons() {

        const buttons =
            document.querySelectorAll(
                ".appointment-cancel-button"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    const confirmed =
                        window.confirm(
                            "Are you sure you want to cancel this appointment?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    appointments =
                        appointments.filter(
                            appointment =>
                                appointment.id !== id
                        );


                    localStorage.setItem(
                        "healthcareAppointments",
                        JSON.stringify(
                            appointments
                        )
                    );


                    renderAppointments();

                }
            );

        });

    }


    /*
     * =========================================================
     * FILTERS
     * =========================================================
     */

    if (appointmentFilters) {

        const buttons =
            appointmentFilters.querySelectorAll(
                "[data-filter]"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedFilter =
                        button.dataset.filter;


                    renderAppointments();

                }
            );

        });

    }


    /*
     * =========================================================
     * EMPTY STATE
     * =========================================================
     */

    function renderEmptyState() {

        appointmentList.innerHTML = `
            <div class="appointments-empty">

                <div class="appointments-empty-icon">
                    <i class="bi bi-calendar-x"></i>
                </div>

                <h3>
                    No appointments here
                </h3>

                <p>
                    When you book a consultation,
                    it will appear here.
                </p>

                <a
                    href="doctors.html"
                    class="appointments-empty-button"
                >
                    Find a doctor
                    <i class="bi bi-arrow-right"></i>
                </a>

            </div>
        `;

    }


    /*
     * =========================================================
     * DATE HELPERS
     * =========================================================
     */

    function getFutureDate(days) {

        const date =
            new Date();

        date.setDate(
            date.getDate() + days
        );

        return formatInputDate(date);

    }


    function getPastDate(days) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - days
        );

        return formatInputDate(date);

    }


    function formatInputDate(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    function formatDate(dateString) {

        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        return date.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    function formatShortDate(dateString) {

        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short"
            }
        );

    }


    /*
     * =========================================================
     * INITIALS
     * =========================================================
     */

    function getInitials(name) {

        if (!name) return "DR";


        const words =
            name
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();

    }


    /*
     * =========================================================
     * HTML SAFETY
     * =========================================================
     */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /*
     * =========================================================
     * INITIAL RENDER
     * =========================================================
     */

    renderAppointments();

});