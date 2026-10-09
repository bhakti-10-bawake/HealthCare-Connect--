
const { pool } = require("../config/database");

function formatReminder(row) {
    return {
        id: row.id,
        medicine: row.medicine_name,
        dosage: row.dosage || "",
        frequency: row.frequency || "",
        time: String(row.reminder_time || "").slice(0, 5),
        startDate: row.start_date
            ? new Date(row.start_date).toISOString().slice(0, 10)
            : "",
        endDate: row.end_date
            ? new Date(row.end_date).toISOString().slice(0, 10)
            : null,
        notes: row.notes || "",
        active: Boolean(row.is_active)
    };
}

async function getPatientReminders(req, res) {
    try {
        const [rows] = await pool.execute(
            `SELECT id, medicine_name, dosage, frequency,
                    reminder_time, start_date, end_date, notes, is_active
             FROM medicine_reminders
             WHERE patient_id = ?
             ORDER BY reminder_time ASC, id DESC`,
            [req.user.id]
        );

        return res.json({
            success: true,
            data: rows.map(formatReminder)
        });
    } catch (error) {
        console.error("Get reminders error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch reminders."
        });
    }
}

async function createReminder(req, res) {
    try {
        const {
            medicine,
            dosage,
            frequency,
            time,
            startDate,
            endDate,
            notes
        } = req.body;

        if (
            typeof medicine !== "string" || !medicine.trim() ||
            typeof dosage !== "string" || !dosage.trim() ||
            typeof frequency !== "string" || !frequency.trim() ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(time || "") ||
            !/^\d{4}-\d{2}-\d{2}$/.test(startDate || "")
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid medicine, dosage, frequency, time and start date."
            });
        }

        if (
            endDate &&
            (!/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
             endDate < startDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date must be valid and cannot precede the start date."
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO medicine_reminders
                (patient_id, medicine_name, dosage, frequency,
                 reminder_time, start_date, end_date, notes, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [
                req.user.id,
                medicine.trim(),
                dosage.trim(),
                frequency.trim(),
                time,
                startDate,
                endDate || null,
                typeof notes === "string" ? notes.trim() : ""
            ]
        );

        const [rows] = await pool.execute(
            `SELECT id, medicine_name, dosage, frequency,
                    reminder_time, start_date, end_date, notes, is_active
             FROM medicine_reminders
             WHERE id = ? AND patient_id = ?`,
            [result.insertId, req.user.id]
        );

        return res.status(201).json({
            success: true,
            message: "Reminder created successfully.",
            data: formatReminder(rows[0])
        });
    } catch (error) {
        console.error("Create reminder error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create reminder."
        });
    }
}

async function updateReminder(req, res) {
    try {
        const reminderId = Number(req.params.id);

        if (!Number.isInteger(reminderId) || reminderId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid reminder ID."
            });
        }

        const {
            medicine,
            dosage,
            frequency,
            time,
            startDate,
            endDate,
            notes,
            active
        } = req.body;

        if (
            typeof medicine !== "string" || !medicine.trim() ||
            typeof dosage !== "string" || !dosage.trim() ||
            typeof frequency !== "string" || !frequency.trim() ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(time || "") ||
            !/^\d{4}-\d{2}-\d{2}$/.test(startDate || "")
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid reminder details."
            });
        }

        if (
            endDate &&
            (!/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
             endDate < startDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date must be valid and cannot precede the start date."
            });
        }

        if (active !== undefined && typeof active !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Invalid active status."
            });
        }

        const [result] = await pool.execute(
            `UPDATE medicine_reminders
             SET medicine_name = ?,
                 dosage = ?,
                 frequency = ?,
                 reminder_time = ?,
                 start_date = ?,
                 end_date = ?,
                 notes = ?,
                 is_active = COALESCE(?, is_active)
             WHERE id = ? AND patient_id = ?`,
            [
                medicine.trim(),
                dosage.trim(),
                frequency.trim(),
                time,
                startDate,
                endDate || null,
                typeof notes === "string" ? notes.trim() : "",
                active === undefined ? null : active,
                reminderId,
                req.user.id
            ]
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found."
            });
        }

        const [rows] = await pool.execute(
            `SELECT id, medicine_name, dosage, frequency,
                    reminder_time, start_date, end_date, notes, is_active
             FROM medicine_reminders
             WHERE id = ? AND patient_id = ?`,
            [reminderId, req.user.id]
        );

        return res.json({
            success: true,
            message: "Reminder updated successfully.",
            data: formatReminder(rows[0])
        });
    } catch (error) {
        console.error("Update reminder error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update reminder."
        });
    }
}

async function deleteReminder(req, res) {
    try {
        const reminderId = Number(req.params.id);

        if (!Number.isInteger(reminderId) || reminderId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid reminder ID."
            });
        }

        const [result] = await pool.execute(
            `DELETE FROM medicine_reminders
             WHERE id = ? AND patient_id = ?`,
            [reminderId, req.user.id]
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found."
            });
        }

        return res.json({
            success: true,
            message: "Reminder deleted successfully."
        });
    } catch (error) {
        console.error("Delete reminder error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete reminder."
        });
    }
}

module.exports = {
    getPatientReminders,
    createReminder,
    updateReminder,
    deleteReminder
};
