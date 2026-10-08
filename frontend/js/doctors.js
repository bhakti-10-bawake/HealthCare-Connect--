document.addEventListener("DOMContentLoaded", () => {

    const doctorSearch = document.getElementById("doctorSearch");
    const specializationFilters =
        document.getElementById("specializationFilters");
    const doctorList = document.getElementById("doctorList");
    const doctorResultCount =
        document.getElementById("doctorResultCount");

    let currentSpecialization = "all";
    let currentSearch = "";


    function renderDoctors(doctors) {

        if (!doctorList) return;

        if (!doctors.length) {
            doctorList.innerHTML = `
                <div class="doctor-empty-state">
                    <div class="doctor-empty-icon">
                        <i class="bi bi-person-x"></i>
                    </div>

                    <h3>No doctors found</h3>

                    <p>
                        We couldn't find a doctor matching your search.
                        Try another name or specialization.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary"
                        id="clearDoctorFilters"
                    >
                        Clear filters
                    </button>
                </div>
            `;

            if (doctorResultCount) {
                doctorResultCount.textContent = "0 doctors";
            }

            document
                .getElementById("clearDoctorFilters")
                ?.addEventListener("click", clearFilters);

            return;
        }


        doctorList.innerHTML = doctors.map(doctor => {

            const initials = doctor.name
                .replace("Dr. ", "")
                .split(" ")
                .map(name => name.charAt(0))
                .slice(0, 2)
                .join("");

            return `
                <article class="doctor-profile-card">

                    <div class="doctor-profile-top">

                        <div class="doctor-profile-avatar">
                            ${escapeHtml(initials)}
                        </div>

                        <div class="doctor-availability">
                            <span class="doctor-availability-dot ${
                                doctor.available
                                    ? "available"
                                    : "unavailable"
                            }"></span>

                            ${
                                doctor.available
                                    ? "Available"
                                    : "Currently unavailable"
                            }
                        </div>

                    </div>


                    <div class="doctor-profile-identity">

                        <h3>
                            ${escapeHtml(doctor.name)}
                        </h3>

                        <p class="doctor-profile-specialization">
                            ${escapeHtml(doctor.specialization)}
                        </p>

                        <p class="doctor-profile-qualification">
                            ${escapeHtml(doctor.qualification)}
                        </p>

                    </div>


                    <div class="doctor-profile-details">

                        <div class="doctor-detail-row">
                            <span class="doctor-detail-icon">
                                <i class="bi bi-briefcase"></i>
                            </span>

                            <span>
                                ${doctor.experience} years experience
                            </span>
                        </div>


                        <div class="doctor-detail-row">
                            <span class="doctor-detail-icon">
                                <i class="bi bi-geo-alt"></i>
                            </span>

                            <span>
                                ${escapeHtml(doctor.centre)}
                            </span>
                        </div>


                        <div class="doctor-detail-row">
                            <span class="doctor-detail-icon">
                                <i class="bi bi-star-fill"></i>
                            </span>

                            <span>
                                ${doctor.rating} rating
                            </span>
                        </div>

                    </div>


                    <div class="doctor-profile-footer">

                        <div class="doctor-fee">
                            <span>Consultation</span>
                            <strong>₹${doctor.fee}</strong>
                        </div>

                        <div class="doctor-rating">
                            <i class="bi bi-star-fill"></i>
                            ${doctor.rating}
                        </div>

                    </div>


                    <a
                        href="doctor-details.html?id=${doctor.id}"
                        class="doctor-profile-button"
                    >
                        View profile
                        <i class="bi bi-arrow-right"></i>
                    </a>

                </article>
            `;

        }).join("");


        if (doctorResultCount) {
            doctorResultCount.textContent =
                `${doctors.length} doctor${doctors.length === 1 ? "" : "s"}`;
        }
    }


    function getFilteredDoctors() {

        let results;

        if (currentSearch) {
            results = doctorService.search(currentSearch);
        } else {
            results = doctorService.getAll();
        }

        if (currentSpecialization !== "all") {
            results = results.filter(
                doctor =>
                    doctor.specialization === currentSpecialization
            );
        }

        return results;
    }


    function updateDoctors() {
        renderDoctors(getFilteredDoctors());
    }


    function clearFilters() {

        currentSearch = "";
        currentSpecialization = "all";

        if (doctorSearch) {
            doctorSearch.value = "";
        }

        document
            .querySelectorAll(".specialization-chip")
            .forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.specialization === "all"
                );
            });

        updateDoctors();
    }


    if (doctorSearch) {

        doctorSearch.addEventListener("input", event => {

            currentSearch = event.target.value;

            updateDoctors();

        });

    }


    if (specializationFilters) {

        specializationFilters.addEventListener("click", event => {

            const button =
                event.target.closest(".specialization-chip");

            if (!button) return;

            currentSpecialization =
                button.dataset.specialization || "all";

            document
                .querySelectorAll(".specialization-chip")
                .forEach(chip => {
                    chip.classList.remove("active");
                });

            button.classList.add("active");

            updateDoctors();

        });

    }


    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    updateDoctors();

});