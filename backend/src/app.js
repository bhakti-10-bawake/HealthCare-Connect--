const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicineRoutes = require("./routes/medicineRoutes");

const app = express();


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ============================================================
// API ROUTES
// ============================================================

// Authentication
app.use("/api/auth", authRoutes);

// Patient doctor discovery
app.use("/api/doctors", doctorRoutes);

// Patient appointments
app.use("/api/appointments", appointmentRoutes);

// Patient medicines
app.use("/api/medicines", medicineRoutes);


// ============================================================
// ROOT ROUTE
// ============================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Connect API is running.",
        version: "1.0.0"
    });
});


// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Connect API is healthy.",
        timestamp: new Date().toISOString()
    });
});


// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});


// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use((error, req, res, next) => {
    console.error("Unhandled server error:", error);

    res.status(error.statusCode || 500).json({
        success: false,
        message:
            error.message ||
            "An unexpected server error occurred."
    });
});


// ============================================================
// EXPORT
// ============================================================

module.exports = app;