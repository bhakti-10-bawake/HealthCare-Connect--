const { pool } = require("../config/database");

async function getDoctors(req, res) {
    try {
        const { search, specialization } = req.query;

        let query = `
            SELECT
                dp.id,
                u.full_name AS name,
                dp.specialization,
                dp.qualifications,
                dp.experience_years,
                dp.consultation_fee,
                dp.rating,
                dp.bio,
                dp.is_available,
                hc.name AS healthcare_centre,
                hc.address,
                hc.city,
                hc.state
            FROM doctor_profiles dp
            INNER JOIN users u
                ON dp.user_id = u.id
            LEFT JOIN healthcare_centres hc
                ON dp.centre_id = hc.id
            WHERE u.is_active = TRUE
        `;

        const params = [];

        if (search && search.trim()) {
            query += `
                AND (
                    u.full_name LIKE ?
                    OR dp.specialization LIKE ?
                    OR dp.qualifications LIKE ?
                    OR hc.name LIKE ?
                )
            `;

            const searchValue = `%${search.trim()}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        if (
            specialization &&
            specialization.trim() &&
            specialization.toLowerCase() !== "all"
        ) {
            query += `
                AND dp.specialization = ?
            `;

            params.push(specialization.trim());
        }

        query += `
            ORDER BY
                dp.is_available DESC,
                dp.rating DESC,
                u.full_name ASC
        `;

        const [doctors] = await pool.execute(query, params);

        const formattedDoctors = doctors.map((doctor) => ({
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization,
            qualifications: doctor.qualifications,
            experience: doctor.experience_years,
            consultationFee: Number(doctor.consultation_fee),
            rating: Number(doctor.rating),
            bio: doctor.bio,
            isAvailable: Boolean(doctor.is_available),
            healthcareCentre: doctor.healthcare_centre,
            address: doctor.address,
            city: doctor.city,
            state: doctor.state
        }));

        res.json({
            success: true,
            data: formattedDoctors
        });

    } catch (error) {
        console.error("Get doctors error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch doctors."
        });
    }
}


async function getDoctorById(req, res) {
    try {
        const doctorId = Number(req.params.id);

        if (!Number.isInteger(doctorId) || doctorId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid doctor ID."
            });
        }

        const [rows] = await pool.execute(
            `
            SELECT
                dp.id,
                u.full_name AS name,
                u.email,
                u.phone,
                dp.specialization,
                dp.qualifications,
                dp.experience_years,
                dp.consultation_fee,
                dp.rating,
                dp.bio,
                dp.is_available,
                hc.name AS healthcare_centre,
                hc.address,
                hc.city,
                hc.state,
                hc.phone AS centre_phone
            FROM doctor_profiles dp
            INNER JOIN users u
                ON dp.user_id = u.id
            LEFT JOIN healthcare_centres hc
                ON dp.centre_id = hc.id
            WHERE dp.id = ?
              AND u.is_active = TRUE
            LIMIT 1
            `,
            [doctorId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        const doctor = rows[0];

        res.json({
            success: true,
            data: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization,
                qualifications: doctor.qualifications,
                experience: doctor.experience_years,
                consultationFee: Number(doctor.consultation_fee),
                rating: Number(doctor.rating),
                bio: doctor.bio,
                isAvailable: Boolean(doctor.is_available),
                healthcareCentre: doctor.healthcare_centre,
                address: doctor.address,
                city: doctor.city,
                state: doctor.state,
                centrePhone: doctor.centre_phone
            }
        });

    } catch (error) {
        console.error("Get doctor error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch doctor details."
        });
    }
}


module.exports = {
    getDoctors,
    getDoctorById
};