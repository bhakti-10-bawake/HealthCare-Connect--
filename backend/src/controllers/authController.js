const authService = require("../services/authService");


/* =========================================================
   REGISTER
   POST /api/auth/register
========================================================= */

async function register(req, res) {

    try {

        const {
            fullName,
            email,
            phone,
            password
        } = req.body;


        /* -----------------------------------------
           Validate required fields
        ----------------------------------------- */

        if (
            !fullName ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Full name, email, phone and password are required."

            });
        }


        /* -----------------------------------------
           Validate name
        ----------------------------------------- */

        if (
            typeof fullName !== "string" ||
            fullName.trim().length < 2
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid full name."

            });
        }


        /* -----------------------------------------
           Validate email
        ----------------------------------------- */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            typeof email !== "string" ||
            !emailRegex.test(email.trim())
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address."

            });
        }


        /* -----------------------------------------
           Validate phone
        ----------------------------------------- */

        const phoneRegex =
            /^[0-9]{10}$/;


        if (
            typeof phone !== "string" ||
            !phoneRegex.test(phone.trim())
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid 10-digit phone number."

            });
        }


        /* -----------------------------------------
           Validate password
        ----------------------------------------- */

        if (
            typeof password !== "string" ||
            password.length < 8
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 8 characters."

            });
        }


        /* -----------------------------------------
           Register through service
        ----------------------------------------- */

        const result =
            await authService.registerUser({

                fullName,

                email,

                phone,

                password

            });


        /* -----------------------------------------
           Success response
        ----------------------------------------- */

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            token: result.token,

            user: result.user

        });

    }

    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return res.status(
            error.statusCode || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Unable to create account. Please try again."

        });
    }
}


/* =========================================================
   LOGIN
   POST /api/auth/login
========================================================= */

async function login(req, res) {

    try {

        const {
            email,
            password
        } = req.body;


        /* -----------------------------------------
           Validate required fields
        ----------------------------------------- */

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });
        }


        /* -----------------------------------------
           Validate email
        ----------------------------------------- */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            typeof email !== "string" ||
            !emailRegex.test(email.trim())
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address."

            });
        }


        /* -----------------------------------------
           Authenticate through service
        ----------------------------------------- */

        const result =
            await authService.loginUser({

                email,

                password

            });


        /* -----------------------------------------
           Success response
        ----------------------------------------- */

        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            token: result.token,

            user: result.user

        });

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(
            error.statusCode || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Unable to login. Please try again."

        });
    }
}


/* =========================================================
   GET CURRENT USER
   GET /api/auth/me

   Requires:
   Authorization: Bearer <token>
========================================================= */

async function getCurrentUser(req, res) {

    try {

        /* -----------------------------------------
           req.user is created by authMiddleware
        ----------------------------------------- */

        if (!req.user || !req.user.id) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });
        }


        /* -----------------------------------------
           Find authenticated user
        ----------------------------------------- */

        const user =
            authService.getUserById(
                req.user.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User account not found."

            });
        }


        /* -----------------------------------------
           Check account status
        ----------------------------------------- */

        if (!user.isActive) {

            return res.status(403).json({

                success: false,

                message:
                    "Your account has been deactivated."

            });
        }


        /* -----------------------------------------
           Return safe user information
           
           Never return passwordHash.
        ----------------------------------------- */

        return res.status(200).json({

            success: true,

            user: {

                id: user.id,

                fullName: user.fullName,

                email: user.email,

                phone: user.phone,

                role: user.role,

                isActive: user.isActive,

                createdAt: user.createdAt

            }

        });

    }

    catch (error) {

        console.error(
            "Get current user error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve user information."

        });
    }
}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

    register,

    login,

    getCurrentUser

};