const pool = require("../config/database");

const getDoctors = async (search = "") => {
    const searchTerm = `%${search}%`;

    const [doctors] = await pool.execute(
        `
        SELECT
            dp.id,
            u.full_name AS name,
            dp.specialization,
            dp.qualification,
            dp.experience_years,
            dp.consultation_fee,
            dp.rating,
            dp.bio,
            dp.is_available,
            hc.name AS healthcare_centre,
            hc.address AS centre_address,
            hc.village,
            hc.taluka,
            hc.district,
            hc.state
        FROM doctor_profiles dp
        INNER JOIN users u
            ON dp.user_id = u.id
        LEFT JOIN healthcare_centres hc
            ON dp.centre_id = hc.id
        WHERE u.is_active = TRUE
          AND (
              u.full_name LIKE ?
              OR dp.specialization LIKE ?
              OR hc.name LIKE ?
              OR hc.district LIKE ?
          )
        ORDER BY dp.rating DESC, u.full_name ASC
        `,
        [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    return doctors;
};

const getDoctorById = async (doctorId) => {
    const [doctors] = await pool.execute(
        `
        SELECT
            dp.id,
            u.full_name AS name,
            u.email,
            u.phone,
            dp.specialization,
            dp.qualification,
            dp.experience_years,
            dp.consultation_fee,
            dp.rating,
            dp.bio,
            dp.is_available,
            hc.id AS centre_id,
            hc.name AS healthcare_centre,
            hc.address AS centre_address,
            hc.village,
            hc.taluka,
            hc.district,
            hc.state
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

    return doctors[0] || null;
};

module.exports = {
    getDoctors,
    getDoctorById
};