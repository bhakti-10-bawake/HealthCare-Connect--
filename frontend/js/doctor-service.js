document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get("id");

    const doctor = doctorService.getById(doctorId);

    const doctorAvatar = document.getElementById("doctorAvatar");
    const doctorStatus = document.getElementById("doctorStatus");
    const doctorName = document.getElementById("doctorName");
    const doctorSpecialization =
        document.getElementById("doctorSpecialization");
    const doctorRating = document.getElementById("doctorRating");

    const doctorExperience =
        document.getElementById("doctorExperience");
    const doctorFee =
        document.getElementById("doctorFee");
    const doctorLocation =
        document.getElementById("doctorLocation");

    const doctorBio =
        document.getElementById("doctorBio");
    const doctorAvailability =
        document.getElementById("doctorAvailability");

    const bookingFee =
        document.getElementById("bookingFee");
    const bookDoctorButton =
        document.getElementById("bookDoctorButton");


    if (!doctor) {
        showDoctorNotFound();
        return;
    }


    /* -----------------------------
       Basic profile information
    ----------------------------- */

    const initials = doctor.name
        .replace("Dr. ", "")
        .split(" ")
        .map(name => name.charAt(0))
        .slice(0, 2)
        .join("");


    if (doctorAvatar) {
        doctorAvatar.textContent = initials;
    }


    if (doctorName) {
        doctorName.textContent = doctor.name;
    }


    if (doctorSpecialization) {
        doctorSpecialization.textContent =
            doctor.specialization;
    }


    if (doctorRating) {
        doctorRating.innerHTML = `
            <i class="bi bi-star-fill"></i>
            ${doctor.rating}
        `;
    }


    if (doctorExperience) {
        doctorExperience.textContent =
            `${doctor.experience} years`;
    }


    if (doctorFee) {
        doctorFee.textContent =
            `₹${doctor.fee}`;
    }


    if (doctorLocation) {
        doctorLocation.textContent =
            doctor.centre;
    }


    if (doctorBio) {
        doctorBio.textContent =
            doctor.bio;
    }


    if (bookingFee) {
        bookingFee.textContent =
            `₹${doctor.fee}`;
    }


    /* -----------------------------
       Availability
    ----------------------------- */

    if (doctorStatus) {

        doctorStatus.classList.toggle(
            "unavailable",
            !doctor.available
        );

        doctorStatus.innerHTML = `
            <span class="doctor-status-dot"></span>
            ${doctor.available
                ? "Available for consultation"
                : "Currently unavailable"}
        `;
    }


    renderAvailability(doctor);


    /* -----------------------------
       Booking button
    ----------------------------- */

    if (bookDoctorButton) {

        if (!doctor.available) {

            bookDoctorButton.disabled = true;
            bookDoctorButton.classList.add("disabled");
            bookDoctorButton.textContent =
                "Currently unavailable";

        } else {

            bookDoctorButton.addEventListener("click", () => {

                window.location.href =
                    `book-appointment.html?doctorId=${doctor.id}`;

            });

        }
    }


    /* -----------------------------
       Weekly schedule
    ----------------------------- */

    function renderAvailability(doctor) {

        if (!doctorAvailability) return;

        const schedule = [
            {
                day: "Monday",
                time: "10:00 AM – 2:00 PM",
                available: doctor.available
            },
            {
                day: "Tuesday",
                time: "10:00 AM – 2:00 PM",
                available: true
            },
            {
                day: "Wednesday",
                time: "4:00 PM – 7:00 PM",
                available: true
            },
            {
                day: "Thursday",
                time: "10:00 AM – 2:00 PM",
                available: true
            },
            {
                day: "Friday",
                time: "4:00 PM – 7:00 PM",
                available: doctor.available
            },
            {
                day: "Saturday",
                time: "10:00 AM – 1:00 PM",
                available: true
            },
            {
                day: "Sunday",
                time: "Closed",
                available: false
            }
        ];


        doctorAvailability.innerHTML = schedule
            .map(item => `
                <div class="doctor-schedule-row">

                    <span class="doctor-schedule-day">
                        ${item.day}
                    </span>

                    <span class="${
                        item.available
                            ? "schedule-available"
                            : "schedule-unavailable"
                    }">
                        ${item.time}
                    </span>

                </div>
            `)
            .join("");
    }


    /* -----------------------------
       Doctor not found
    ----------------------------- */

    function showDoctorNotFound() {

        const page = document.querySelector(".doctor-details-page");

        if (!page) return;

        page.innerHTML = `
            <div class="doctor-empty-state">

                <div class="doctor-empty-icon">
                    <i class="bi bi-person-x"></i>
                </div>

                <h2>Doctor not found</h2>

                <p>
                    We couldn't find the doctor you're looking for.
                </p>

                <a
                    href="doctors.html"
                    class="btn btn-primary"
                >
                    Back to doctors
                </a>

            </div>
        `;
    }

});