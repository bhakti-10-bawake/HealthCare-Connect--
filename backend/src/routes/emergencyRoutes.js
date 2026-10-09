
const express = require("express");
const {
    getEmergencyContacts
} = require("../controllers/emergencyController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getEmergencyContacts
);

module.exports = router;
