document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get("id");

    if (!doctorId) {
        showDoctorError("Doctor information was not provided.");
        return;
    }

    try {
        const doctor = await doctorService.getById(doctorId);

        renderDoctorDetails(doctor);

    } catch (error) {
        console.error("Doctor details error:", error);

        showDoctorError(
            error.message ||
            "Unable to load doctor details."
        );
    }
});


// ============================================================
// RENDER DOCTOR DETAILS
// ============================================================

function renderDoctorDetails(doctor) {

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


    // ----------------------------------------------------------
    // BASIC INFORMATION
    // ----------------------------------------------------------

    if (doctorAvatar) {
        doctorAvatar.textContent =
            getDoctorInitials(doctor.name);
    }

    if (doctorName) {
        doctorName.textContent =
            doctor.name || "Doctor";
    }

    if (doctorSpecialization) {
        doctorSpecialization.textContent =
            doctor.specialization ||
            "Healthcare Professional";
    }


    // ----------------------------------------------------------
    // RATING
    // ----------------------------------------------------------

    if (doctorRating) {
        doctorRating.textContent =
            doctor.rating
                ? Number(doctor.rating).toFixed(1)
                : "—";
    }


    // ----------------------------------------------------------
    // EXPERIENCE
    // ----------------------------------------------------------

    if (doctorExperience) {
        doctorExperience.textContent =
            doctor.experience != null
                ? `${doctor.experience} years`
                : "—";
    }


    // ----------------------------------------------------------
    // CONSULTATION FEE
    // ----------------------------------------------------------

    const fee =
        doctor.consultationFee != null
            ? Number(doctor.consultationFee)
            : null;

    if (doctorFee) {
        doctorFee.textContent =
            fee !== null
                ? `₹${fee}`
                : "—";
    }

    if (bookingFee) {
        bookingFee.textContent =
            fee !== null
                ? `₹${fee}`
                : "Fee unavailable";
    }


    // ----------------------------------------------------------
    // LOCATION
    // ----------------------------------------------------------

    if (doctorLocation) {
        const locationParts = [
            doctor.healthcareCentre,
            doctor.city,
            doctor.state
        ].filter(Boolean);

        doctorLocation.textContent =
            locationParts.length
                ? locationParts.join(", ")
                : "Location unavailable";
    }


    // ----------------------------------------------------------
    // BIO
    // ----------------------------------------------------------

    if (doctorBio) {
        doctorBio.textContent =
            doctor.bio ||
            "Doctor information is currently unavailable.";
    }


    // ----------------------------------------------------------
    // AVAILABILITY
    // ----------------------------------------------------------

    if (doctorStatus) {

        doctorStatus.classList.remove(
            "available",
            "unavailable"
        );

        if (doctor.isAvailable) {
            doctorStatus.classList.add("available");
            doctorStatus.textContent = "Available";
        } else {
            doctorStatus.classList.add("unavailable");
            doctorStatus.textContent = "Currently unavailable";
        }
    }


    if (doctorAvailability) {

        if (doctor.isAvailable) {
            doctorAvailability.innerHTML = `
                <div class="availability-indicator available">
                    <span class="availability-dot"></span>
                    <div>
                        <strong>Available for appointments</strong>
                        <span>Book a consultation with this doctor.</span>
                    </div>
                </div>
            `;
        } else {
            doctorAvailability.innerHTML = `
                <div class="availability-indicator unavailable">
                    <span class="availability-dot"></span>
                    <div>
                        <strong>Currently unavailable</strong>
                        <span>This doctor is not accepting appointments right now.</span>
                    </div>
                </div>
            `;
        }
    }


    // ----------------------------------------------------------
    // BOOK APPOINTMENT
    // ----------------------------------------------------------

    if (bookDoctorButton) {

        if (doctor.isAvailable) {

            bookDoctorButton.disabled = false;

            bookDoctorButton.addEventListener(
                "click",
                () => {
                    window.location.href =
                        `book-appointment.html?doctorId=${encodeURIComponent(
                            doctor.id
                        )}`;
                }
            );

        } else {

            bookDoctorButton.disabled = true;
            bookDoctorButton.textContent =
                "Currently unavailable";
        }
    }


    // ----------------------------------------------------------
    // ADDITIONAL DOCTOR INFORMATION
    // ----------------------------------------------------------

    const doctorQualifications =
        document.getElementById("doctorQualifications");

    const doctorCentre =
        document.getElementById("doctorCentre");

    const doctorCentreAddress =
        document.getElementById("doctorCentreAddress");


    if (doctorQualifications) {
        doctorQualifications.textContent =
            doctor.qualifications || "Not available";
    }

    if (doctorCentre) {
        doctorCentre.textContent =
            doctor.healthcareCentre ||
            "Healthcare centre unavailable";
    }

    if (doctorCentreAddress) {

        const addressParts = [
            doctor.address,
            doctor.city,
            doctor.state
        ].filter(Boolean);

        doctorCentreAddress.textContent =
            addressParts.length
                ? addressParts.join(", ")
                : "Address unavailable";
    }
};


// ============================================================
// ERROR STATE
// ============================================================

function showDoctorError(message) {

    const page =
        document.querySelector(".doctor-details-page") ||
        document.body;

    page.innerHTML = `
        <main class="doctor-details-error">

            <div class="doctor-error-icon">
                <i class="bi bi-person-x"></i>
            </div>

            <h1>Doctor not found</h1>

            <p>
                ${escapeHtml(message)}
            </p>

            <a
                href="doctors.html"
                class="doctor-back-button"
            >
                <i class="bi bi-arrow-left"></i>
                Back to doctors
            </a>

        </main>
    `;
}


// ============================================================
// INITIALS
// ============================================================

function getDoctorInitials(name) {

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
// SAFE HTML ESCAPING
// ============================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}