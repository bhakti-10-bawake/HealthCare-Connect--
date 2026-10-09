
const { pool } = require("../config/database");

async function getPatientHealthRecords(req, res) {
    try {
        const patientId = req.user.id;

        const [rows] = await pool.execute(
            `
            SELECT
                hr.id,
                hr.record_type,
                hr.title,
                hr.description,
                hr.record_date,
                hr.file_path,
                hr.created_at,
                u.full_name AS doctor_name,
                dp.specialization,
                hc.name AS healthcare_centre
            FROM health_records hr
            LEFT JOIN doctor_profiles dp
                ON hr.doctor_id = dp.id
            LEFT JOIN users u
                ON dp.user_id = u.id
            LEFT JOIN healthcare_centres hc
                ON dp.centre_id = hc.id
            WHERE hr.patient_id = ?
            ORDER BY hr.record_date DESC, hr.id DESC
            `,
            [patientId]
        );

        const records = rows.map((record) => ({
            id: record.id,
            type: record.record_type,
            title: record.title,
            description: record.description,
            date: record.record_date,
            filePath: record.file_path,
            doctorName: record.doctor_name || "Not specified",
            specialization: record.specialization || "",
            healthcareCentre: record.healthcare_centre || "Not specified"
        }));

        return res.status(200).json({
            success: true,
            data: records
        });
    } catch (error) {
        console.error("Get health records error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch health records."
        });
    }
}

module.exports = { getPatientHealthRecords };
