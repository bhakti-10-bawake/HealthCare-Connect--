
document.addEventListener("DOMContentLoaded", () => {
    const recordList = document.getElementById("recordList");
    const recordCount = document.getElementById("recordCount");
    const latestRecordDate = document.getElementById("latestRecordDate");
    const filterContainer = document.getElementById("recordFilters");

    let records = [];
    let currentFilter = "all";

   const API_URL = "https://healthcare-connect-api.onrender.com/api/health-records/my";

    const typeMap = {
        LAB_REPORT: "Lab Report",
        CONSULTATION: "Consultation",
        PRESCRIPTION: "Prescription",
        DIAGNOSTIC_REPORT: "Diagnostic Report",
        OTHER: "Other"
    };

    const iconMap = {
        "Lab Report": "bi-droplet-half",
        Consultation: "bi-heart-pulse",
        Prescription: "bi-prescription2",
        "Diagnostic Report": "bi-activity",
        Other: "bi-file-earmark-medical"
    };

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizeType(type) {
        const normalized = String(type || "OTHER").toUpperCase();

        return typeMap[normalized] ||
            normalized
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    function getTypeClass(type) {
        switch (type) {
            case "Lab Report":
            case "Diagnostic Report":
                return "record-type-lab";
            case "Prescription":
                return "record-type-prescription";
            case "Consultation":
                return "record-type-consultation";
            default:
                return "";
        }
    }

    function getRecordIcon(type) {
        return iconMap[type] || iconMap.Other;
    }

    function formatDate(dateValue) {
        if (!dateValue) return "Date unavailable";

        const dateString = String(dateValue).slice(0, 10);
        const date = new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function normalizeRecord(record) {
        return {
            id: record.id,
            type: normalizeType(record.type),
            title: record.title || "Health Record",
            doctor: record.doctorName || "Not specified",
            centre: record.healthcareCentre || "Not specified",
            date: record.date,
            description: record.description || "No description available.",
            filePath: record.filePath || null,
            icon: getRecordIcon(normalizeType(record.type))
        };
    }

    function getFilteredRecords() {
        if (currentFilter === "all") {
            return records;
        }

        return records.filter(record => record.type === currentFilter);
    }

    function renderEmptyState(title, message, showRetry = false) {
        recordList.innerHTML = `
            <div class="records-empty">
                <div class="records-empty-icon">
                    <i class="bi bi-folder-x"></i>
                </div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(message)}</p>
                ${showRetry ? `
                    <button
                        class="records-empty-button"
                        id="retryHealthRecords"
                        type="button"
                    >
                        Try again
                    </button>
                ` : currentFilter !== "all" ? `
                    <button
                        class="records-empty-button"
                        id="clearRecordFilter"
                        type="button"
                    >
                        View all records
                    </button>
                ` : ""}
            </div>
        `;

        document.getElementById("clearRecordFilter")
            ?.addEventListener("click", () => {
                currentFilter = "all";
                updateActiveFilter();
                renderRecords();
            });

        document.getElementById("retryHealthRecords")
            ?.addEventListener("click", loadHealthRecords);
    }

    function renderRecords() {
        if (!recordList) return;

        const filteredRecords = getFilteredRecords();

        if (!filteredRecords.length) {
            renderEmptyState(
                "No records found",
                currentFilter === "all"
                    ? "Your health records will appear here when available."
                    : "There are no health records in this category yet."
            );
            return;
        }

        recordList.innerHTML = filteredRecords.map(record => `
            <article class="record-card">
                <div class="record-card-icon ${getTypeClass(record.type)}">
                    <i class="bi ${escapeHtml(record.icon)}"></i>
                </div>

                <div class="record-card-content">
                    <div class="record-card-top">
                        <div>
                            <span class="record-type ${getTypeClass(record.type)}">
                                ${escapeHtml(record.type)}
                            </span>
                            <h3>${escapeHtml(record.title)}</h3>
                        </div>

                        <span class="record-date">
                            ${formatDate(record.date)}
                        </span>
                    </div>

                    <p class="record-description">
                        ${escapeHtml(record.description)}
                    </p>

                    <div class="record-meta">
                        <span>
                            <i class="bi bi-person"></i>
                            ${escapeHtml(record.doctor)}
                        </span>
                        <span>
                            <i class="bi bi-geo-alt"></i>
                            ${escapeHtml(record.centre)}
                        </span>
                    </div>

                    <div class="record-card-footer">
                        <span class="record-secure">
                            <i class="bi bi-shield-check"></i>
                            Secure record
                        </span>

                        <button
                            class="record-view-button"
                            type="button"
                            data-record-id="${escapeHtml(record.id)}"
                        >
                            View details
                            <i class="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </article>
        `).join("");

        recordList.querySelectorAll(".record-view-button")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const record = records.find(
                        item => String(item.id) === button.dataset.recordId
                    );

                    if (record) showRecordDetails(record);
                });
            });
    }

    function showRecordDetails(record) {
        document.querySelector(".record-modal")?.remove();

        const modal = document.createElement("div");
        modal.className = "record-modal";

        modal.innerHTML = `
            <div class="record-modal-backdrop"></div>

            <div class="record-modal-card" role="dialog"
                 aria-modal="true"
                 aria-label="Health record details">

                <button class="record-modal-close"
                        type="button"
                        aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>

                <span class="record-type ${getTypeClass(record.type)}">
                    ${escapeHtml(record.type)}
                </span>

                <h2>${escapeHtml(record.title)}</h2>

                <p class="record-modal-date">
                    ${formatDate(record.date)}
                </p>

                <div class="record-modal-divider"></div>

                <div class="record-modal-row">
                    <span>Doctor</span>
                    <strong>${escapeHtml(record.doctor)}</strong>
                </div>

                <div class="record-modal-row">
                    <span>Healthcare centre</span>
                    <strong>${escapeHtml(record.centre)}</strong>
                </div>

                <div class="record-modal-row">
                    <span>Record type</span>
                    <strong>${escapeHtml(record.type)}</strong>
                </div>

                <div class="record-modal-description">
                    <span>Description</span>
                    <p>${escapeHtml(record.description)}</p>
                </div>

                ${record.filePath ? `
                    <p class="record-file-note">
                        A file is associated with this record.
                        Secure file viewing is not yet configured.
                    </p>
                ` : ""}

                <div class="record-modal-secure">
                    <i class="bi bi-shield-check"></i>
                    <span>Keep your health information private.</span>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => {
            modal.remove();
            document.removeEventListener("keydown", escapeHandler);
        };

        const escapeHandler = event => {
            if (event.key === "Escape") closeModal();
        };

        modal.querySelector(".record-modal-close")
            ?.addEventListener("click", closeModal);

        modal.querySelector(".record-modal-backdrop")
            ?.addEventListener("click", closeModal);

        document.addEventListener("keydown", escapeHandler);

        modal.querySelector(".record-modal-close")?.focus();
    }

    function updateSummary() {
        if (recordCount) {
            recordCount.textContent = records.length;
        }

        if (!latestRecordDate) return;

        const sortedRecords = [...records].filter(record => record.date);

        sortedRecords.sort((a, b) =>
            new Date(String(b.date).slice(0, 10)) -
            new Date(String(a.date).slice(0, 10))
        );

        latestRecordDate.textContent = sortedRecords.length
            ? formatDate(sortedRecords[0].date)
            : "—";
    }

    function updateActiveFilter() {
        document.querySelectorAll(".record-filter").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.filter === currentFilter
            );
        });
    }

    async function loadHealthRecords() {
        if (!recordList) return;

        const token = localStorage.getItem("healthcareToken");

        if (!token) {
            renderEmptyState(
                "Login required",
                "Please log in to view your health records."
            );
            return;
        }

        recordList.innerHTML = `
            <div class="doctor-loading">
                <div class="loading-spinner"></div>
                <p>Loading your health records...</p>
            </div>
        `;

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            const result = await response.json();

            if (response.status === 401) {
                renderEmptyState(
                    "Session expired",
                    "Please log in again to view your health records."
                );
                return;
            }

            if (!response.ok || result.success !== true) {
                throw new Error(
                    result.message || "Unable to load health records."
                );
            }

            records = Array.isArray(result.data)
                ? result.data.map(normalizeRecord)
                : [];

            updateSummary();
            renderRecords();
        } catch (error) {
            console.error("Health records loading error:", error);

            renderEmptyState(
                "Unable to load records",
                "Please check your connection and try again.",
                true
            );
        }
    }

    filterContainer?.addEventListener("click", event => {
        const button = event.target.closest(".record-filter");

        if (!button) return;

        currentFilter = button.dataset.filter || "all";
        updateActiveFilter();
        renderRecords();
    });

    loadHealthRecords();
});
