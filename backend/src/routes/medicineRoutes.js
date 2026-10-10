
const express = require("express");

const {
    getMedicines,
    getMedicineById,
    searchMedicinePharmacies
} = require("../controllers/medicineController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Patient medicine discovery
router.get(
    "/",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getMedicines
);

// Search pharmacies that stock a medicine.
// IMPORTANT: Keep this route before "/:id".
router.get(
    "/pharmacy-search",
    authenticateToken,
    authorizeRoles("PATIENT"),
    searchMedicinePharmacies
);

// Get details of a specific medicine
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getMedicineById
);

module.exports = router;
