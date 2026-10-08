const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/* =========================================================
   TEMPORARY USER STORE
   ---------------------------------------------------------
   This is only for backend development/testing.

   Later, this will be replaced by MySQL without changing
   the controller/API structure.
========================================================= */

const users = [];


/* =========================================================
   REGISTER USER
========================================================= */

async function registerUser({
    fullName,
    email,
    phone,
    password
}) {

    const cleanName =
        fullName.trim();

    const cleanEmail =
        email.trim().toLowerCase();

    const cleanPhone =
        phone.trim();


    /* -----------------------------------------
       Check duplicate email
    ----------------------------------------- */

    const existingUser =
        users.find(
            user => user.email === cleanEmail
        );


    if (existingUser) {

        const error =
            new Error(
                "An account with this email already exists."
            );

        error.statusCode = 409;

        throw error;
    }


    /* -----------------------------------------
       Hash password
    ----------------------------------------- */

    const passwordHash =
        await bcrypt.hash(
            password,
            10
        );


    /* -----------------------------------------
       Create user
    ----------------------------------------- */

    const user = {

        id: users.length + 1,

        fullName: cleanName,

        email: cleanEmail,

        phone: cleanPhone,

        passwordHash,

        role: "PATIENT",

        isActive: true,

        createdAt:
            new Date().toISOString()
    };


    users.push(user);


    /* -----------------------------------------
       Create token
    ----------------------------------------- */

    const token =
        createToken(user);


    return {
        token,
        user: sanitizeUser(user)
    };
}


/* =========================================================
   LOGIN USER
========================================================= */

async function loginUser({
    email,
    password
}) {

    const cleanEmail =
        email.trim().toLowerCase();


    /* -----------------------------------------
       Find user
    ----------------------------------------- */

    const user =
        users.find(
            item =>
                item.email === cleanEmail
        );


    if (!user) {

        const error =
            new Error(
                "Invalid email or password."
            );

        error.statusCode = 401;

        throw error;
    }


    /* -----------------------------------------
       Check account status
    ----------------------------------------- */

    if (!user.isActive) {

        const error =
            new Error(
                "Your account has been deactivated."
            );

        error.statusCode = 403;

        throw error;
    }


    /* -----------------------------------------
       Compare password
    ----------------------------------------- */

    const passwordMatch =
        await bcrypt.compare(
            password,
            user.passwordHash
        );


    if (!passwordMatch) {

        const error =
            new Error(
                "Invalid email or password."
            );

        error.statusCode = 401;

        throw error;
    }


    /* -----------------------------------------
       Create token
    ----------------------------------------- */

    const token =
        createToken(user);


    return {
        token,
        user: sanitizeUser(user)
    };
}


/* =========================================================
   GET USER BY ID
========================================================= */

function getUserById(userId) {

    return users.find(
        user =>
            user.id === Number(userId)
    ) || null;
}


/* =========================================================
   CREATE JWT
========================================================= */

function createToken(user) {

    return jwt.sign(

        {
            userId: user.id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "7d"
        }
    );
}


/* =========================================================
   REMOVE PRIVATE DATA
========================================================= */

function sanitizeUser(user) {

    return {

        id: user.id,

        fullName: user.fullName,

        email: user.email,

        phone: user.phone,

        role: user.role,

        isActive: user.isActive,

        createdAt: user.createdAt
    };
}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

    registerUser,

    loginUser,

    getUserById

};