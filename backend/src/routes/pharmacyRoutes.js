const express = require("express");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    getPharmacies,
    getPharmacyById
} = require("../controllers/pharmacyController");

const router = express.Router();

// Get pharmacies, optionally filtered by city
router.get(
    "/",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getPharmacies
);

// Get details of one pharmacy
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getPharmacyById
);

module.exports = router;