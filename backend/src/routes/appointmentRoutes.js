const express = require("express");

const {
    createAppointment,
    getPatientAppointments
} = require("../controllers/appointmentController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// Patient appointment routes

router.post(
    "/",
    authenticateToken,
    authorizeRoles("PATIENT"),
    createAppointment
);


router.get(
    "/my",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getPatientAppointments
);


module.exports = router;