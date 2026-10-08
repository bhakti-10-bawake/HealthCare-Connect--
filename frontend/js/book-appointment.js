document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // TEMPORARY SYNTHETIC DOCTOR DATA
    // =========================================================

    const doctors = {

        1: {
            name: "Dr. Ananya Sharma",
            specialization: "General Physician",
            rating: "4.7",
            location: "Sahyadri Community Health Centre",
            fee: 300,
            initials: "AS",
            slots: [
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "11:30 AM",
                "12:00 PM",
                "2:00 PM",
                "2:30 PM",
                "3:00 PM"
            ]
        },

        2: {
            name: "Dr. Rahul Patil",
            specialization: "Pediatrician",
            rating: "4.8",
            location: "Jeevan Jyoti Rural Hospital",
            fee: 350,
            initials: "RP",
            slots: [
                "9:30 AM",
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "2:00 PM",
                "2:30 PM",
                "3:00 PM"
            ]
        },

        3: {
            name: "Dr. Priya Deshmukh",
            specialization: "Gynecologist",
            rating: "4.9",
            location: "Aarogya Women's Centre",
            fee: 400,
            initials: "PD",
            slots: [
                "11:00 AM",
                "11:30 AM",
                "12:00 PM",
                "12:30 PM",
                "3:00 PM",
                "3:30 PM",
                "4:00 PM"
            ]
        },

        4: {
            name: "Dr. Vikram Kulkarni",
            specialization: "Cardiologist",
            rating: "4.8",
            location: "Sahyadri Community Health Centre",
            fee: 650,
            initials: "VK",
            slots: [
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "2:00 PM",
                "2:30 PM"
            ]
        },

        5: {
            name: "Dr. Meera Joshi",
            specialization: "Dermatologist",
            rating: "4.7",
            location: "Jeevan Jyoti Rural Hospital",
            fee: 500,
            initials: "MJ",
            slots: [
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "11:30 AM",
                "2:00 PM",
                "2:30 PM"
            ]
        },

        6: {
            name: "Dr. Aditya More",
            specialization: "General Physician",
            rating: "4.6",
            location: "Aarogya Primary Care Centre",
            fee: 250,
            initials: "AM",
            slots: [
                "9:00 AM",
                "9:30 AM",
                "10:00 AM",
                "10:30 AM",
                "2:00 PM",
                "2:30 PM"
            ]
        },

        7: {
            name: "Dr. Neha Pawar",
            specialization: "Pediatrician",
            rating: "4.9",
            location: "Sahyadri Community Health Centre",
            fee: 350,
            initials: "NP",
            slots: [
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "11:30 AM",
                "3:00 PM",
                "3:30 PM"
            ]
        },

        8: {
            name: "Dr. Sameer Jadhav",
            specialization: "Cardiologist",
            rating: "4.7",
            location: "Jeevan Jyoti Rural Hospital",
            fee: 600,
            initials: "SJ",
            slots: [
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "2:00 PM",
                "2:30 PM"
            ]
        },

        9: {
            name: "Dr. Riya Chavan",
            specialization: "Dermatologist",
            rating: "4.8",
            location: "Aarogya Primary Care Centre",
            fee: 450,
            initials: "RC",
            slots: [
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "2:00 PM",
                "2:30 PM",
                "3:00 PM"
            ]
        },

        10: {
            name: "Dr. Kunal Desai",
            specialization: "General Physician",
            rating: "4.8",
            location: "Jeevan Jyoti Rural Hospital",
            fee: 350,
            initials: "KD",
            slots: [
                "9:30 AM",
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "2:00 PM",
                "2:30 PM"
            ]
        },

        11: {
            name: "Dr. Snehal Shinde",
            specialization: "Gynecologist",
            rating: "4.8",
            location: "Aarogya Women's Centre",
            fee: 400,
            initials: "SS",
            slots: [
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "3:00 PM",
                "3:30 PM",
                "4:00 PM"
            ]
        },

        12: {
            name: "Dr. Arjun Wagh",
            specialization: "General Physician",
            rating: "4.6",
            location: "Sahyadri Community Health Centre",
            fee: 250,
            initials: "AW",
            slots: [
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "2:00 PM",
                "2:30 PM"
            ]
        }
    };


    // =========================================================
    // ELEMENTS
    // =========================================================

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

    const confirmButton =
        document.getElementById(
            "confirmAppointmentButton"
        );

    const bookingSuccess =
        document.getElementById("bookingSuccess");

    const selectedDoctorName =
        document.getElementById(
            "selectedDoctorName"
        );

    const selectedDoctorSpecialization =
        document.getElementById(
            "selectedDoctorSpecialization"
        );

    const selectedDoctorRating =
        document.getElementById(
            "selectedDoctorRating"
        );

    const selectedDoctorLocation =
        document.getElementById(
            "selectedDoctorLocation"
        );

    const doctorAvatar =
        document.getElementById("doctorAvatar");

    const summaryDoctor =
        document.getElementById("summaryDoctor");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryTime =
        document.getElementById("summaryTime");

    const summaryFee =
        document.getElementById("summaryFee");

    const successDoctor =
        document.getElementById("successDoctor");

    const successDate =
        document.getElementById("successDate");

    const successTime =
        document.getElementById("successTime");

    const viewAppointmentsButton =
        document.getElementById(
            "viewAppointmentsButton"
        );


    // =========================================================
    // GET DOCTOR FROM URL
    // =========================================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const doctorId =
        params.get("doctorId") || "1";

    const doctor =
        doctors[doctorId] || doctors[1];


    // =========================================================
    // LOAD DOCTOR
    // =========================================================

    selectedDoctorName.textContent =
        doctor.name;

    selectedDoctorSpecialization.textContent =
        doctor.specialization;

    selectedDoctorRating.textContent =
        doctor.rating;

    selectedDoctorLocation.textContent =
        doctor.location;

    doctorAvatar.textContent =
        doctor.initials;

    summaryDoctor.textContent =
        doctor.name;

    summaryFee.textContent =
        `₹${doctor.fee}`;


    // =========================================================
    // DATE SETUP
    // =========================================================

    const today =
        new Date();

    const todayString =
        formatDateForInput(today);

    const maxDate =
        new Date(today);

    maxDate.setDate(
        maxDate.getDate() + 30
    );

    appointmentDate.min =
        todayString;

    appointmentDate.max =
        formatDateForInput(maxDate);


    // =========================================================
    // DEFAULT DATE
    // =========================================================

    appointmentDate.value =
        todayString;

    updateSummaryDate();

    renderTimeSlots();


    // =========================================================
    // DATE CHANGE
    // =========================================================

    appointmentDate.addEventListener(
        "change",
        () => {

            appointmentTime.value = "";

            summaryTime.textContent =
                "Select a time";

            renderTimeSlots();

            updateSummaryDate();

        }
    );


    // =========================================================
    // RENDER TIME SLOTS
    // =========================================================

    function renderTimeSlots() {

        timeSlots.innerHTML = "";

        doctor.slots.forEach(
            slot => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";

                button.className =
                    "booking-time-slot";

                button.textContent =
                    slot;

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".booking-time-slot"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "selected"
                                    )
                            );

                        button.classList.add(
                            "selected"
                        );

                        appointmentTime.value =
                            slot;

                        summaryTime.textContent =
                            slot;

                    }
                );

                timeSlots.appendChild(
                    button
                );

            }
        );
    }


    // =========================================================
    // DATE SUMMARY
    // =========================================================

    function updateSummaryDate() {

        if (!appointmentDate.value) {

            summaryDate.textContent =
                "Select a date";

            return;
        }

        const date =
            new Date(
                appointmentDate.value +
                "T00:00:00"
            );

        summaryDate.textContent =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );
    }


    // =========================================================
    // REASON COUNTER
    // =========================================================

    reason.addEventListener(
        "input",
        () => {

            reasonCount.textContent =
                reason.value.length;

        }
    );


    // =========================================================
    // CONFIRM APPOINTMENT
    // =========================================================

    confirmButton.addEventListener(
        "click",
        () => {

            if (!appointmentDate.value) {

                showBookingMessage(
                    "Please select an appointment date.",
                    "warning"
                );

                return;
            }


            if (!appointmentTime.value) {

                showBookingMessage(
                    "Please select an appointment time.",
                    "warning"
                );

                return;
            }


            // Store temporary appointment
            // in localStorage so the frontend
            // can show it on the appointments page.

            const appointment = {

                id:
                    Date.now(),

                doctorId:
                    Number(doctorId),

                doctorName:
                    doctor.name,

                specialization:
                    doctor.specialization,

                date:
                    appointmentDate.value,

                time:
                    appointmentTime.value,

                fee:
                    doctor.fee,

                reason:
                    reason.value.trim(),

                status:
                    "Upcoming"

            };


            const existingAppointments =
                JSON.parse(
                    localStorage.getItem(
                        "healthcareAppointments"
                    ) || "[]"
                );


            existingAppointments.push(
                appointment
            );


            localStorage.setItem(
                "healthcareAppointments",
                JSON.stringify(
                    existingAppointments
                )
            );


            // Success information

            successDoctor.textContent =
                doctor.name;

            successDate.textContent =
                summaryDate.textContent;

            successTime.textContent =
                appointmentTime.value;


            // Hide booking form

            document
                .querySelector(
                    ".booking-layout"
                )
                .style.display = "none";

            document
                .querySelector(
                    ".booking-intro"
                )
                .style.display = "none";

            bookingSuccess.hidden = false;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    // =========================================================
    // VIEW APPOINTMENTS
    // =========================================================

    viewAppointmentsButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "appointments.html";

        }
    );


    // =========================================================
    // DATE FORMAT
    // =========================================================

    function formatDateForInput(date) {

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


    // =========================================================
    // MESSAGE
    // =========================================================

    function showBookingMessage(
        message,
        type = "info"
    ) {

        const existing =
            document.querySelector(
                ".booking-inline-message"
            );

        if (existing) {
            existing.remove();
        }


        const element =
            document.createElement(
                "div"
            );

        element.className =
            `booking-inline-message ${type}`;

        element.innerHTML = `
            <i class="bi bi-info-circle"></i>
            <span>${message}</span>
        `;


        confirmButton
            .parentNode
            .insertBefore(
                element,
                confirmButton
            );


        setTimeout(
            () => element.remove(),
            3500
        );

    }

});