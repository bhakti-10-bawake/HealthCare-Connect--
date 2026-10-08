const doctorService = require("../services/doctorService");

const getDoctors = async (req, res) => {
    try {
        const search = req.query.search || "";

        const doctors = await doctorService.getDoctors(search);

        res.json({
            success: true,
            count: doctors.length,
            doctors
        });
    } catch (error) {
        console.error("Get doctors error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch doctors."
        });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctorId = Number(req.params.id);

        if (!Number.isInteger(doctorId) || doctorId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid doctor ID."
            });
        }

        const doctor = await doctorService.getDoctorById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        res.json({
            success: true,
            doctor
        });
    } catch (error) {
        console.error("Get doctor error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch doctor."
        });
    }
};

module.exports = {
    getDoctors,
    getDoctorById
};