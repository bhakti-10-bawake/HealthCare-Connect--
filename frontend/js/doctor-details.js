document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GET ELEMENTS
    // ==========================================

    const doctorStatus =
        document.getElementById("doctorStatus");

    const doctorName =
        document.getElementById("doctorName");

    const doctorSpecialization =
        document.getElementById("doctorSpecialization");

    const doctorRating =
        document.getElementById("doctorRating");

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

    const bookDoctorButton =
        document.getElementById("bookDoctorButton");


    // ==========================================
    // GET DOCTOR ID
    // ==========================================

    const urlParams =
        new URLSearchParams(window.location.search);

    const doctorId =
        urlParams.get("id");


    if (!doctorId) {
        showError("No doctor was selected.");
        return;
    }


    // ==========================================
    // LOAD DOCTOR
    // ==========================================

    async function loadDoctor() {

        try {

            const data =
                await apiRequest(`/doctors/${doctorId}`);


            if (!data.doctor) {
                throw new Error(
                    "Doctor information not found."
                );
            }


            renderDoctor(data.doctor);

        } catch (error) {

            console.error(
                "Error loading doctor:",
                error
            );

            showError(
                error.message ||
                "Unable to load doctor information."
            );
        }
    }


    // ==========================================
    // RENDER DOCTOR
    // ==========================================

    function renderDoctor(doctor) {

        doctorName.textContent =
            doctor.name || "Doctor";


        doctorSpecialization.textContent =
            doctor.specialization ||
            "Healthcare Professional";


        // Rating

        const rating =
            Number(doctor.rating || 0).toFixed(1);

        doctorRating.textContent =
            rating;


        // Experience

        const experience =
            Number(doctor.experience_years || 0);

        doctorExperience.textContent =
            `${experience} ${
                experience === 1
                    ? "year"
                    : "years"
            }`;


        // Fee

        const fee =
            Number(
                doctor.consultation_fee || 0
            ).toFixed(0);

        doctorFee.textContent =
            `₹${fee}`;


        // Location

        const locationParts = [
            doctor.healthcare_centre,
            doctor.village,
            doctor.taluka,
            doctor.district
        ].filter(Boolean);


        doctorLocation.textContent =
            locationParts.length > 0
                ? locationParts.join(", ")
                : "Healthcare Centre";


        // Bio

        doctorBio.textContent =
            doctor.bio ||
            "This healthcare professional has not added a biography yet.";


        // Status

        updateStatus(
            doctor.is_available
        );


        // Real availability

        renderAvailability(
            doctor.availability || []
        );


        // Booking link

        bookDoctorButton.href =
            `book-appointment.html?doctorId=${doctor.id}`;
    }


    // ==========================================
    // STATUS
    // ==========================================

    function updateStatus(isAvailable) {

        if (isAvailable) {

            doctorStatus.textContent =
                "Available";

            doctorStatus.className =
                "badge badge-success";

        } else {

            doctorStatus.textContent =
                "Currently unavailable";

            doctorStatus.className =
                "badge badge-muted";
        }
    }


    // ==========================================
    // RENDER WEEKLY AVAILABILITY
    // ==========================================

    function renderAvailability(availability) {

        const days = [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY"
        ];


        const dayLabels = {
            MONDAY: "Monday",
            TUESDAY: "Tuesday",
            WEDNESDAY: "Wednesday",
            THURSDAY: "Thursday",
            FRIDAY: "Friday",
            SATURDAY: "Saturday",
            SUNDAY: "Sunday"
        };


        if (availability.length === 0) {

            doctorAvailability.innerHTML = `
                <div class="availability-row">

                    <span>
                        Consultation schedule
                    </span>

                    <span class="badge badge-muted">
                        Not available
                    </span>

                </div>
            `;

            return;
        }


        doctorAvailability.innerHTML =
            days.map(day => {

                const schedules =
                    availability.filter(
                        item =>
                            item.day_of_week === day
                    );


                if (schedules.length === 0) {

                    return `
                        <div class="availability-row">

                            <span>
                                ${dayLabels[day]}
                            </span>

                            <span class="badge badge-muted">
                                Not available
                            </span>

                        </div>
                    `;
                }


                const timeRanges =
                    schedules
                        .map(schedule => {

                            const start =
                                formatTime(
                                    schedule.start_time
                                );

                            const end =
                                formatTime(
                                    schedule.end_time
                                );

                            return `${start} – ${end}`;
                        })
                        .join("<br>");


                return `
                    <div class="availability-row">

                        <span>
                            ${dayLabels[day]}
                        </span>

                        <span class="badge badge-success">
                            ${timeRanges}
                        </span>

                    </div>
                `;

            }).join("");
    }


    // ==========================================
    // FORMAT TIME
    // ==========================================

    function formatTime(time) {

        if (!time) {
            return "";
        }


        const parts =
            String(time).split(":");


        let hours =
            Number(parts[0]);

        const minutes =
            parts[1] || "00";


        const period =
            hours >= 12
                ? "PM"
                : "AM";


        hours =
            hours % 12 || 12;


        return `${hours}:${minutes} ${period}`;
    }


    // ==========================================
    // ERROR STATE
    // ==========================================

    function showError(message) {

        doctorName.textContent =
            "Doctor unavailable";

        doctorSpecialization.textContent =
            "";

        doctorRating.textContent =
            "—";

        doctorExperience.textContent =
            "—";

        doctorFee.textContent =
            "—";

        doctorLocation.textContent =
            "—";

        doctorBio.textContent =
            message;

        doctorStatus.textContent =
            "Unavailable";

        doctorStatus.className =
            "badge badge-muted";


        doctorAvailability.innerHTML = `
            <div class="availability-row">

                <span>
                    Doctor information
                </span>

                <span class="badge badge-muted">
                    Unavailable
                </span>

            </div>
        `;


        bookDoctorButton.style.display =
            "none";
    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadDoctor();

});