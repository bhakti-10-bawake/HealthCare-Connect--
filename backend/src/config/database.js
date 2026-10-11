
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const isSSLRequired = process.env.DB_SSL === "true";

const poolConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Enable SSL only when connecting to the cloud database.
if (isSSLRequired) {
    const caPath = path.join(
        __dirname,
        "../../certs/ca.pem"
    );

    if (!fs.existsSync(caPath)) {
        throw new Error(
            `Aiven CA certificate not found at: ${caPath}`
        );
    }

    poolConfig.ssl = {
        ca: fs.readFileSync(caPath, "utf8"),
        rejectUnauthorized: true
    };
}

const pool = mysql.createPool(poolConfig);

async function testDatabaseConnection() {
    let connection;

    try {
        connection = await pool.getConnection();

        console.log("MySQL database connected successfully.");
        return true;
    } catch (error) {
        console.error(
            "MySQL database connection failed:",
            error.message
        );
        return false;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    pool,
    testDatabaseConnection
};
