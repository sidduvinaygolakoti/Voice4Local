-- LOCAL VOICE Database Schema
-- Run this script to create the required tables in MySQL database.

CREATE DATABASE IF NOT EXISTS local_voice_db;
USE local_voice_db;

-- 1. Users Table (Citizens and Authorities)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT,
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    door_number VARCHAR(50),
    street_village VARCHAR(255) NOT NULL,
    mandal VARCHAR(255),
    district VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    assembly_constituency VARCHAR(255),
    parliament_constituency VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    location_text VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    image_urls JSON,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Responses Table (Authority replies on complaints)
CREATE TABLE IF NOT EXISTS responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    authority_id BIGINT,
    message TEXT NOT NULL,
    status_at_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (authority_id) REFERENCES users(id) ON DELETE SET NULL
);
