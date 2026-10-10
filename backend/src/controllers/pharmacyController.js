const { pool } = require("../config/database");

// Get active pharmacies, optionally filtered by city or search term
const getPharmacies = async (req, res, next) => {
    try {
        const { city, search } = req.query;

        let sql = `
            SELECT
                id,
                name,
                address,
                city,
                state,
                phone
            FROM pharmacies
            WHERE is_active = 1
        `;

        const params = [];

        if (city && city.trim()) {
            sql += " AND city LIKE ?";
            params.push(`%${city.trim()}%`);
        }

        if (search && search.trim()) {
            sql += `
                AND (
                    name LIKE ?
                    OR address LIKE ?
                    OR city LIKE ?
                )
            `;

            const term = `%${search.trim()}%`;
            params.push(term, term, term);
        }

        sql += " ORDER BY city ASC, name ASC";

        const [rows] = await pool.execute(sql, params);

        return res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// Get one active pharmacy by ID
const getPharmacyById = async (req, res, next) => {
    try {
        const pharmacyId = Number(req.params.id);

        if (!Number.isInteger(pharmacyId) || pharmacyId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid pharmacy ID."
            });
        }

        const [rows] = await pool.execute(
            `SELECT
                id,
                name,
                address,
                city,
                state,
                phone
             FROM pharmacies
             WHERE id = ? AND is_active = 1`,
            [pharmacyId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pharmacy not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPharmacies,
    getPharmacyById
};