
const express = require("express");

const {
    getMyProfile,
    updateMyProfile
} = require("../controllers/profileController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("PATIENT"));

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

module.exports = router;
