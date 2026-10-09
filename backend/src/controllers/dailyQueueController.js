
const { pool } = require("../config/database");

const VALID_STATUSES = [
    "WAITING",
    "CALLED",
    "IN_CONSULTATION",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW"
];

function todayLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

async function createToken({
    patientId,
    centreId,
    serviceType,
    bookingType,
    connection
}) {
    const queueDate = todayLocalDate();

    // Lock the centre's settings row to serialize token allocation.
    const [settingsRows] = await connection.execute(
        `SELECT daily_capacity, remote_token_limit,
                walk_in_token_limit, is_enabled
         FROM daily_queue_settings
         WHERE centre_id = ?
         FOR UPDATE`,
        [centreId]
    );

    if (!settingsRows.length || !settingsRows[0].is_enabled) {
        const error = new Error(
            "Daily tokens are unavailable at this centre."
        );
        error.statusCode = 400;
        throw error;
    }

    const settings = settingsRows[0];

    const [centreRows] = await connection.execute(
        `SELECT id
         FROM healthcare_centres
         WHERE id = ? AND is_active = 1
         LIMIT 1`,
        [centreId]
    );

    if (!centreRows.length) {
        const error = new Error("Healthcare centre not found.");
        error.statusCode = 404;
        throw error;
    }

    const [countRows] = await connection.execute(
        `SELECT
            COUNT(*) AS total_count,
            COALESCE(SUM(booking_type = 'REMOTE'), 0) AS remote_count,
            COALESCE(SUM(booking_type = 'WALK_IN'), 0) AS walk_in_count
         FROM daily_queue_tokens
         WHERE centre_id = ?
           AND queue_date = ?
           AND status <> 'CANCELLED'`,
        [centreId, queueDate]
    );

    const counts = countRows[0];

    if (Number(counts.total_count) >= settings.daily_capacity) {
        const error = new Error("Today's token capacity is full.");
        error.statusCode = 409;
        throw error;
    }

    if (
        bookingType === "REMOTE" &&
        Number(counts.remote_count) >= settings.remote_token_limit
    ) {
        const error = new Error(
            "Remote tokens are fully booked for today."
        );
        error.statusCode = 409;
        throw error;
    }

    if (
        bookingType === "WALK_IN" &&
        Number(counts.walk_in_count) >= settings.walk_in_token_limit
    ) {
        const error = new Error(
            "Today's walk-in token allocation is full."
        );
        error.statusCode = 409;
        throw error;
    }

    const [numberRows] = await connection.execute(
        `SELECT COALESCE(MAX(token_number), 0) + 1 AS next_number
         FROM daily_queue_tokens
         WHERE centre_id = ? AND queue_date = ?`,
        [centreId, queueDate]
    );

    const tokenNumber = Number(numberRows[0].next_number);

    const [result] = await connection.execute(
        `INSERT INTO daily_queue_tokens
            (patient_id, centre_id, token_number, queue_date,
             service_type, booking_type, status)
         VALUES (?, ?, ?, ?, ?, ?, 'WAITING')`,
        [
            patientId,
            centreId,
            tokenNumber,
            queueDate,
            serviceType,
            bookingType
        ]
    );

    return {
        id: result.insertId,
        tokenNumber,
        queueDate,
        centreId,
        serviceType,
        bookingType,
        status: "WAITING"
    };
}

async function runTokenCreation(options, res) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const token = await createToken({
            ...options,
            connection
        });

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Daily token created successfully.",
            data: token
        });
    } catch (error) {
        await connection.rollback();

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : "Unable to create daily token."
        });
    } finally {
        connection.release();
    }
}

async function bookDailyToken(req, res) {
    const { centreId, serviceType = "GENERAL_CHECKUP" } = req.body;
    const parsedCentreId = Number(centreId);

    if (!Number.isInteger(parsedCentreId) || parsedCentreId <= 0) {
        return res.status(400).json({
            success: false,
            message: "A valid healthcare centre is required."
        });
    }

    const allowedServices = [
        "GENERAL_CHECKUP",
        "ROUTINE_CONSULTATION"
    ];

    if (!allowedServices.includes(serviceType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid daily token service type."
        });
    }

    return runTokenCreation({
        patientId: req.user.id,
        centreId: parsedCentreId,
        serviceType,
        bookingType: "REMOTE"
    }, res);
}

