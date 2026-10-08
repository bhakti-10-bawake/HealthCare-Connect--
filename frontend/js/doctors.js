document.addEventListener("DOMContentLoaded", () => {
    const doctorSearch = document.getElementById("doctorSearch");
    const doctorList = document.getElementById("doctorList");
    const doctorResultCount = document.getElementById("doctorResultCount");
    const specializationFilters = document.getElementById(
        "specializationFilters"
    );

    let allDoctors = [];
    let selectedSpecialization = "all";


    // ==========================================
    // LOAD DOCTORS FROM BACKEND
    // ==========================================

    async function loadDoctors(search = "") {
        try {
            doctorList.innerHTML = `
                <div class="card empty-state">
                    <div class="icon-box icon-box-lg">
                        <i class="bi bi-hourglass-split"></i>
                    </div>

                    <h3>Loading doctors</h3>

                    <p>
                        Please wait while we find available healthcare professionals.
                    </p>
                </div>
            `;

            const query = search
                ? `?search=${encodeURIComponent(search)}`
                : "";

            const data = await apiRequest(`/doctors${query}`);

            allDoctors = data.doctors || [];

            renderDoctors();

        } catch (error) {
            console.error("Error loading doctors:", error);

            doctorResultCount.textContent = "0";

            doctorList.innerHTML = `
                <div class="card empty-state">
                    <div class="icon-box icon-box-lg">
                        <i class="bi bi-exclamation-circle"></i>
                    </div>

                    <h3>Unable to load doctors</h3>

                    <p>
                        We couldn't connect to the healthcare directory.
                        Please try again.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary"
                        id="retryDoctorsButton"
                    >
                        <i class="bi bi-arrow-clockwise"></i>
                        Try again
                    </button>
                </div>
            `;

            const retryButton = document.getElementById(
                "retryDoctorsButton"
            );

            if (retryButton) {
                retryButton.addEventListener("click", () => {
                    loadDoctors(doctorSearch.value.trim());
                });
            }
        }
    }


    // ==========================================
    // RENDER DOCTORS
    // ==========================================

    function renderDoctors() {
        let filteredDoctors = allDoctors;

        if (selectedSpecialization !== "all") {
            filteredDoctors = allDoctors.filter(
                doctor =>
                    doctor.specialization &&
                    doctor.specialization.toLowerCase() ===
                        selectedSpecialization.toLowerCase()
            );
        }

        doctorResultCount.textContent = filteredDoctors.length;


        if (filteredDoctors.length === 0) {
            doctorList.innerHTML = `
                <div class="card empty-state">
                    <div class="icon-box icon-box-lg">
                        <i class="bi bi-person-x"></i>
                    </div>

                    <h3>No doctors found</h3>

                    <p>
                        We couldn't find a doctor matching your search.
                        Try another name or specialization.
                    </p>
                </div>
            `;

            return;
        }


        doctorList.innerHTML = filteredDoctors
            .map(createDoctorCard)
            .join("");


        attachDoctorButtons();
    }


    // ==========================================
    // CREATE DOCTOR CARD
    // ==========================================

    function createDoctorCard(doctor) {
        const initials = getInitials(doctor.name);

        const rating = Number(doctor.rating || 0).toFixed(1);

        const experience = Number(
            doctor.experience_years || 0
        );

        const fee = Number(
            doctor.consultation_fee || 0
        ).toFixed(0);

        const availability = doctor.is_available
            ? `
                <span class="badge badge-success">
                    <i class="bi bi-circle-fill"></i>
                    Available
                </span>
            `
            : `
                <span class="badge badge-muted">
                    <i class="bi bi-circle-fill"></i>
                    Currently unavailable
                </span>
            `;


        return `
            <article class="card doctor-card">

                <div class="d-flex align-items-start justify-content-between gap-3">

                    <div class="avatar avatar-lg">
                        ${escapeHtml(initials)}
                    </div>

                    ${availability}

                </div>


                <div class="mt-3">

                    <h3 class="card-title">
                        ${escapeHtml(doctor.name)}
                    </h3>

                    <p class="text-primary">
                        ${escapeHtml(
                            doctor.specialization || "Healthcare Professional"
                        )}
                    </p>

                </div>


                <div class="doctor-card-details">

                    <div class="info-row">

                        <i class="bi bi-mortarboard"></i>

                        <span>
                            ${escapeHtml(
                                doctor.qualification || "Qualified Professional"
                            )}
                        </span>

                    </div>


                    <div class="info-row">

                        <i class="bi bi-briefcase"></i>

                        <span>
                            ${experience} ${
                                experience === 1
                                    ? "year"
                                    : "years"
                            } experience
                        </span>

                    </div>


                    <div class="info-row">

                        <i class="bi bi-geo-alt"></i>

                        <span>
                            ${escapeHtml(
                                doctor.healthcare_centre ||
                                "Healthcare Centre"
                            )}
                        </span>

                    </div>

                </div>


                <div class="doctor-card-meta">

                    <div>

                        <span class="text-muted">
                            Consultation
                        </span>

                        <strong>
                            ₹${fee}
                        </strong>

                    </div>


                    <div class="doctor-rating">

                        <i class="bi bi-star-fill"></i>

                        <strong>
                            ${rating}
                        </strong>

                    </div>

                </div>


                <button
                    type="button"
                    class="btn btn-primary btn-block view-doctor-button"
                    data-doctor-id="${doctor.id}"
                >
                    View Profile
                    <i class="bi bi-arrow-right"></i>
                </button>

            </article>
        `;
    }


    // ==========================================
    // VIEW DOCTOR PROFILE
    // ==========================================

    function attachDoctorButtons() {
        const buttons = document.querySelectorAll(
            ".view-doctor-button"
        );

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const doctorId = button.dataset.doctorId;

                if (!doctorId) {
                    return;
                }

                window.location.href =
                    `doctor-details.html?id=${doctorId}`;
            });
        });
    }


    // ==========================================
    // SEARCH
    // ==========================================

    let searchTimeout;

    doctorSearch.addEventListener("input", () => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const searchValue = doctorSearch.value.trim();

            loadDoctors(searchValue);
        }, 300);
    });


    // ==========================================
    // SPECIALIZATION FILTERS
    // ==========================================

    const specializationButtons =
        specializationFilters.querySelectorAll(
            "[data-specialization]"
        );

    specializationButtons.forEach(button => {
        button.addEventListener("click", () => {

            specializationButtons.forEach(item => {
                item.classList.remove("active");

                item.classList.remove(
                    "btn-secondary"
                );

                item.classList.add(
                    "btn-outline"
                );
            });


            button.classList.add("active");

            button.classList.remove(
                "btn-outline"
            );

            button.classList.add(
                "btn-secondary"
            );


            selectedSpecialization =
                button.dataset.specialization;


            renderDoctors();
        });
    });


    // ==========================================
    // GET INITIALS
    // ==========================================

    function getInitials(name) {
        if (!name) {
            return "DR";
        }

        const words = name
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


    // ==========================================
    // BASIC HTML ESCAPING
    // ==========================================

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadDoctors();
});