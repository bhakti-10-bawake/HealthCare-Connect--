
const express = require("express");

const {
    getPatientReminders,
    createReminder,
    updateReminder,
    deleteReminder
} = require("../controllers/reminderController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("PATIENT"));

router.get("/my", getPatientReminders);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

module.exports = router;
