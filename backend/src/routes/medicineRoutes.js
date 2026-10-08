const express = require("express");

const {
    getMedicines,
    getMedicineById
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


router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getMedicineById
);


module.exports = router;