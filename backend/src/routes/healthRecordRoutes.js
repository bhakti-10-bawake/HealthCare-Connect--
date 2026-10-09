
const express = require("express");

const {
    getPatientHealthRecords
} = require("../controllers/healthRecordController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/my",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getPatientHealthRecords
);

module.exports = router;
