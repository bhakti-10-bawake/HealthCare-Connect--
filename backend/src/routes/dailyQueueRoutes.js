
const express = require("express");
const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    bookDailyToken,
    getMyDailyTokens,
    getDailyQueue,
    issueWalkInToken,
    updateTokenStatus
} = require("../controllers/dailyQueueController");

// Patient: book a remote token
router.post(
    "/book",
    authenticateToken,
    authorizeRoles("PATIENT"),
    bookDailyToken
);

// Patient: view their own tokens
router.get(
    "/my-tokens",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getMyDailyTokens
);

// Authenticated users: view a centre's daily queue
router.get(
    "/centre/:centreId",
    authenticateToken,
    getDailyQueue
);

// Authorized staff: issue walk-in tokens
router.post(
    "/walk-in",
    authenticateToken,
    authorizeRoles("ADMIN", "DOCTOR"),
    issueWalkInToken
);

// Authorized staff: update token status
router.patch(
    "/:tokenId/status",
    authenticateToken,
    authorizeRoles("ADMIN", "DOCTOR"),
    updateTokenStatus
);

module.exports = router;
