
document.addEventListener("DOMContentLoaded", async () => {
    // ============================================================
    // ELEMENTS
    // ============================================================

    const medicineSearch = document.getElementById("medicineSearch");
    const categoryFilters = document.getElementById("medicineCategories");
    const medicineList = document.getElementById("medicineList");
    const medicineResultCount = document.getElementById("medicineResultCount");

    // ============================================================
    // CONFIGURATION & STATE
    // ============================================================

    const API_URL = "http://localhost:5000/api/medicines/pharmacy-search";

    let currentCategory = "all";
    let searchTimeout = null;
    let requestController = null;

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    if (
        typeof isLoggedIn === "function" &&
        !isLoggedIn()
    ) {
        window.location.href = "login.html";
        return;
    }

    await loadMedicines();

    // ============================================================
    // SEARCH
    // ============================================================

    if (medicineSearch) {
        medicineSearch.addEventListener("input", () => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                loadMedicines();
            }, 300);
        });
    }

    // ============================================================
    // CATEGORY FILTERS
    // ============================================================

    if (categoryFilters) {
        categoryFilters.addEventListener("click", (event) => {
            const button = event.target.closest("[data-category]");

            if (!button) return;

            currentCategory = button.dataset.category || "all";

            categoryFilters
                .querySelectorAll("[data-category]")
                .forEach((item) => item.classList.remove("active"));

            button.classList.add("active");

            loadMedicines();
        });
    }

    // ============================================================
    // LOAD PHARMACY INVENTORY
    // ============================================================

    async function loadMedicines() {
        if (!medicineList) return;

        if (requestController) {
            requestController.abort();
        }

        requestController = new AbortController();

        showLoading();

        try {
            const token = localStorage.getItem("healthcareToken");

            if (!token) {
                window.location.href = "login.html";
                return;
            }

            const url = new URL(API_URL);
            const search = medicineSearch
                ? medicineSearch.value.trim()
                : "";

            if (search) {
                url.searchParams.set("search", search);
            }

            if (
                currentCategory &&
                currentCategory.toLowerCase() !== "all"
            ) {
                url.searchParams.set("category", currentCategory);
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                signal: requestController.signal
            });

            if (response.status === 401) {
                localStorage.removeItem("healthcareToken");
                localStorage.removeItem("healthcareUser");
                window.location.href = "login.html";
                return;
            }

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to load pharmacy inventory."
                );
            }

            const inventory = Array.isArray(result.data)
                ? result.data
                : [];

            renderMedicines(inventory);
        } catch (error) {
            if (error.name === "AbortError") return;

            console.error("Pharmacy inventory error:", error);
            showError(error.message || "Unable to load pharmacy inventory.");
        }
    }

    // ============================================================
    // RENDER RESULTS
    // Each result represents one medicine at one pharmacy.
    // ============================================================

    function renderMedicines(inventory) {
        if (!medicineList) return;

        updateResultCount(inventory.length);

        if (inventory.length === 0) {
            renderEmptyState();
            return;
        }

        medicineList.innerHTML = inventory
            .map(createMedicineCard)
            .join("");
    }

    // ============================================================
    // PHARMACY RESULT CARD
    // ============================================================

    function createMedicineCard(item) {
        const name = item.name || "Medicine";
        const pharmacyName = item.pharmacyName || "Pharmacy";
        const available = item.available === true;
        const quantity = Number(item.quantity);
        const hasStock = available && Number.isFinite(quantity) && quantity > 0;

        const availabilityClass = hasStock ? "available" : "unavailable";
        const availabilityText = hasStock
            ? "Reported in stock"
            : "Confirm availability";

        const price = Number(item.price);
        const priceText = Number.isFinite(price)
            ? `₹${price.toFixed(2)}`
            : "Price unavailable";

        const quantityText = Number.isFinite(quantity)
            ? `${quantity} units reported`
            : "Stock quantity unavailable";

        const packText = item.packSize
            ? `Pack: ${item.packSize}`
            : "Pack size unavailable";

        const locationParts = [
            item.address,
            item.city,
            item.state
        ].filter(Boolean);

        const location = locationParts.length
            ? locationParts.join(", ")
            : "Location unavailable";

        // Only create a telephone link when a phone number exists.
        const phone = String(item.phone || "").trim();
        const safePhone = phone.replace(/[^\d+().\-\s]/g, "");
        const canCall = /[0-9]{6,}/.test(safePhone);

        const phoneMarkup = canCall
            ? `
                <a
                    href="tel:${escapeHtml(safePhone)}"
                    class="small-primary-button"
                    style="margin-top:14px;display:inline-flex;"
                >
                    <i class="bi bi-telephone"></i>
                    Call pharmacy to confirm
                </a>
            `
            : `
                <p style="margin-top:14px;font-size:12px;color:#788C8B;">
                    Phone number unavailable
                </p>
            `;

        const prescriptionBadge = item.prescriptionRequired
            ? `
                <span class="medicine-prescription">
                    <i class="bi bi-file-medical"></i>
                    Prescription required
                </span>
            `
            : `
                <span class="medicine-otc">
                    <i class="bi bi-check-circle"></i>
                    Check with pharmacist
                </span>
            `;

        const updatedAt = item.updatedAt
            ? formatDate(item.updatedAt)
            : "";

        return `
            <article
                class="medicine-card"
                data-medicine-id="${escapeHtml(item.medicineId)}"
                data-pharmacy-id="${escapeHtml(item.pharmacyId)}"
            >
                <div class="medicine-card-top">
                    <div class="medicine-icon">
                        <i class="bi bi-capsule"></i>
                    </div>

                    <span class="medicine-availability ${availabilityClass}">
                        <span class="medicine-status-dot"></span>
                        ${escapeHtml(availabilityText)}
                    </span>
                </div>

                <div class="medicine-card-content">
                    <div class="medicine-category">
                        ${escapeHtml(item.category || "Medicine")}
                    </div>

                    <h3 class="medicine-name">
                        ${escapeHtml(name)}
                    </h3>

                    <p class="medicine-generic">
                        ${escapeHtml(item.generic || "Generic information unavailable")}
                    </p>

                    <div class="medicine-strength">
                        <span>${escapeHtml(item.form || "Form unavailable")}</span>
                        <span>${escapeHtml(item.strength || "Strength unavailable")}</span>
                    </div>

                    <div class="medicine-badge-row">
                        ${prescriptionBadge}
                    </div>

                    <div
                        class="medicine-pharmacy-details"
                        style="margin-top:18px;padding-top:15px;border-top:1px solid #E7EFEE;"
                    >
                        <div style="display:flex;gap:10px;align-items:flex-start;">
                            <i
                                class="bi bi-shop"
                                style="color:#159E91;font-size:19px;"
                            ></i>

                            <div style="min-width:0;">
                                <h4 style="margin:0;font-size:14px;font-weight:700;">
                                    ${escapeHtml(pharmacyName)}
                                </h4>

                                <p style="margin:5px 0 0;font-size:12px;line-height:1.6;color:#788C8B;">
                                    <i class="bi bi-geo-alt"></i>
                                    ${escapeHtml(location)}
                                </p>
                            </div>
                        </div>

                        <div style="margin-top:13px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
                            <div>
                                <span style="display:block;font-size:11px;color:#788C8B;">
                                    Price per pack
                                </span>
                                <strong style="font-size:18px;color:#173B3A;">
                                    ${escapeHtml(priceText)}
                                </strong>
                            </div>

                            <div style="text-align:right;">
                                <span style="display:block;font-size:11px;color:#788C8B;">
                                    Reported stock
                                </span>
                                <strong style="font-size:13px;color:#173B3A;">
                                    ${escapeHtml(quantityText)}
                                </strong>
                            </div>
                        </div>

                        <p style="margin:8px 0 0;font-size:11px;color:#788C8B;">
                            ${escapeHtml(packText)}
                        </p>

                        ${updatedAt ? `
                            <p style="margin:6px 0 0;font-size:10px;color:#91A3A1;">
                                Last inventory update: ${escapeHtml(updatedAt)}
                            </p>
                        ` : ""}

                        ${phoneMarkup}

                        <p style="margin:10px 0 0;font-size:11px;line-height:1.6;color:#788C8B;">
                            Stock may change. Call the pharmacy to confirm before travelling.
                        </p>
                    </div>
                </div>
            </article>
        `;
    }

    // ============================================================
    // RESULT COUNT
    // ============================================================

    function updateResultCount(count) {
        if (!medicineResultCount) return;

        medicineResultCount.textContent =
            `${count} ${count === 1 ? "pharmacy listing" : "pharmacy listings"}`;
    }

    // ============================================================
    // LOADING
    // ============================================================

    function showLoading() {
        if (!medicineList) return;

        medicineList.innerHTML = `
            <div class="medicine-loading">
                <div class="medicine-loading-spinner"></div>
                <p>Searching pharmacy inventory...</p>
            </div>
        `;

        if (medicineResultCount) {
            medicineResultCount.textContent = "Loading...";
        }
    }

    // ============================================================
    // EMPTY STATE
    // ============================================================

    function renderEmptyState() {
        medicineList.innerHTML = `
            <div class="medicine-empty">
                <div class="medicine-empty-icon">
                    <i class="bi bi-shop"></i>
                </div>

                <h3>No matching pharmacy listings</h3>

                <p>
                    We couldn't find a matching medicine in the recorded
                    pharmacy inventory. Try another name or category,
                    or contact a local pharmacist for help.
                </p>
            </div>
        `;
    }

    // ============================================================
    // ERROR
    // ============================================================

    function showError(message) {
        if (!medicineList) return;

        medicineList.innerHTML = `
            <div class="medicine-empty medicine-error">
                <div class="medicine-empty-icon">
                    <i class="bi bi-exclamation-circle"></i>
                </div>

                <h3>Unable to load pharmacy inventory</h3>

                <p>${escapeHtml(message)}</p>

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
            medicineResultCount.textContent = "0 pharmacy listings";
        }

        const retryButton = document.getElementById("retryMedicinesButton");

        if (retryButton) {
            retryButton.addEventListener("click", loadMedicines);
        }
    }

    // ============================================================
    // DATE FORMATTING
    // ============================================================

    function formatDate(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
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
