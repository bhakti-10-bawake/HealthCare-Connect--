const express = require("express");

const {
    getDoctors,
    getDoctorById
} = require("../controllers/doctorController");

const router = express.Router();

// Get all doctors
router.get("/", getDoctors);

// Get doctor by ID
router.get("/:id", getDoctorById);

module.exports = router;