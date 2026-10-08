document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // GET ELEMENTS
    // =========================================================

    const doctorAvatar =
        document.getElementById("doctorAvatar");

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

    const bookingFee =
        document.getElementById("bookingFee");

    const bookDoctorButton =
        document.getElementById("bookDoctorButton");


    // =========================================================
    // TEMPORARY FRONTEND DOCTOR DATA
    // =========================================================
    // Synthetic prototype data.
    // Later this will be replaced by the real backend API.

    const doctors = {

        1: {
            id: 1,
            name: "Dr. Ananya Sharma",
            specialization: "General Physician",
            rating: 4.7,
            experience_years: 6,
            consultation_fee: 300,
            healthcare_centre: "Sahyadri Community Health Centre",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Ananya Sharma provides comprehensive primary care with a focus on preventive health, common illnesses and long-term patient wellbeing. She believes in simple, accessible and patient-centred healthcare.",

            availability: {
                Monday: "10:00 AM – 1:00 PM",
                Tuesday: "10:00 AM – 1:00 PM",
                Wednesday: "2:00 PM – 5:00 PM",
                Thursday: "10:00 AM – 1:00 PM",
                Friday: "10:00 AM – 1:00 PM",
                Saturday: "10:00 AM – 12:00 PM"
            }
        },


        2: {
            id: 2,
            name: "Dr. Rahul Patil",
            specialization: "Pediatrician",
            rating: 4.8,
            experience_years: 8,
            consultation_fee: 350,
            healthcare_centre: "Jeevan Jyoti Rural Hospital",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Rahul Patil specialises in child healthcare, preventive paediatrics and childhood illnesses. His approach focuses on helping families understand their child's health and development.",

            availability: {
                Monday: "9:30 AM – 12:30 PM",
                Tuesday: "2:00 PM – 5:00 PM",
                Wednesday: "9:30 AM – 12:30 PM",
                Thursday: "2:00 PM – 5:00 PM",
                Friday: "9:30 AM – 12:30 PM",
                Saturday: "10:00 AM – 1:00 PM"
            }
        },


        3: {
            id: 3,
            name: "Dr. Priya Deshmukh",
            specialization: "Gynecologist",
            rating: 4.9,
            experience_years: 7,
            consultation_fee: 400,
            healthcare_centre: "Aarogya Women's Centre",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Priya Deshmukh provides women's healthcare services across different stages of life, with an emphasis on preventive care, reproductive health and supportive consultations.",

            availability: {
                Monday: "11:00 AM – 2:00 PM",
                Tuesday: "11:00 AM – 2:00 PM",
                Wednesday: "3:00 PM – 6:00 PM",
                Thursday: "11:00 AM – 2:00 PM",
                Friday: "3:00 PM – 6:00 PM",
                Saturday: "10:00 AM – 1:00 PM"
            }
        },


        4: {
            id: 4,
            name: "Dr. Vikram Kulkarni",
            specialization: "Cardiologist",
            rating: 4.8,
            experience_years: 12,
            consultation_fee: 650,
            healthcare_centre: "Sahyadri Community Health Centre",
            location: "Kopargaon",
            is_available: false,

            bio:
                "Dr. Vikram Kulkarni focuses on cardiovascular health, preventive cardiology and ongoing management of heart-related conditions.",

            availability: {
                Monday: "10:00 AM – 1:00 PM",
                Wednesday: "10:00 AM – 1:00 PM",
                Friday: "2:00 PM – 5:00 PM"
            }
        },


        5: {
            id: 5,
            name: "Dr. Meera Joshi",
            specialization: "Dermatologist",
            rating: 4.7,
            experience_years: 9,
            consultation_fee: 500,
            healthcare_centre: "Jeevan Jyoti Rural Hospital",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Meera Joshi provides consultations for common skin, hair and nail conditions while focusing on practical and accessible dermatological care.",

            availability: {
                Tuesday: "10:00 AM – 1:00 PM",
                Wednesday: "2:00 PM – 5:00 PM",
                Thursday: "10:00 AM – 1:00 PM",
                Saturday: "10:00 AM – 1:00 PM"
            }
        },


        6: {
            id: 6,
            name: "Dr. Aditya More",
            specialization: "General Physician",
            rating: 4.6,
            experience_years: 5,
            consultation_fee: 250,
            healthcare_centre: "Aarogya Primary Care Centre",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Aditya More provides primary healthcare consultations covering common illnesses, preventive care and routine health concerns.",

            availability: {
                Monday: "9:00 AM – 12:00 PM",
                Tuesday: "9:00 AM – 12:00 PM",
                Thursday: "2:00 PM – 5:00 PM",
                Friday: "9:00 AM – 12:00 PM"
            }
        },


        7: {
            id: 7,
            name: "Dr. Neha Pawar",
            specialization: "Pediatrician",
            rating: 4.9,
            experience_years: 6,
            consultation_fee: 350,
            healthcare_centre: "Sahyadri Community Health Centre",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Neha Pawar focuses on child wellness, growth monitoring, preventive healthcare and treatment of common childhood conditions.",

            availability: {
                Monday: "10:00 AM – 1:00 PM",
                Wednesday: "10:00 AM – 1:00 PM",
                Thursday: "3:00 PM – 6:00 PM",
                Saturday: "10:00 AM – 1:00 PM"
            }
        },


        8: {
            id: 8,
            name: "Dr. Sameer Jadhav",
            specialization: "Cardiologist",
            rating: 4.7,
            experience_years: 10,
            consultation_fee: 600,
            healthcare_centre: "Jeevan Jyoti Rural Hospital",
            location: "Kopargaon",
            is_available: false,

            bio:
                "Dr. Sameer Jadhav focuses on cardiovascular consultations, preventive heart care and long-term health monitoring.",

            availability: {
                Tuesday: "10:00 AM – 1:00 PM",
                Thursday: "10:00 AM – 1:00 PM",
                Saturday: "2:00 PM – 5:00 PM"
            }
        },


        9: {
            id: 9,
            name: "Dr. Riya Chavan",
            specialization: "Dermatologist",
            rating: 4.8,
            experience_years: 5,
            consultation_fee: 450,
            healthcare_centre: "Aarogya Primary Care Centre",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Riya Chavan provides dermatology consultations for common skin and hair concerns with an emphasis on clear and practical treatment guidance.",

            availability: {
                Monday: "2:00 PM – 5:00 PM",
                Wednesday: "10:00 AM – 1:00 PM",
                Friday: "2:00 PM – 5:00 PM",
                Saturday: "10:00 AM – 1:00 PM"
            }
        },


        10: {
            id: 10,
            name: "Dr. Kunal Desai",
            specialization: "General Physician",
            rating: 4.8,
            experience_years: 11,
            consultation_fee: 350,
            healthcare_centre: "Jeevan Jyoti Rural Hospital",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Kunal Desai offers primary care consultations with experience in preventive health, routine illnesses and ongoing health management.",

            availability: {
                Monday: "9:30 AM – 12:30 PM",
                Tuesday: "2:00 PM – 5:00 PM",
                Wednesday: "9:30 AM – 12:30 PM",
                Friday: "9:30 AM – 12:30 PM",
                Saturday: "10:00 AM – 1:00 PM"
            }
        },


        11: {
            id: 11,
            name: "Dr. Snehal Shinde",
            specialization: "Gynecologist",
            rating: 4.8,
            experience_years: 8,
            consultation_fee: 400,
            healthcare_centre: "Aarogya Women's Centre",
            location: "Kopargaon",
            is_available: true,

            bio:
                "Dr. Snehal Shinde provides women's healthcare consultations with a focus on preventive care, reproductive health and general wellbeing.",

            availability: {
                Monday: "10:00 AM – 1:00 PM",
                Tuesday: "3:00 PM – 6:00 PM",
                Thursday: "10:00 AM – 1:00 PM",
                Friday: "3:00 PM – 6:00 PM"
            }
        },


        12: {
            id: 12,
            name: "Dr. Arjun Wagh",
            specialization: "General Physician",
            rating: 4.6,
            experience_years: 4,
            consultation_fee: 250,
            healthcare_centre: "Sahyadri Community Health Centre",
            location: "Kopargaon",
            is_available: false,

            bio:
                "Dr. Arjun Wagh provides general medical consultations and preventive healthcare support for patients and families.",

            availability: {
                Monday: "10:00 AM – 1:00 PM",
                Wednesday: "2:00 PM – 5:00 PM",
                Friday: "10:00 AM – 1:00 PM"
            }
        }

    };


    // =========================================================
    // GET DOCTOR ID FROM URL
    // =========================================================

    const urlParams =
        new URLSearchParams(window.location.search);

    const doctorId =
        urlParams.get("id");


    // =========================================================
    // CHECK DOCTOR
    // =========================================================

    if (!doctorId || !doctors[doctorId]) {

        showError(
            "The selected doctor could not be found."
        );

        return;
    }


    // =========================================================
    // LOAD DOCTOR
    // =========================================================

    const doctor =
        doctors[doctorId];

    renderDoctor(doctor);


    // =========================================================
    // RENDER DOCTOR
    // =========================================================

    function renderDoctor(doctor) {

        // -----------------------------------------
        // Avatar
        // -----------------------------------------

        if (doctorAvatar) {

            doctorAvatar.textContent =
                getInitials(doctor.name);

        }


        // -----------------------------------------
        // Name
        // -----------------------------------------

        doctorName.textContent =
            doctor.name;


        // -----------------------------------------
        // Specialization
        // -----------------------------------------

        doctorSpecialization.textContent =
            doctor.specialization;


        // -----------------------------------------
        // Rating
        // -----------------------------------------

        doctorRating.textContent =
            Number(doctor.rating).toFixed(1);


        // -----------------------------------------
        // Experience
        // -----------------------------------------

        doctorExperience.textContent =
            `${doctor.experience_years} ${
                doctor.experience_years === 1
                    ? "year"
                    : "years"
            }`;


        // -----------------------------------------
        // Fee
        // -----------------------------------------

        const formattedFee =
            `₹${Number(
                doctor.consultation_fee
            ).toFixed(0)}`;

        doctorFee.textContent =
            formattedFee;

        if (bookingFee) {
            bookingFee.textContent =
                formattedFee;
        }


        // -----------------------------------------
        // Location
        // -----------------------------------------

        doctorLocation.textContent =
            `${doctor.healthcare_centre}, ${
                doctor.location
            }`;


        // -----------------------------------------
        // Bio
        // -----------------------------------------

        doctorBio.textContent =
            doctor.bio;


        // -----------------------------------------
        // Status
        // -----------------------------------------

        updateStatus(
            doctor.is_available
        );


        // -----------------------------------------
        // Availability
        // -----------------------------------------

        renderAvailability(
            doctor.availability
        );


        // -----------------------------------------
        // Booking
        // -----------------------------------------

        if (bookDoctorButton) {

            bookDoctorButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `book-appointment.html?doctorId=${doctor.id}`;

                }
            );

        }

    }


    // =========================================================
    // STATUS
    // =========================================================

    function updateStatus(isAvailable) {

        if (!doctorStatus) return;


        if (isAvailable) {

            doctorStatus.innerHTML = `
                <span class="doctor-status-dot"></span>
                Available
            `;

            doctorStatus.classList.remove(
                "unavailable"
            );

        } else {

            doctorStatus.innerHTML = `
                <span class="doctor-status-dot unavailable-dot"></span>
                Currently unavailable
            `;

            doctorStatus.classList.add(
                "unavailable"
            );

        }

    }


    // =========================================================
    // WEEKLY AVAILABILITY
    // =========================================================

    function renderAvailability(availability) {

        if (!doctorAvailability) return;


        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];


        doctorAvailability.innerHTML =
            days.map(day => {

                const schedule =
                    availability[day];


                if (!schedule) {

                    return `
                        <div class="doctor-schedule-row">

                            <span>
                                ${day}
                            </span>

                            <span class="schedule-unavailable">
                                Not available
                            </span>

                        </div>
                    `;

                }


                return `
                    <div class="doctor-schedule-row">

                        <span>
                            ${day}
                        </span>

                        <span class="schedule-available">
                            ${schedule}
                        </span>

                    </div>
                `;

            }).join("");

    }


    // =========================================================
    // ERROR STATE
    // =========================================================

    function showError(message) {

        if (doctorAvatar) {
            doctorAvatar.textContent = "DR";
        }

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

        if (bookingFee) {
            bookingFee.textContent =
                "—";
        }

        if (doctorStatus) {

            doctorStatus.innerHTML = `
                <span class="doctor-status-dot unavailable-dot"></span>
                Unavailable
            `;

        }

        if (doctorAvailability) {

            doctorAvailability.innerHTML = `
                <div class="availability-placeholder">

                    <span class="availability-placeholder-icon">
                        <i class="bi bi-calendar-x"></i>
                    </span>

                    <div>

                        <strong>
                            Appointment unavailable
                        </strong>

                        <p>
                            We couldn't find this doctor's profile.
                        </p>

                    </div>

                </div>
            `;

        }

        if (bookDoctorButton) {
            bookDoctorButton.style.display = "none";
        }

    }


    // =========================================================
    // INITIALS
    // =========================================================

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

});