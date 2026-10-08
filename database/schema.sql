CREATE DATABASE IF NOT EXISTS healthcare_connect;

USE healthcare_connect;


CREATE TABLE users (

    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    phone VARCHAR(20) NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM(
        'PATIENT',
        'DOCTOR',
        'PHARMACY',
        'ADMIN'
    ) NOT NULL DEFAULT 'PATIENT',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

);