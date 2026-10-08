const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public API test
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Connect API routes are working"
    });
});

// Protected current-user endpoint
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const pool = require("../config/database");

        const [users] = await pool.execute(
            `
            SELECT
                id,
                full_name,
                email,
                phone,
                role,
                address,
                profile_image,
                is_active,
                created_at
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error("Get current user error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching user."
        });
    }
});

module.exports = router;