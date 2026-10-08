document.addEventListener("DOMContentLoaded", async () => {

    // ============================================================
    // ELEMENTS
    // ============================================================

    const medicineSearch =
        document.getElementById("medicineSearch");

    const categoryFilters =
        document.getElementById("medicineCategories");

    const medicineList =
        document.getElementById("medicineList");

    const medicineResultCount =
        document.getElementById("medicineResultCount");


    // ============================================================
    // STATE
    // ============================================================

    let currentCategory = "all";

    let searchTimeout = null;


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    await loadMedicines();


    // ============================================================
    // SEARCH
    // ============================================================

    if (medicineSearch) {

        medicineSearch.addEventListener(
            "input",
            () => {

                clearTimeout(
                    searchTimeout
                );

                searchTimeout =
                    setTimeout(
                        () => {
                            loadMedicines();
                        },
                        250
                    );
            }
        );
    }


    // ============================================================
    // CATEGORY FILTERS
    // ============================================================

    if (categoryFilters) {

        categoryFilters.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        "[data-category]"
                    );

                if (!button) {
                    return;
                }


                currentCategory =
                    button.dataset.category ||
                    "all";


                categoryFilters
                    .querySelectorAll(
                        "[data-category]"
                    )
                    .forEach(
                        (item) => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                button.classList.add(
                    "active"
                );


                loadMedicines();
            }
        );
    }


    // ============================================================
    // LOAD MEDICINES
    // ============================================================

    async function loadMedicines() {

        showLoading();


        try {

            if (
                typeof isLoggedIn ===
                "function" &&
                !isLoggedIn()
            ) {

                window.location.href =
                    "login.html";

                return;
            }


            const query =
                medicineSearch
                    ? medicineSearch.value.trim()
                    : "";


            const url =
                new URL(
                    "http://localhost:5000/api/medicines"
                );


            if (query) {

                url.searchParams.set(
                    "search",
                    query
                );
            }


            if (
                currentCategory &&
                currentCategory.toLowerCase() !==
                    "all"
            ) {

                url.searchParams.set(
                    "category",
                    currentCategory
                );
            }


            const token =
                localStorage.getItem(
                    "healthcareToken"
                );


            const response =
                await fetch(
                    url,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );


            const result =
                await response.json();


            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    "healthcareToken"
                );

                localStorage.removeItem(
                    "healthcareUser"
                );

                window.location.href =
                    "login.html";

                return;
            }


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Unable to load medicines."
                );
            }


            const medicines =
                Array.isArray(result.data)
                    ? result.data
                    : [];


            renderMedicines(
                medicines
            );


        } catch (error) {

            console.error(
                "Medicine loading error:",
                error
            );


            showError(
                error.message ||
                "Unable to load medicines."
            );
        }
    }


    // ============================================================
    // RENDER MEDICINES
    // ============================================================

    function renderMedicines(
        medicines
    ) {

        if (!medicineList) {
            return;
        }


        updateResultCount(
            medicines.length
        );


        if (
            medicines.length === 0
        ) {

            renderEmptyState();

            return;
        }


        medicineList.innerHTML =
            medicines
                .map(
                    createMedicineCard
                )
                .join("");
    }


    // ============================================================
    // MEDICINE CARD
    // ============================================================

    function createMedicineCard(
        medicine
    ) {

        const availabilityClass =
            medicine.available
                ? "available"
                : "unavailable";


        const availabilityText =
            medicine.available
                ? "Available"
                : "Currently unavailable";


        const prescriptionBadge =
            medicine.prescription
                ? `
                    <span class="medicine-prescription">
                        <i class="bi bi-file-medical"></i>
                        Prescription required
                    </span>
                `
                : `
                    <span class="medicine-otc">
                        <i class="bi bi-check-circle"></i>
                        General medicine
                    </span>
                `;


        const price =
            medicine.price !== null &&
            medicine.price !== undefined
                ? `₹${Number(
                    medicine.price
                ).toFixed(2)}`
                : "Price unavailable";


        const pack =
            medicine.pack ||
            "Pack information unavailable";


        return `
            <article
                class="medicine-card"
                data-medicine-id="${escapeHtml(
                    medicine.id
                )}"
            >

                <div class="medicine-card-top">

                    <div class="medicine-icon">
                        <i class="bi bi-capsule"></i>
                    </div>


                    <span
                        class="medicine-availability ${availabilityClass}"
                    >
                        <span class="medicine-status-dot"></span>
                        ${escapeHtml(
                            availabilityText
                        )}
                    </span>

                </div>


                <div class="medicine-card-content">

                    <div class="medicine-category">
                        ${escapeHtml(
                            medicine.category ||
                            "Medicine"
                        )}
                    </div>


                    <h3 class="medicine-name">
                        ${escapeHtml(
                            medicine.name ||
                            "Medicine"
                        )}
                    </h3>


                    <p class="medicine-generic">
                        ${escapeHtml(
                            medicine.generic ||
                            "Generic information unavailable"
                        )}
                    </p>


                    <div class="medicine-strength">

                        <span>
                            ${escapeHtml(
                                medicine.form ||
                                "Form unavailable"
                            )}
                        </span>

                        <span>
                            ${escapeHtml(
                                medicine.strength ||
                                "Strength unavailable"
                            )}
                        </span>

                    </div>


                    <div class="medicine-badge-row">
                        ${prescriptionBadge}
                    </div>

                </div>


                <div class="medicine-card-footer">

                    <div class="medicine-price">

                        <span>
                            Starting from
                        </span>

                        <strong>
                            ${escapeHtml(price)}
                        </strong>

                    </div>


                    <div class="medicine-pack">
                        ${escapeHtml(pack)}
                    </div>

                </div>

            </article>
        `;
    }


    // ============================================================
    // RESULT COUNT
    // ============================================================

    function updateResultCount(
        count
    ) {

        if (!medicineResultCount) {
            return;
        }


        medicineResultCount.textContent =
            `${count} ${
                count === 1
                    ? "medicine"
                    : "medicines"
            }`;
    }


    // ============================================================
    // LOADING
    // ============================================================

    function showLoading() {

        if (!medicineList) {
            return;
        }


        medicineList.innerHTML = `
            <div class="medicine-loading">

                <div class="medicine-loading-spinner"></div>

                <p>
                    Loading medicines...
                </p>

            </div>
        `;


        if (medicineResultCount) {

            medicineResultCount.textContent =
                "Loading...";
        }
    }


    // ============================================================
    // EMPTY STATE
    // ============================================================

    function renderEmptyState() {

        medicineList.innerHTML = `
            <div class="medicine-empty">

                <div class="medicine-empty-icon">
                    <i class="bi bi-capsule"></i>
                </div>

                <h3>
                    No medicines found
                </h3>

                <p>
                    Try a different medicine name
                    or category.
                </p>

            </div>
        `;
    }


    // ============================================================
    // ERROR
    // ============================================================

    function showError(
        message
    ) {

        if (!medicineList) {
            return;
        }


        medicineList.innerHTML = `
            <div class="medicine-empty medicine-error">

                <div class="medicine-empty-icon">
                    <i class="bi bi-exclamation-circle"></i>
                </div>

                <h3>
                    Unable to load medicines
                </h3>

                <p>
                    ${escapeHtml(message)}
                </p>

                <button
                    type="button"
                    class="medicine-retry-button"
                    id="retryMedicinesButton"
                >
                    Try again
                </button>

            </div>
        `;


        if (medicineResultCount) {

            medicineResultCount.textContent =
                "0 medicines";
        }


        const retryButton =
            document.getElementById(
                "retryMedicinesButton"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadMedicines
            );
        }
    }


    // ============================================================
    // SAFE HTML
    // ============================================================

    function escapeHtml(
        value
    ) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }

});