document.addEventListener("DOMContentLoaded", () => {

    const medicineSearch =
        document.getElementById("medicineSearch");

    const medicineList =
        document.getElementById("medicineList");

    const medicineResultCount =
        document.getElementById("medicineResultCount");

    const medicineCategories =
        document.getElementById("medicineCategories");


    let selectedCategory = "all";


    /*
     * =========================================================
     * SYNTHETIC MEDICINE DATA
     * =========================================================
     */

    const medicines = [

        {
            id: 1,
            name: "Paracetamol 500 mg",
            generic: "Paracetamol",
            category: "Pain Relief",
            form: "Tablet",
            strength: "500 mg",
            price: 24,
            pack: "10 tablets",
            prescription: false,
            available: true
        },

        {
            id: 2,
            name: "Paracetamol 650 mg",
            generic: "Paracetamol",
            category: "Pain Relief",
            form: "Tablet",
            strength: "650 mg",
            price: 32,
            pack: "10 tablets",
            prescription: false,
            available: true
        },

        {
            id: 3,
            name: "Ibuprofen 400 mg",
            generic: "Ibuprofen",
            category: "Pain Relief",
            form: "Tablet",
            strength: "400 mg",
            price: 46,
            pack: "10 tablets",
            prescription: true,
            available: true
        },

        {
            id: 4,
            name: "Diclofenac Gel",
            generic: "Diclofenac",
            category: "Pain Relief",
            form: "Topical Gel",
            strength: "1%",
            price: 88,
            pack: "30 g",
            prescription: false,
            available: true
        },

        {
            id: 5,
            name: "Cetirizine 10 mg",
            generic: "Cetirizine",
            category: "Cold & Allergy",
            form: "Tablet",
            strength: "10 mg",
            price: 28,
            pack: "10 tablets",
            prescription: false,
            available: true
        },

        {
            id: 6,
            name: "Levocetirizine 5 mg",
            generic: "Levocetirizine",
            category: "Cold & Allergy",
            form: "Tablet",
            strength: "5 mg",
            price: 35,
            pack: "10 tablets",
            prescription: false,
            available: true
        },

        {
            id: 7,
            name: "Montelukast 10 mg",
            generic: "Montelukast",
            category: "Cold & Allergy",
            form: "Tablet",
            strength: "10 mg",
            price: 96,
            pack: "10 tablets",
            prescription: true,
            available: true
        },

        {
            id: 8,
            name: "Saline Nasal Spray",
            generic: "Sodium Chloride",
            category: "Cold & Allergy",
            form: "Nasal Spray",
            strength: "0.65%",
            price: 105,
            pack: "20 ml",
            prescription: false,
            available: true
        },

        {
            id: 9,
            name: "Antacid Suspension",
            generic: "Aluminium Hydroxide + Magnesium Hydroxide",
            category: "Digestive Health",
            form: "Suspension",
            strength: "Standard",
            price: 72,
            pack: "170 ml",
            prescription: false,
            available: true
        },

        {
            id: 10,
            name: "Omeprazole 20 mg",
            generic: "Omeprazole",
            category: "Digestive Health",
            form: "Capsule",
            strength: "20 mg",
            price: 54,
            pack: "10 capsules",
            prescription: true,
            available: true
        },

        {
            id: 11,
            name: "Pantoprazole 40 mg",
            generic: "Pantoprazole",
            category: "Digestive Health",
            form: "Tablet",
            strength: "40 mg",
            price: 68,
            pack: "10 tablets",
            prescription: true,
            available: true
        },

        {
            id: 12,
            name: "ORS Electrolyte Powder",
            generic: "Oral Rehydration Salts",
            category: "Digestive Health",
            form: "Powder",
            strength: "Standard",
            price: 22,
            pack: "5 sachets",
            prescription: false,
            available: true
        },

        {
            id: 13,
            name: "Vitamin C 500 mg",
            generic: "Ascorbic Acid",
            category: "Vitamins",
            form: "Tablet",
            strength: "500 mg",
            price: 75,
            pack: "20 tablets",
            prescription: false,
            available: true
        },

        {
            id: 14,
            name: "Vitamin D3 1000 IU",
            generic: "Cholecalciferol",
            category: "Vitamins",
            form: "Tablet",
            strength: "1000 IU",
            price: 110,
            pack: "30 tablets",
            prescription: false,
            available: true
        },

        {
            id: 15,
            name: "Calcium + Vitamin D3",
            generic: "Calcium Carbonate + Vitamin D3",
            category: "Vitamins",
            form: "Tablet",
            strength: "500 mg + 400 IU",
            price: 125,
            pack: "30 tablets",
            prescription: false,
            available: true
        },

        {
            id: 16,
            name: "Multivitamin Daily",
            generic: "Multivitamin & Minerals",
            category: "Vitamins",
            form: "Tablet",
            strength: "Standard",
            price: 145,
            pack: "30 tablets",
            prescription: false,
            available: true
        },

        {
            id: 17,
            name: "Metformin 500 mg",
            generic: "Metformin",
            category: "Chronic Care",
            form: "Tablet",
            strength: "500 mg",
            price: 38,
            pack: "20 tablets",
            prescription: true,
            available: true
        },

        {
            id: 18,
            name: "Metformin 1000 mg",
            generic: "Metformin",
            category: "Chronic Care",
            form: "Tablet",
            strength: "1000 mg",
            price: 62,
            pack: "20 tablets",
            prescription: true,
            available: true
        },

        {
            id: 19,
            name: "Amlodipine 5 mg",
            generic: "Amlodipine",
            category: "Chronic Care",
            form: "Tablet",
            strength: "5 mg",
            price: 42,
            pack: "20 tablets",
            prescription: true,
            available: true
        },

        {
            id: 20,
            name: "Losartan 50 mg",
            generic: "Losartan",
            category: "Chronic Care",
            form: "Tablet",
            strength: "50 mg",
            price: 58,
            pack: "10 tablets",
            prescription: true,
            available: true
        },

        {
            id: 21,
            name: "Atorvastatin 10 mg",
            generic: "Atorvastatin",
            category: "Chronic Care",
            form: "Tablet",
            strength: "10 mg",
            price: 72,
            pack: "10 tablets",
            prescription: true,
            available: true
        },

        {
            id: 22,
            name: "Azithromycin 500 mg",
            generic: "Azithromycin",
            category: "Cold & Allergy",
            form: "Tablet",
            strength: "500 mg",
            price: 84,
            pack: "3 tablets",
            prescription: true,
            available: true
        },

        {
            id: 23,
            name: "Amoxicillin 500 mg",
            generic: "Amoxicillin",
            category: "Cold & Allergy",
            form: "Capsule",
            strength: "500 mg",
            price: 76,
            pack: "10 capsules",
            prescription: true,
            available: true
        },

        {
            id: 24,
            name: "Cough Relief Syrup",
            generic: "Cough Preparation",
            category: "Cold & Allergy",
            form: "Syrup",
            strength: "Standard",
            price: 92,
            pack: "100 ml",
            prescription: false,
            available: true
        },

        {
            id: 25,
            name: "Antiseptic Solution",
            generic: "Povidone Iodine",
            category: "Pain Relief",
            form: "Solution",
            strength: "5%",
            price: 68,
            pack: "100 ml",
            prescription: false,
            available: true
        },

        {
            id: 26,
            name: "Iron + Folic Acid",
            generic: "Iron + Folic Acid",
            category: "Vitamins",
            form: "Tablet",
            strength: "Standard",
            price: 58,
            pack: "30 tablets",
            prescription: false,
            available: true
        },

        {
            id: 27,
            name: "Zinc 20 mg",
            generic: "Zinc Sulphate",
            category: "Vitamins",
            form: "Tablet",
            strength: "20 mg",
            price: 48,
            pack: "20 tablets",
            prescription: false,
            available: true
        },

        {
            id: 28,
            name: "Glimepiride 2 mg",
            generic: "Glimepiride",
            category: "Chronic Care",
            form: "Tablet",
            strength: "2 mg",
            price: 64,
            pack: "10 tablets",
            prescription: true,
            available: true
        },

        {
            id: 29,
            name: "Telmisartan 40 mg",
            generic: "Telmisartan",
            category: "Chronic Care",
            form: "Tablet",
            strength: "40 mg",
            price: 78,
            pack: "10 tablets",
            prescription: true,
            available: true
        },

        {
            id: 30,
            name: "Probiotic Capsules",
            generic: "Probiotic Blend",
            category: "Digestive Health",
            form: "Capsule",
            strength: "Standard",
            price: 135,
            pack: "10 capsules",
            prescription: false,
            available: true
        }

    ];


    // =========================================================
    // FILTER
    // =========================================================

    function getFilteredMedicines() {

        const searchValue =
            medicineSearch
                ? medicineSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        return medicines.filter(
            medicine => {

                const matchesCategory =
                    selectedCategory === "all" ||
                    medicine.category ===
                    selectedCategory;


                const matchesSearch =
                    !searchValue ||
                    medicine.name
                        .toLowerCase()
                        .includes(searchValue) ||

                    medicine.generic
                        .toLowerCase()
                        .includes(searchValue) ||

                    medicine.category
                        .toLowerCase()
                        .includes(searchValue) ||

                    medicine.form
                        .toLowerCase()
                        .includes(searchValue);


                return (
                    matchesCategory &&
                    matchesSearch
                );

            }
        );

    }


    // =========================================================
    // RENDER
    // =========================================================

    function renderMedicines() {

        const filtered =
            getFilteredMedicines();


        medicineResultCount.textContent =
            filtered.length;


        if (filtered.length === 0) {

            renderEmptyState();

            return;
        }


        medicineList.innerHTML =
            filtered
                .map(createMedicineCard)
                .join("");

    }


    // =========================================================
    // CARD
    // =========================================================

    function createMedicineCard(medicine) {

        return `
            <article class="medicine-card">

                <div class="medicine-card-top">

                    <div class="medicine-icon">
                        <i class="bi bi-capsule"></i>
                    </div>

                    <span class="
                        medicine-availability
                        ${medicine.available
                            ? "available"
                            : "unavailable"}
                    ">
                        <span></span>

                        ${medicine.available
                            ? "Available"
                            : "Unavailable"}
                    </span>

                </div>


                <div class="medicine-card-title">

                    <span>
                        ${escapeHtml(
                            medicine.category
                        )}
                    </span>

                    <h3>
                        ${escapeHtml(
                            medicine.name
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            medicine.generic
                        )}
                    </p>

                </div>


                <div class="medicine-details">

                    <div>
                        <span>
                            Form
                        </span>

                        <strong>
                            ${escapeHtml(
                                medicine.form
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Strength
                        </span>

                        <strong>
                            ${escapeHtml(
                                medicine.strength
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Pack
                        </span>

                        <strong>
                            ${escapeHtml(
                                medicine.pack
                            )}
                        </strong>
                    </div>

                </div>


                <div class="medicine-card-footer">

                    <div class="medicine-price">

                        <span>
                            Approx. price
                        </span>

                        <strong>
                            ₹${medicine.price}
                        </strong>

                    </div>


                    ${
                        medicine.prescription
                            ? `
                                <span class="medicine-prescription">
                                    <i class="bi bi-file-medical"></i>
                                    Prescription
                                </span>
                            `
                            : `
                                <span class="medicine-otc">
                                    General use
                                </span>
                            `
                    }

                </div>

            </article>
        `;

    }


    // =========================================================
    // EMPTY
    // =========================================================

    function renderEmptyState() {

        medicineList.innerHTML = `
            <div class="medicine-empty">

                <div class="medicine-empty-icon">
                    <i class="bi bi-search"></i>
                </div>

                <h3>
                    No medicines found
                </h3>

                <p>
                    Try searching for another medicine
                    or choose a different category.
                </p>

                <button
                    type="button"
                    id="clearMedicineSearch"
                >
                    Clear search
                </button>

            </div>
        `;


        const clearButton =
            document.getElementById(
                "clearMedicineSearch"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                () => {

                    medicineSearch.value = "";

                    selectedCategory = "all";

                    document
                        .querySelectorAll(
                            ".medicine-category"
                        )
                        .forEach(
                            button =>
                                button.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    document
                        .querySelector(
                            '[data-category="all"]'
                        )
                        .classList
                        .add("active");


                    renderMedicines();

                }
            );

        }

    }


    // =========================================================
    // SEARCH
    // =========================================================

    if (medicineSearch) {

        medicineSearch.addEventListener(
            "input",
            renderMedicines
        );

    }


    // =========================================================
    // CATEGORY FILTERS
    // =========================================================

    if (medicineCategories) {

        const buttons =
            medicineCategories
                .querySelectorAll(
                    "[data-category]"
                );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        item =>
                            item.classList
                                .remove(
                                    "active"
                                )
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedCategory =
                        button.dataset.category;


                    renderMedicines();

                }
            );

        });

    }


    // =========================================================
    // HTML SAFETY
    // =========================================================

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =========================================================
    // INITIAL
    // =========================================================

    renderMedicines();

});