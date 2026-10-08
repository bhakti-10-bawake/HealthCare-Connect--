document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("doctorSearch");
    const specializationFilters =
        document.getElementById("specializationFilters");
    const doctorList = document.getElementById("doctorList");
    const doctorResultCount =
        document.getElementById("doctorResultCount");

    let currentSpecialization = "all";
    let searchTimeout = null;


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    loadDoctors();


    // ============================================================
    // SEARCH
    // ============================================================

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                loadDoctors();
            }, 250);
        });
    }


    // ============================================================
    // SPECIALIZATION FILTER
    // ============================================================

    if (specializationFilters) {
        specializationFilters.addEventListener("click", (event) => {
            const button =
                event.target.closest(".specialization-chip");

            if (!button) {
                return;
            }

            currentSpecialization =
                button.dataset.specialization || "all";

            document
                .querySelectorAll(".specialization-chip")
                .forEach((chip) => {
                    chip.classList.remove("active");
                });

            button.classList.add("active");

            loadDoctors();
        });
    }


    // ============================================================
    // LOAD DOCTORS
    // ============================================================

    async function loadDoctors() {
        showLoading();

        try {
            const query =
                searchInput
                    ? searchInput.value.trim()
                    : "";

            const doctors =
                await doctorService.searchAndFilter(
                    query,
                    currentSpecialization
                );

            renderDoctors(doctors);

        } catch (error) {
            console.error("Doctor loading error:", error);

            showError(
                error.message ||
                "Unable to load doctors. Please try again."
            );
        }
    }


    // ============================================================
    // RENDER DOCTORS
    // ============================================================

    function renderDoctors(doctors) {
        if (!doctorList) {
            return;
        }

        updateResultCount(doctors.length);

        if (!doctors.length) {
            doctorList.innerHTML = `
                <div class="doctor-empty">
                    <div class="doctor-empty-icon">
                        <i class="bi bi-search"></i>
                    </div>

                    <h3>No doctors found</h3>

                    <p>
                        Try a different name, specialization,
                        or search term.
                    </p>
                </div>
            `;

            return;
        }

        doctorList.innerHTML = doctors
            .map(createDoctorCard)
            .join("");
    }


    // ============================================================
    // DOCTOR CARD
    // ============================================================

    function createDoctorCard(doctor) {
        const initials = getDoctorInitials(doctor.name);

        const availabilityClass =
            doctor.isAvailable
                ? "available"
                : "unavailable";

        const availabilityText =
            doctor.isAvailable
                ? "Available"
                : "Currently unavailable";

        const location =
            doctor.healthcareCentre ||
            "Healthcare Centre";

        const fee =
            Number.isFinite(doctor.consultationFee)
                ? `₹${doctor.consultationFee}`
                : "Consultation fee unavailable";

        const rating =
            Number.isFinite(doctor.rating)
                ? doctor.rating.toFixed(1)
                : "—";

        return `
            <article class="doctor-card">

                <div class="doctor-card-top">

                    <div class="doctor-avatar">
                        ${escapeHtml(initials)}
                    </div>

                    <div class="doctor-availability ${availabilityClass}">
                        <span class="availability-dot"></span>
                        ${escapeHtml(availabilityText)}
                    </div>

                </div>


                <div class="doctor-card-identity">

                    <h3 class="doctor-name">
                        ${escapeHtml(doctor.name)}
                    </h3>

                    <p class="doctor-specialization">
                        ${escapeHtml(
                            doctor.specialization ||
                            "Healthcare Professional"
                        )}
                    </p>

                </div>


                <div class="doctor-card-details">

                    <div class="doctor-detail">
                        <i class="bi bi-mortarboard"></i>

                        <span>
                            ${escapeHtml(
                                doctor.qualifications ||
                                "Qualified Medical Professional"
                            )}
                        </span>
                    </div>


                    <div class="doctor-detail">
                        <i class="bi bi-briefcase"></i>

                        <span>
                            ${escapeHtml(
                                String(
                                    doctor.experience ?? "—"
                                )
                            )} years experience
                        </span>
                    </div>


                    <div class="doctor-detail">
                        <i class="bi bi-hospital"></i>

                        <span>
                            ${escapeHtml(location)}
                        </span>
                    </div>

                </div>


                <div class="doctor-card-footer">

                    <div class="doctor-card-meta">

                        <div class="doctor-rating">
                            <i class="bi bi-star-fill"></i>
                            <strong>${escapeHtml(rating)}</strong>
                        </div>

                        <div class="doctor-fee">
                            ${escapeHtml(fee)}
                        </div>

                    </div>


                    <a
                        href="doctor-details.html?id=${encodeURIComponent(doctor.id)}"
                        class="doctor-view-button"
                    >
                        View profile
                        <i class="bi bi-arrow-right"></i>
                    </a>

                </div>

            </article>
        `;
    }


    // ============================================================
    // LOADING STATE
    // ============================================================

    function showLoading() {
        if (!doctorList) {
            return;
        }

        doctorList.innerHTML = `
            <div class="doctor-loading">
                <div class="doctor-loading-spinner"></div>

                <p>Finding doctors for you...</p>
            </div>
        `;

        if (doctorResultCount) {
            doctorResultCount.textContent = "Loading...";
        }
    }


    // ============================================================
    // ERROR STATE
    // ============================================================

    function showError(message) {
        if (!doctorList) {
            return;
        }

        doctorList.innerHTML = `
            <div class="doctor-empty doctor-error">

                <div class="doctor-empty-icon">
                    <i class="bi bi-exclamation-circle"></i>
                </div>

                <h3>Unable to load doctors</h3>

                <p>
                    ${escapeHtml(message)}
                </p>

                <button
                    type="button"
                    class="doctor-retry-button"
                    id="doctorRetryButton"
                >
                    Try again
                </button>

            </div>
        `;

        if (doctorResultCount) {
            doctorResultCount.textContent = "0 doctors";
        }

        const retryButton =
            document.getElementById("doctorRetryButton");

        if (retryButton) {
            retryButton.addEventListener(
                "click",
                loadDoctors
            );
        }
    }


    // ============================================================
    // RESULT COUNT
    // ============================================================

    function updateResultCount(count) {
        if (!doctorResultCount) {
            return;
        }

        doctorResultCount.textContent =
            `${count} ${count === 1 ? "doctor" : "doctors"}`;
    }


    // ============================================================
    // DOCTOR INITIALS
    // ============================================================

    function getDoctorInitials(name) {
        if (!name) {
            return "DR";
        }

        const cleanName = name
            .replace(/^Dr\.?\s*/i, "")
            .trim();

        const words = cleanName.split(/\s+/);

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
});