async function issueWalkInToken(req, res) {
    const { patientId, centreId, serviceType = "GENERAL_CHECKUP" } =
        req.body;

    const parsedPatientId = Number(patientId);
    const parsedCentreId = Number(centreId);

    if (
        !Number.isInteger(parsedPatientId) ||
        parsedPatientId <= 0 ||
        !Number.isInteger(parsedCentreId) ||
        parsedCentreId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid patient and centre IDs are required."
        });
    }

    const [patients] = await pool.execute(
        `SELECT id FROM users
         WHERE id = ? AND role = 'PATIENT' AND is_active = 1
         LIMIT 1`,
        [parsedPatientId]
    );

    if (!patients.length) {
        return res.status(404).json({
            success: false,
            message: "Active patient not found."
        });
    }

    const allowedServices = [
        "GENERAL_CHECKUP",
        "ROUTINE_CONSULTATION"
    ];

    if (!allowedServices.includes(serviceType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid daily token service type."
        });
    }

    return runTokenCreation({
        patientId: parsedPatientId,
        centreId: parsedCentreId,
        serviceType,
        bookingType: "WALK_IN"
    }, res);
}

async function getMyDailyTokens(req, res) {
    try {
        const [tokens] = await pool.execute(
            `SELECT
                t.id,
                t.centre_id,
                hc.name AS centre_name,
                t.token_number,
                t.queue_date,
                t.service_type,
                t.booking_type,
                t.status,
                t.created_at
             FROM daily_queue_tokens t
             INNER JOIN healthcare_centres hc
                ON hc.id = t.centre_id
             WHERE t.patient_id = ?
             ORDER BY t.queue_date DESC, t.token_number DESC`,
            [req.user.id]
        );

        return res.json({
            success: true,
            data: tokens
        });
    } catch (error) {
        console.error("Get daily tokens error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch your daily tokens."
        });
    }
}

async function getDailyQueue(req, res) {
    const centreId = Number(req.params.centreId);
    const queueDate = req.query.date || todayLocalDate();

    if (!Number.isInteger(centreId) || centreId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid healthcare centre ID."
        });
    }

    try {
        const [tokens] = await pool.execute(
            `SELECT
                id,
                token_number,
                service_type,
                status,
                created_at
             FROM daily_queue_tokens
             WHERE centre_id = ?
               AND queue_date = ?
               AND status <> 'CANCELLED'
             ORDER BY token_number ASC`,
            [centreId, queueDate]
        );

        const activeStatuses = [
            "WAITING",
            "CALLED",
            "IN_CONSULTATION"
        ];

        const currentToken = tokens.find(
            token => token.status === "IN_CONSULTATION"
        ) || tokens.find(
            token => token.status === "CALLED"
        ) || null;

        return res.json({
            success: true,
            data: {
                centreId,
                queueDate,
                currentToken,
                waitingCount: tokens.filter(
                    token => token.status === "WAITING"
                ).length,
                tokens: tokens.map(token => ({
                    ...token,
                    tokenLabel: `G-${String(token.token_number).padStart(3, "0")}`
                }))
            }
        });
    } catch (error) {
        console.error("Get daily queue error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch the daily queue."
        });
    }
}

async function updateTokenStatus(req, res) {
    const tokenId = Number(req.params.tokenId);
    const { status } = req.body;

    if (!Number.isInteger(tokenId) || tokenId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid token ID."
        });
    }

    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid token status."
        });
    }

    try {
        const [result] = await pool.execute(
            `UPDATE daily_queue_tokens
             SET status = ?
             WHERE id = ?`,
            [status, tokenId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Token not found."
            });
        }

        return res.json({
            success: true,
            message: "Token status updated successfully."
        });
    } catch (error) {
        console.error("Update token status error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update token status."
        });
    }
}

module.exports = {
    bookDailyToken,
    getMyDailyTokens,
    getDailyQueue,
    issueWalkInToken,
    updateTokenStatus
};
