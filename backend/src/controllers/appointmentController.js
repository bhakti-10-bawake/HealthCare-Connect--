const { pool } = require("../config/database");


// ============================================================
// CREATE APPOINTMENT
// ============================================================

async function createAppointment(req, res) {
    try {
        const patientId = req.user.id;

        const {
            doctorId,
            appointmentDate,
            appointmentTime,
            reason
        } = req.body;

        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        if (!doctorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                success: false,
                message: "Doctor, date and time are required."
            });
        }

        const parsedDoctorId = Number(doctorId);

        if (!Number.isInteger(parsedDoctorId) || parsedDoctorId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid doctor ID."
            });
        }


        // ------------------------------------------------------
        // CHECK DOCTOR
        // ------------------------------------------------------

        const [doctorRows] = await pool.execute(
            `
            SELECT
                dp.id,
                dp.centre_id,
                dp.consultation_fee,
                dp.is_available,
                u.full_name AS doctor_name
            FROM doctor_profiles dp
            INNER JOIN users u
                ON dp.user_id = u.id
            WHERE dp.id = ?
              AND u.is_active = TRUE
            LIMIT 1
            `,
            [parsedDoctorId]
        );

        if (doctorRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        const doctor = doctorRows[0];


        if (!doctor.is_available) {
            return res.status(400).json({
                success: false,
                message: "This doctor is currently unavailable."
            });
        }


        // ------------------------------------------------------
        // CHECK DATE
        // ------------------------------------------------------

        const selectedDate = new Date(
            `${appointmentDate}T00:00:00`
        );

        if (Number.isNaN(selectedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment date."
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Appointment date cannot be in the past."
            });
        }


        // ------------------------------------------------------
        // CHECK DOCTOR TIME SLOT
        // ------------------------------------------------------

        const [existingAppointments] = await pool.execute(
            `
            SELECT id
            FROM appointments
            WHERE doctor_id = ?
              AND appointment_date = ?
              AND appointment_time = ?
              AND status NOT IN ('CANCELLED', 'NO_SHOW')
            LIMIT 1
            `,
            [
                parsedDoctorId,
                appointmentDate,
                appointmentTime
            ]
        );

        if (existingAppointments.length > 0) {
            return res.status(409).json({
                success: false,
                message: "This appointment slot is already booked."
            });
        }


        // ------------------------------------------------------
        // CHECK PATIENT DUPLICATE
        // ------------------------------------------------------

        const [patientAppointments] = await pool.execute(
            `
            SELECT id
            FROM appointments
            WHERE patient_id = ?
              AND appointment_date = ?
              AND appointment_time = ?
              AND status NOT IN ('CANCELLED', 'NO_SHOW')
            LIMIT 1
            `,
            [
                patientId,
                appointmentDate,
                appointmentTime
            ]
        );

        if (patientAppointments.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You already have an appointment at this time."
            });
        }


        // ------------------------------------------------------
        // CREATE APPOINTMENT
        // ------------------------------------------------------

        const [result] = await pool.execute(
            `
            INSERT INTO appointments
            (
                patient_id,
                doctor_id,
                centre_id,
                appointment_date,
                appointment_time,
                reason,
                consultation_fee,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'UPCOMING')
            `,
            [
                patientId,
                parsedDoctorId,
                doctor.centre_id,
                appointmentDate,
                appointmentTime,
                reason ? reason.trim() : null,
                doctor.consultation_fee
            ]
        );


        // ------------------------------------------------------
        // RETURN CREATED APPOINTMENT
        // ------------------------------------------------------

        const [rows] = await pool.execute(
            `
            SELECT
                a.id,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.consultation_fee,
                a.status,
                dp.id AS doctor_id,
                u.full_name AS doctor_name,
                dp.specialization,
                hc.name AS healthcare_centre
            FROM appointments a

            INNER JOIN doctor_profiles dp
                ON a.doctor_id = dp.id

            INNER JOIN users u
                ON dp.user_id = u.id

            LEFT JOIN healthcare_centres hc
                ON a.centre_id = hc.id

            WHERE a.id = ?

            LIMIT 1
            `,
            [result.insertId]
        );


        res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            data: rows[0]
        });

    } catch (error) {
        console.error("Create appointment error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to book appointment."
        });
    }
}


// ============================================================
// GET PATIENT APPOINTMENTS
// ============================================================

async function getPatientAppointments(req, res) {
    try {
        const patientId = req.user.id;

        const [appointments] = await pool.execute(
            `
            SELECT
                a.id,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.consultation_fee,
                a.status,
                a.queue_number,

                dp.id AS doctor_id,
                u.full_name AS doctor_name,
                dp.specialization,

                hc.name AS healthcare_centre,
                hc.address,
                hc.city,
                hc.state

            FROM appointments a

            INNER JOIN doctor_profiles dp
                ON a.doctor_id = dp.id

            INNER JOIN users u
                ON dp.user_id = u.id

            LEFT JOIN healthcare_centres hc
                ON a.centre_id = hc.id

            WHERE a.patient_id = ?

            ORDER BY
                a.appointment_date DESC,
                a.appointment_time DESC
            `,
            [patientId]
        );


        const formattedAppointments = appointments.map(
            (appointment) => ({
                id: appointment.id,

                doctorId: appointment.doctor_id,

                doctorName: appointment.doctor_name,

                specialization:
                    appointment.specialization,

                date: appointment.appointment_date,

                time: appointment.appointment_time,

                reason: appointment.reason,

                fee: Number(
                    appointment.consultation_fee
                ),

                status: appointment.status,

                queueNumber:
                    appointment.queue_number,

                healthcareCentre:
                    appointment.healthcare_centre,

                address: appointment.address,

                city: appointment.city,

                state: appointment.state
            })
        );


        res.json({
            success: true,
            data: formattedAppointments
        });

    } catch (error) {
        console.error(
            "Get patient appointments error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch appointments."
        });
    }
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    createAppointment,
    getPatientAppointments
};