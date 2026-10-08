const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../config/database");


/* =========================================================
   REGISTER USER
   ---------------------------------------------------------
   Creates a real user in the MySQL users table.
========================================================= */

async function registerUser({
    fullName,
    email,
    phone,
    password
}) {

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();


    /* -----------------------------------------
       Check whether email already exists
    ----------------------------------------- */

    const [existingUsers] = await pool.execute(
        `
        SELECT id
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [cleanEmail]
    );


    if (existingUsers.length > 0) {

        const error = new Error(
            "An account with this email already exists."
        );

        error.statusCode = 409;

        throw error;
    }


    /* -----------------------------------------
       Hash password
    ----------------------------------------- */

    const passwordHash = await bcrypt.hash(
        password,
        10
    );


    /* -----------------------------------------
       Insert user into MySQL
    ----------------------------------------- */

    const [result] = await pool.execute(
        `
        INSERT INTO users
        (
            full_name,
            email,
            phone,
            password_hash,
            role,
            is_active
        )
        VALUES (?, ?, ?, ?, 'PATIENT', TRUE)
        `,
        [
            cleanName,
            cleanEmail,
            cleanPhone,
            passwordHash
        ]
    );


    /* -----------------------------------------
       Get newly created user
    ----------------------------------------- */

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            full_name,
            email,
            phone,
            role,
            is_active,
            created_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [result.insertId]
    );


    const user = rows[0];


    /* -----------------------------------------
       Create JWT
    ----------------------------------------- */

    const token = createToken(user);


    return {
        token,
        user: sanitizeUser(user)
    };
}


/* =========================================================
   LOGIN USER
   ---------------------------------------------------------
   Finds the user in MySQL and verifies the bcrypt password.
========================================================= */

async function loginUser({
    email,
    password
}) {

    const cleanEmail = email.trim().toLowerCase();


    /* -----------------------------------------
       Find user
    ----------------------------------------- */

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            full_name,
            email,
            phone,
            password_hash,
            role,
            is_active,
            created_at
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [cleanEmail]
    );


    if (rows.length === 0) {

        const error = new Error(
            "Invalid email or password."
        );

        error.statusCode = 401;

        throw error;
    }


    const user = rows[0];


    /* -----------------------------------------
       Check account status
    ----------------------------------------- */

    if (!user.is_active) {

        const error = new Error(
            "Your account has been deactivated."
        );

        error.statusCode = 403;

        throw error;
    }


    /* -----------------------------------------
       Compare password
    ----------------------------------------- */

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );


    if (!passwordMatch) {

        const error = new Error(
            "Invalid email or password."
        );

        error.statusCode = 401;

        throw error;
    }


    /* -----------------------------------------
       Create JWT
    ----------------------------------------- */

    const token = createToken(user);


    return {
        token,
        user: sanitizeUser(user)
    };
}


/* =========================================================
   GET USER BY ID
   ---------------------------------------------------------
   Retrieves the authenticated user from MySQL.
========================================================= */

async function getUserById(userId) {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            full_name,
            email,
            phone,
            role,
            is_active,
            created_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [Number(userId)]
    );


    if (rows.length === 0) {
        return null;
    }


    return rows[0];
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
   ---------------------------------------------------------
   Never send password_hash to the frontend.
========================================================= */

function sanitizeUser(user) {

    return {

        id: user.id,

        fullName: user.full_name,

        email: user.email,

        phone: user.phone,

        role: user.role,

        isActive: Boolean(user.is_active),

        createdAt: user.created_at
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