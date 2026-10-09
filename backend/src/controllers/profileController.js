
const { pool } = require("../config/database");

async function getMyProfile(req, res) {
    try {
        const [rows] = await pool.execute(
            `SELECT id, full_name, email, phone, address, role
             FROM users
             WHERE id = ? AND is_active = TRUE
             LIMIT 1`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User profile not found."
            });
        }

        const user = rows[0];

        return res.json({
            success: true,
            data: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                phone: user.phone || "",
                address: user.address || "",
                role: user.role
            }
        });
    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load your profile."
        });
    }
}

async function updateMyProfile(req, res) {
    try {
        const { name, phone, address } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Full name is required."
            });
        }

        if (name.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "Full name must be 150 characters or fewer."
            });
        }

        if (phone !== undefined && typeof phone !== "string") {
            return res.status(400).json({
                success: false,
                message: "Phone number must be text."
            });
        }

        if (address !== undefined && typeof address !== "string") {
            return res.status(400).json({
                success: false,
                message: "Address must be text."
            });
        }

        if ((phone || "").trim().length > 20) {
            return res.status(400).json({
                success: false,
                message: "Phone number is too long."
            });
        }

        if ((address || "").trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "Address must be 500 characters or fewer."
            });
        }

        await pool.execute(
            `UPDATE users
             SET full_name = ?, phone = ?, address = ?
             WHERE id = ? AND is_active = TRUE`,
            [
                name.trim(),
                (phone || "").trim() || null,
                (address || "").trim() || null,
                req.user.id
            ]
        );

        const [rows] = await pool.execute(
            `SELECT id, full_name, email, phone, address, role
             FROM users
             WHERE id = ? AND is_active = TRUE
             LIMIT 1`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User profile not found."
            });
        }

        const user = rows[0];

        return res.json({
            success: true,
            message: "Profile updated successfully.",
            data: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                phone: user.phone || "",
                address: user.address || "",
                role: user.role
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update your profile."
        });
    }
}

module.exports = {
    getMyProfile,
    updateMyProfile
};
