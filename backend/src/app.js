const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");


const app = express();


/* =========================================================
   GLOBAL MIDDLEWARE
========================================================= */

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "Healthcare Connect API is running."

    });

});


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "Healthcare Connect API is healthy.",

        timestamp:
            new Date().toISOString()

    });

});


/* =========================================================
   AUTHENTICATION
========================================================= */

app.use(
    "/api/auth",
    authRoutes
);


/* =========================================================
   DOCTORS
========================================================= */

app.use(
    "/api/doctors",
    doctorRoutes
);


/* =========================================================
   404
========================================================= */

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "API endpoint not found."

    });

});


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
    (error, req, res, next) => {

        console.error(
            "Server error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }
);


module.exports = app;