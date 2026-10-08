const { pool } = require("../config/database");


// ============================================================
// GET MEDICINES
// ============================================================

async function getMedicines(req, res) {
    try {
        const { search, category } = req.query;

        let query = `
            SELECT
                m.id,
                m.name,
                m.generic_name,
                m.category,
                m.dosage_form,
                m.strength,
                m.description,
                m.prescription_required,

                MIN(
                    CASE
                        WHEN mi.is_available = TRUE
                        AND p.active = TRUE
                        THEN mi.price
                    END
                ) AS price,

                MIN(
                    CASE
                        WHEN mi.is_available = TRUE
                        AND p.active = TRUE
                        THEN mi.pack_size
                    END
                ) AS pack_size,

                MAX(
                    CASE
                        WHEN mi.is_available = TRUE
                        AND p.active = TRUE
                        THEN 1
                        ELSE 0
                    END
                ) AS is_available

            FROM medicines m

            LEFT JOIN medicine_inventory mi
                ON m.id = mi.medicine_id

            LEFT JOIN pharmacies p
                ON mi.pharmacy_id = p.id

            WHERE 1 = 1
        `;

        const params = [];


        // ========================================================
        // SEARCH
        // ========================================================

        if (search && search.trim()) {

            query += `
                AND (
                    m.name LIKE ?
                    OR m.generic_name LIKE ?
                    OR m.category LIKE ?
                    OR m.strength LIKE ?
                    OR m.dosage_form LIKE ?
                )
            `;

            const searchValue =
                `%${search.trim()}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }


        // ========================================================
        // CATEGORY
        // ========================================================

        if (
            category &&
            category.trim() &&
            category.toLowerCase() !== "all"
        ) {

            query += `
                AND m.category = ?
            `;

            params.push(
                category.trim()
            );
        }


        // ========================================================
        // GROUP
        // ========================================================

        query += `
            GROUP BY
                m.id,
                m.name,
                m.generic_name,
                m.category,
                m.dosage_form,
                m.strength,
                m.description,
                m.prescription_required

            ORDER BY
                m.name ASC
        `;


        const [rows] =
            await pool.execute(
                query,
                params
            );


        // ========================================================
        // FORMAT RESPONSE
        // ========================================================

        const medicines =
            rows.map((medicine) => ({
                id: medicine.id,

                name: medicine.name,

                generic:
                    medicine.generic_name,

                category:
                    medicine.category,

                form:
                    medicine.dosage_form,

                strength:
                    medicine.strength,

                description:
                    medicine.description,

                prescription:
                    Boolean(
                        medicine.prescription_required
                    ),

                price:
                    medicine.price !== null
                        ? Number(medicine.price)
                        : null,

                pack:
                    medicine.pack_size,

                available:
                    Boolean(
                        medicine.is_available
                    )
            }));


        res.json({
            success: true,
            data: medicines
        });

    } catch (error) {

        console.error(
            "Get medicines error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch medicines."
        });
    }
}


// ============================================================
// GET MEDICINE BY ID
// ============================================================

async function getMedicineById(req, res) {

    try {

        const medicineId =
            Number(req.params.id);


        if (
            !Number.isInteger(medicineId) ||
            medicineId <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid medicine ID."
            });
        }


        const [rows] =
            await pool.execute(
                `
                SELECT
                    m.id,
                    m.name,
                    m.generic_name,
                    m.category,
                    m.dosage_form,
                    m.strength,
                    m.description,
                    m.prescription_required,

                    MIN(
                        CASE
                            WHEN mi.is_available = TRUE
                            AND p.active = TRUE
                            THEN mi.price
                        END
                    ) AS price,

                    MIN(
                        CASE
                            WHEN mi.is_available = TRUE
                            AND p.active = TRUE
                            THEN mi.pack_size
                        END
                    ) AS pack_size,

                    MAX(
                        CASE
                            WHEN mi.is_available = TRUE
                            AND p.active = TRUE
                            THEN 1
                            ELSE 0
                        END
                    ) AS is_available

                FROM medicines m

                LEFT JOIN medicine_inventory mi
                    ON m.id = mi.medicine_id

                LEFT JOIN pharmacies p
                    ON mi.pharmacy_id = p.id

                WHERE m.id = ?

                GROUP BY
                    m.id,
                    m.name,
                    m.generic_name,
                    m.category,
                    m.dosage_form,
                    m.strength,
                    m.description,
                    m.prescription_required

                LIMIT 1
                `,
                [medicineId]
            );


        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Medicine not found."
            });
        }


        const medicine = rows[0];


        res.json({
            success: true,
            data: {
                id: medicine.id,

                name: medicine.name,

                generic:
                    medicine.generic_name,

                category:
                    medicine.category,

                form:
                    medicine.dosage_form,

                strength:
                    medicine.strength,

                description:
                    medicine.description,

                prescription:
                    Boolean(
                        medicine.prescription_required
                    ),

                price:
                    medicine.price !== null
                        ? Number(medicine.price)
                        : null,

                pack:
                    medicine.pack_size,

                available:
                    Boolean(
                        medicine.is_available
                    )
            }
        });

    } catch (error) {

        console.error(
            "Get medicine error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch medicine details."
        });
    }
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getMedicines,
    getMedicineById
};