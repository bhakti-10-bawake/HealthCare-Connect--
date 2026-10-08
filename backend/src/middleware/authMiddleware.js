const jwt = require("jsonwebtoken");


/* =========================================================
   VERIFY JWT
========================================================= */

function authenticateToken(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;


        /* -----------------------------------------
           Check Authorization header
        ----------------------------------------- */

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });
        }


        /* -----------------------------------------
           Expected format:
           
           Authorization: Bearer TOKEN
        ----------------------------------------- */

        const parts =
            authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authorization format."

            });
        }


        const token =
            parts[1];


        /* -----------------------------------------
           Verify token
        ----------------------------------------- */

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        /* -----------------------------------------
           Attach authenticated user
           information to request
        ----------------------------------------- */

        req.user = {

            id: decoded.userId,

            role: decoded.role

        };


        next();

    }

    catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired authentication token."

        });

    }
}


/* =========================================================
   ROLE CHECK
========================================================= */

function authorizeRoles(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });
        }


        if (
            !allowedRoles.includes(
                req.user.role
            )
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have permission to access this resource."

            });
        }


        next();
    };
}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

    authenticateToken,

    authorizeRoles

};