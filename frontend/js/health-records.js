document.addEventListener("DOMContentLoaded", () => {

    const recordList = document.getElementById("recordList");
    const recordCount = document.getElementById("recordCount");
    const latestRecordDate = document.getElementById("latestRecordDate");
    const filterContainer = document.getElementById("recordFilters");

    const records = [
        {
            id: 1,
            type: "Lab Report",
            title: "Complete Blood Count",
            doctor: "Dr. Ananya Sharma",
            centre: "Sahyadri Community Health Centre",
            date: "2026-09-28",
            description: "Routine blood test including hemoglobin, RBC, WBC and platelet count.",
            icon: "bi-droplet-half"
        },
        {
            id: 2,
            type: "Consultation",
            title: "General Health Consultation",
            doctor: "Dr. Ananya Sharma",
            centre: "Sahyadri Community Health Centre",
            date: "2026-09-21",
            description: "Routine consultation and general health assessment.",
            icon: "bi-heart-pulse"
        },
        {
            id: 3,
            type: "Prescription",
            title: "Seasonal Allergy Prescription",
            doctor: "Dr. Meera Joshi",
            centre: "Jeevan Jyoti Rural Hospital",
            date: "2026-09-15",
            description: "Prescription issued following consultation for seasonal allergy symptoms.",
            icon: "bi-prescription2"
        },
        {
            id: 4,
            type: "Lab Report",
            title: "Blood Sugar Test",
            doctor: "Dr. Kunal Desai",
            centre: "Jeevan Jyoti Rural Hospital",
            date: "2026-08-30",
            description: "Fasting blood glucose test recorded during routine health monitoring.",
            icon: "bi-activity"
        },
        {
            id: 5,
            type: "Consultation",
            title: "Follow-up Consultation",
            doctor: "Dr. Priya Deshmukh",
            centre: "Aarogya Women's Centre",
            date: "2026-08-18",
            description: "Follow-up consultation and review of previous health information.",
            icon: "bi-person-check"
        },
        {
            id: 6,
            type: "Prescription",
            title: "Vitamin Supplement Prescription",
            doctor: "Dr. Priya Deshmukh",
            centre: "Aarogya Women's Centre",
            date: "2026-08-18",
            description: "Vitamin and nutritional supplements recommended during consultation.",
            icon: "bi-capsule"
        },
        {
            id: 7,
            type: "Lab Report",
            title: "Lipid Profile",
            doctor: "Dr. Vikram Kulkarni",
            centre: "Sahyadri Community Health Centre",
            date: "2026-07-24",
            description: "Cholesterol and lipid profile assessment.",
            icon: "bi-bar-chart-line"
        },
        {
            id: 8,
            type: "Consultation",
            title: "Cardiology Consultation",
            doctor: "Dr. Vikram Kulkarni",
            centre: "Sahyadri Community Health Centre",
            date: "2026-07-24",
            description: "Cardiology consultation and cardiovascular health assessment.",
            icon: "bi-heart"
        }
    ];


    function formatDate(dateString) {
        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
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


    function getTypeClass(type) {
        switch (type) {
            case "Lab Report":
                return "record-type-lab";

            case "Prescription":
                return "record-type-prescription";

            case "Consultation":
                return "record-type-consultation";

            default:
                return "";
        }
    }


    function renderRecords(filteredRecords) {

        if (!filteredRecords.length) {

            recordList.innerHTML = `
                <div class="records-empty">

                    <div class="records-empty-icon">
                        <i class="bi bi-folder-x"></i>
                    </div>

                    <h3>No records found</h3>

                    <p>
                        There are no health records in this category yet.
                    </p>

                    <button class="records-empty-button" id="clearRecordFilter">
                        View all records
                    </button>

                </div>
            `;

            document
                .getElementById("clearRecordFilter")
                ?.addEventListener("click", () => {

                    document
                        .querySelectorAll(".record-filter")
                        .forEach(button => button.classList.remove("active"));

                    document
                        .querySelector('[data-filter="all"]')
                        ?.classList.add("active");

                    renderRecords(records);
                });

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

                            <h3>
                                ${escapeHtml(record.title)}
                            </h3>
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
                            data-record-id="${record.id}"
                        >
                            View details
                            <i class="bi bi-arrow-right"></i>
                        </button>

                    </div>

                </div>

            </article>

        `).join("");


        document
            .querySelectorAll(".record-view-button")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const record = records.find(
                        item => item.id === Number(button.dataset.recordId)
                    );

                    if (!record) return;

                    showRecordDetails(record);
                });

            });
    }


    function showRecordDetails(record) {

        const existingModal = document.querySelector(".record-modal");

        if (existingModal) {
            existingModal.remove();
        }


        const modal = document.createElement("div");

        modal.className = "record-modal";

        modal.innerHTML = `

            <div class="record-modal-backdrop"></div>

            <div class="record-modal-card">

                <button class="record-modal-close" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>

                <span class="record-type ${getTypeClass(record.type)}">
                    ${escapeHtml(record.type)}
                </span>

                <h2>
                    ${escapeHtml(record.title)}
                </h2>

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


                <div class="record-modal-secure">
                    <i class="bi bi-shield-check"></i>

                    <span>
                        This is a secure health record.
                    </span>
                </div>

            </div>
        `;


        document.body.appendChild(modal);


        const closeModal = () => {
            modal.remove();
        };


        modal
            .querySelector(".record-modal-close")
            ?.addEventListener("click", closeModal);

        modal
            .querySelector(".record-modal-backdrop")
            ?.addEventListener("click", closeModal);


        document.addEventListener("keydown", function escapeHandler(event) {

            if (event.key === "Escape") {

                closeModal();

                document.removeEventListener(
                    "keydown",
                    escapeHandler
                );
            }

        });

    }


    function updateSummary() {

        recordCount.textContent = records.length;

        if (records.length) {

            const latest = [...records]
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            latestRecordDate.textContent = formatDate(latest.date);

        } else {

            latestRecordDate.textContent = "—";

        }

    }


    filterContainer.addEventListener("click", event => {

        const button = event.target.closest(".record-filter");

        if (!button) return;


        document
            .querySelectorAll(".record-filter")
            .forEach(item => item.classList.remove("active"));

        button.classList.add("active");


        const filter = button.dataset.filter;

        if (filter === "all") {

            renderRecords(records);

        } else {

            renderRecords(
                records.filter(record => record.type === filter)
            );

        }

    });


    updateSummary();

    renderRecords(records);

});