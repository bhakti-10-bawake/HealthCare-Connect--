
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const healthRecordRoutes = require("./routes/healthRecordRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const dailyQueueRoutes = require("./routes/dailyQueueRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");

const app = express();

// Middleware
app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/emergency-contacts", emergencyRoutes);
app.use("/api/daily-queue", dailyQueueRoutes);
console.log("DAILY QUEUE ROUTES REGISTERED");
app.use("/api/pharmacies", pharmacyRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Connect API is running.",
        version: "1.0.0"
    });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Connect API is healthy.",
        timestamp: new Date().toISOString()
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error("Unhandled server error:", error);

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "An unexpected server error occurred."
    });
});

module.exports = app;
