const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ========================================
// ROUTES
// ========================================

const routes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

// ========================================
// APP
// ========================================

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// ROUTE DIAGNOSTICS
// ========================================

console.log("========================================");
console.log("Route diagnostics:");
console.log("authRoutes:", typeof authRoutes);
console.log("doctorRoutes:", typeof doctorRoutes);
console.log("routes:", typeof routes);
console.log("========================================");

// ========================================
// ROOT
// ========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Connect API is running"
    });
});

// ========================================
// DATABASE HEALTH CHECK
// ========================================

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
        console.error(
            "Database connection error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// ========================================
// AUTHENTICATION
// ========================================

app.use("/api/auth", authRoutes);

// ========================================
// DOCTORS
// ========================================

app.use("/api/doctors", doctorRoutes);

// ========================================
// GENERAL API
// ========================================

app.use("/api", routes);

// ========================================
// 404
// ========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
    console.error("Server error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });
});

module.exports = app;