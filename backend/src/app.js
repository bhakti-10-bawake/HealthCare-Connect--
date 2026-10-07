const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/*
 * Basic API health check
 */
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Connect API is running"
    });
});


/*
 * Database connection test
 *
 * This will be used once MySQL is installed
 * and the healthcare_connect database exists.
 */
app.get("/api/health/database", async (req, res) => {

    try {

        const pool = require("./config/database");

        const connection = await pool.getConnection();

        await connection.ping();

        connection.release();

        res.json({
            success: true,
            message: "Database connection successful"
        });

    } catch (error) {

        console.error("Database connection error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });

    }

});


module.exports = app;