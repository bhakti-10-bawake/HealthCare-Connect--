document.addEventListener("DOMContentLoaded", async () => {

    // ============================================================
    // ELEMENTS
    // ============================================================

    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get("doctorId");

    const selectedDoctorCard =
        document.getElementById("selectedDoctorCard");

    const doctorAvatar =
        document.getElementById("doctorAvatar");

    const selectedDoctorName =
        document.getElementById("selectedDoctorName");

    const selectedDoctorSpecialization =
        document.getElementById("selectedDoctorSpecialization");

    const selectedDoctorRating =
        document.getElementById("selectedDoctorRating");

    const selectedDoctorLocation =
        document.getElementById("selectedDoctorLocation");

    const appointmentDate =
        document.getElementById("appointmentDate");

    const timeSlots =
        document.getElementById("timeSlots");

    const appointmentTime =
        document.getElementById("appointmentTime");

    const reason =
        document.getElementById("reason");

    const reasonCount =
        document.getElementById("reasonCount");

    const confirmAppointmentButton =
        document.getElementById("confirmAppointmentButton");

    const summaryDoctor =
        document.getElementById("summaryDoctor");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryTime =
        document.getElementById("summaryTime");

    const summaryFee =
        document.getElementById("summaryFee");

    const bookingSuccess =
        document.getElementById("bookingSuccess");

    const successDoctor =
        document.getElementById("successDoctor");

    const successDate =
        document.getElementById("successDate");

    const successTime =
        document.getElementById("successTime");

    const viewAppointmentsButton =
        document.getElementById("viewAppointmentsButton");


    // ============================================================
    // STATE
    // ============================================================

    let selectedDoctor = null;


    // ============================================================
    // CHECK DOCTOR ID
    // ============================================================

    if (!doctorId) {
        showBookingError(
            "No doctor was selected. Please return to the doctors page."
        );

        return;
    }


    // ============================================================
    // LOAD DOCTOR
    // ============================================================

    try {

        selectedDoctor =
            await doctorService.getById(doctorId);

        renderDoctor(selectedDoctor);

        setMinimumDate();

        generateTimeSlots();

        updateSummary();

    } catch (error) {

        console.error(
            "Booking doctor loading error:",
            error
        );

        showBookingError(
            error.message ||
            "Unable to load doctor information."
        );

        return;
    }


    // ============================================================
    // DATE CHANGE
    // ============================================================

    if (appointmentDate) {

        appointmentDate.addEventListener(
            "change",
            () => {
                appointmentTime.value = "";
                generateTimeSlots();
                updateSummary();
            }
        );
    }


    // ============================================================
    // REASON
    // ============================================================

    if (reason) {

        reason.addEventListener(
            "input",
            () => {

                if (reasonCount) {
                    reasonCount.textContent =
                        reason.value.length;
                }
            }
        );
    }


    // ============================================================
    // CONFIRM APPOINTMENT
    // ============================================================

    if (confirmAppointmentButton) {

        confirmAppointmentButton.addEventListener(
            "click",
            bookAppointment
        );
    }


    // ============================================================
    // VIEW APPOINTMENTS
    // ============================================================

    if (viewAppointmentsButton) {

        viewAppointmentsButton.addEventListener(
            "click",
            () => {
                window.location.href =
                    "appointments.html";
            }
        );
    }


    // ============================================================
    // RENDER DOCTOR
    // ============================================================

    function renderDoctor(doctor) {

        if (doctorAvatar) {
            doctorAvatar.textContent =
                getInitials(doctor.name);
        }

        if (selectedDoctorName) {
            selectedDoctorName.textContent =
                doctor.name || "Doctor";
        }

        if (selectedDoctorSpecialization) {
            selectedDoctorSpecialization.textContent =
                doctor.specialization ||
                "Healthcare Professional";
        }

        if (selectedDoctorRating) {
            selectedDoctorRating.textContent =
                doctor.rating != null
                    ? Number(doctor.rating).toFixed(1)
                    : "—";
        }

        if (selectedDoctorLocation) {

            const locationParts = [
                doctor.healthcareCentre,
                doctor.city
            ].filter(Boolean);

            selectedDoctorLocation.textContent =
                locationParts.length
                    ? locationParts.join(", ")
                    : "Location unavailable";
        }

        if (selectedDoctorCard) {
            selectedDoctorCard.classList.toggle(
                "doctor-unavailable",
                !doctor.isAvailable
            );
        }

        if (summaryDoctor) {
            summaryDoctor.textContent =
                doctor.name || "Doctor";
        }

        if (summaryFee) {
            summaryFee.textContent =
                doctor.consultationFee != null
                    ? `₹${Number(doctor.consultationFee)}`
                    : "—";
        }

        if (!doctor.isAvailable) {

            if (confirmAppointmentButton) {
                confirmAppointmentButton.disabled = true;
                confirmAppointmentButton.textContent =
                    "Doctor unavailable";
            }

            if (timeSlots) {
                timeSlots.innerHTML = `
                    <div class="booking-unavailable">
                        <i class="bi bi-calendar-x"></i>

                        <p>
                            This doctor is currently unavailable
                            for appointments.
                        </p>
                    </div>
                `;
            }
        }
    }


    // ============================================================
    // MINIMUM DATE
    // ============================================================

    function setMinimumDate() {

        if (!appointmentDate) {
            return;
        }

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(today.getDate())
                .padStart(2, "0");

        const minimumDate =
            `${year}-${month}-${day}`;

        appointmentDate.min =
            minimumDate;

        if (!appointmentDate.value) {
            appointmentDate.value =
                minimumDate;
        }
    }


    // ============================================================
    // TIME SLOTS
    // ============================================================

    function generateTimeSlots() {

        if (!timeSlots) {
            return;
        }

        if (
            !selectedDoctor ||
            !selectedDoctor.isAvailable
        ) {
            return;
        }

        const slots = [
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30"
        ];

        timeSlots.innerHTML =
            slots.map((slot) => {

                const displayTime =
                    formatTime(slot);

                return `
                    <button
                        type="button"
                        class="time-slot"
                        data-time="${slot}"
                    >
                        ${displayTime}
                    </button>
                `;

            }).join("");


        timeSlots
            .querySelectorAll(".time-slot")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        timeSlots
                            .querySelectorAll(".time-slot")
                            .forEach((slot) => {
                                slot.classList.remove(
                                    "active"
                                );
                            });

                        button.classList.add("active");

                        appointmentTime.value =
                            button.dataset.time;

                        updateSummary();
                    }
                );
            });
    }


    // ============================================================
    // UPDATE SUMMARY
    // ============================================================

    function updateSummary() {

        if (summaryDoctor && selectedDoctor) {
            summaryDoctor.textContent =
                selectedDoctor.name;
        }

        if (summaryDate) {

            if (appointmentDate?.value) {

                summaryDate.textContent =
                    formatDate(
                        appointmentDate.value
                    );

            } else {
                summaryDate.textContent =
                    "Select a date";
            }
        }

        if (summaryTime) {

            if (appointmentTime?.value) {

                summaryTime.textContent =
                    formatTime(
                        appointmentTime.value
                    );

            } else {
                summaryTime.textContent =
                    "Select a time";
            }
        }

        if (summaryFee && selectedDoctor) {

            summaryFee.textContent =
                selectedDoctor.consultationFee != null
                    ? `₹${Number(
                        selectedDoctor.consultationFee
                    )}`
                    : "—";
        }
    }


    // ============================================================
    // BOOK APPOINTMENT
    // ============================================================

    async function bookAppointment() {

        if (!selectedDoctor) {
            return;
        }


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!appointmentDate?.value) {

            showMessage(
                "Please select an appointment date.",
                "error"
            );

            return;
        }


        if (!appointmentTime?.value) {

            showMessage(
                "Please select an appointment time.",
                "error"
            );

            return;
        }


        if (!selectedDoctor.isAvailable) {

            showMessage(
                "This doctor is currently unavailable.",
                "error"
            );

            return;
        }


        // --------------------------------------------------------
        // AUTHENTICATION
        // --------------------------------------------------------

        if (
            typeof isLoggedIn === "function" &&
            !isLoggedIn()
        ) {

            showMessage(
                "Please log in before booking an appointment.",
                "error"
            );

            setTimeout(() => {
                window.location.href =
                    "login.html";
            }, 1200);

            return;
        }


        // --------------------------------------------------------
        // BUTTON LOADING
        // --------------------------------------------------------

        const originalButtonText =
            confirmAppointmentButton.textContent;

        confirmAppointmentButton.disabled = true;

        confirmAppointmentButton.innerHTML = `
            <span class="booking-button-spinner"></span>
            Booking appointment...
        `;


        try {

            // ----------------------------------------------------
            // REAL API REQUEST
            // ----------------------------------------------------

            const response =
                await apiRequest(
                    "/appointments",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            doctorId:
                                selectedDoctor.id,

                            appointmentDate:
                                appointmentDate.value,

                            appointmentTime:
                                appointmentTime.value,

                            reason:
                                reason
                                    ? reason.value.trim()
                                    : ""
                        })
                    }
                );


            // ----------------------------------------------------
            // SUCCESS
            // ----------------------------------------------------

            const appointment =
                response.data;


            showBookingSuccess(
                appointment
            );


        } catch (error) {

            console.error(
                "Appointment booking error:",
                error
            );

            showMessage(
                error.message ||
                "Unable to book the appointment. Please try again.",
                "error"
            );


            confirmAppointmentButton.disabled =
                false;

            confirmAppointmentButton.textContent =
                originalButtonText;
        }
    }


    // ============================================================
    // SUCCESS
    // ============================================================

    function showBookingSuccess(appointment) {

        if (successDoctor) {
            successDoctor.textContent =
                appointment.doctor_name ||
                selectedDoctor.name;
        }

        if (successDate) {
            successDate.textContent =
                formatDate(
                    appointment.appointment_date
                );
        }

        if (successTime) {
            successTime.textContent =
                formatTime(
                    appointment.appointment_time
                );
        }

        if (bookingSuccess) {
            bookingSuccess.classList.add("show");
        }

        if (confirmAppointmentButton) {
            confirmAppointmentButton.style.display =
                "none";
        }
    }


    // ============================================================
    // ERROR STATE
    // ============================================================

    function showBookingSuccess(appointment) {

    if (successDoctor) {
        successDoctor.textContent =
            appointment.doctor_name ||
            selectedDoctor.name;
    }

    if (successDate) {
        successDate.textContent =
            formatDate(
                appointment.appointment_date
            );
    }

    if (successTime) {
        successTime.textContent =
            formatTime(
                appointment.appointment_time
            );
    }

    if (bookingSuccess) {
        bookingSuccess.style.display = "block";
        bookingSuccess.classList.add("show");

        bookingSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    if (confirmAppointmentButton) {
        confirmAppointmentButton.style.display =
            "none";
    }
}


    // ============================================================
    // MESSAGE
    // ============================================================

    function showMessage(message, type = "info") {

        if (
            typeof window.showMessage ===
            "function"
        ) {
            window.showMessage(
                message,
                type
            );

            return;
        }

        alert(message);
    }


    // ============================================================
    // INITIALS
    // ============================================================

    function getInitials(name) {

        if (!name) {
            return "DR";
        }

        const cleanName =
            name
                .replace(/^Dr\.?\s*/i, "")
                .trim();

        const words =
            cleanName.split(/\s+/);

        if (words.length === 1) {
            return words[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    }


    // ============================================================
    // DATE FORMAT
    // ============================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "—";
        }

        const date =
            new Date(`${dateValue}T00:00:00`);

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


    // ============================================================
    // TIME FORMAT
    // ============================================================

    function formatTime(timeValue) {

        if (!timeValue) {
            return "—";
        }

        const parts =
            String(timeValue).split(":");

        if (parts.length < 2) {
            return timeValue;
        }

        let hour =
            Number(parts[0]);

        const minute =
            parts[1];

        const period =
            hour >= 12
                ? "PM"
                : "AM";

        hour =
            hour % 12 || 12;

        return `${hour}:${minute} ${period}`;
    }


    // ============================================================
    // SAFE HTML
    // ============================================================

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});