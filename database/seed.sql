-- LOCAL VOICE Seed Data
-- Run this script to populate the database with default demo accounts and sample complaints.

USE local_voice_db;

-- 1. Insert Demo Users (Bcrypt hash of 'Demo@1234' is '$2a$10$7R4bI7hXgJ7jB1N/uP6/eO9yV9Wz7/25gXU39x22dC7V8Qv6fEaeS')
-- We use: $2a$10$7R4bI7hXgJ7jB1N/uP6/eO9yV9Wz7/25gXU39x22dC7V8Qv6fEaeS as default Bcrypt password for Demo@1234
INSERT INTO users (name, email, phone, password, role, state, created_at)
VALUES 
('Demo Citizen', 'citizen@demo.com', '9876543210', '$2a$10$7R4bI7hXgJ7jB1N/uP6/eO9yV9Wz7/25gXU39x22dC7V8Qv6fEaeS', 'CITIZEN', 'Telangana', NOW())
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO users (name, email, phone, password, role, state, created_at)
VALUES 
('Demo Authority', 'authority@demo.com', '9876543211', '$2a$10$7R4bI7hXgJ7jB1N/uP6/eO9yV9Wz7/25gXU39x22dC7V8Qv6fEaeS', 'AUTHORITY', 'Telangana', NOW())
ON DUPLICATE KEY UPDATE name=name;

-- 2. Insert Sample Complaints
INSERT INTO complaints (
    complaint_id, user_id, full_name, father_name, phone, email, 
    door_number, street_village, mandal, district, state, 
    assembly_constituency, parliament_constituency, 
    title, category, description, location_text, latitude, longitude, 
    image_urls, status, priority, created_at
) VALUES 
(
    'LV-2026-1001', 
    1, 
    'Demo Citizen', 
    'Raju Kumar', 
    '9876543210', 
    'citizen@demo.com', 
    '12-4/A', 
    'Prashasan Nagar', 
    'Jubilee Hills', 
    'Hyderabad', 
    'Telangana', 
    'Jubilee Hills Assembly', 
    'Secunderabad Parliament', 
    'Major Potholes on Main Road', 
    'Road Issue', 
    'There are huge potholes on the main road opposite to the metro station. It is causing heavy traffic jam during peak hours and is highly risky for two-wheelers. Please repair it immediately.', 
    'Road No 36, Jubilee Hills, Hyderabad', 
    17.4326, 
    78.4069, 
    '["https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80"]', 
    'SUBMITTED', 
    'HIGH', 
    DATE_SUB(NOW(), INTERVAL 5 DAY)
),
(
    'LV-2026-1002', 
    1, 
    'Demo Citizen', 
    'Raju Kumar', 
    '9876543210', 
    'citizen@demo.com', 
    '12-4/A', 
    'Prashasan Nagar', 
    'Jubilee Hills', 
    'Hyderabad', 
    'Telangana', 
    'Jubilee Hills Assembly', 
    'Secunderabad Parliament', 
    'Street Lights Not Functioning', 
    'Street Lights Not Working', 
    'All street lights on Lane 4 are not functioning since last one week. The lane gets completely dark after 7 PM, creating safety concerns for women and senior citizens.', 
    'Lane 4, Prashasan Nagar, Jubilee Hills', 
    17.4341, 
    78.4012, 
    '["https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=800&q=80"]', 
    'IN_PROGRESS', 
    'MEDIUM', 
    DATE_SUB(NOW(), INTERVAL 3 DAY)
);

-- 3. Insert Authority Response for complaint 1002
INSERT INTO responses (complaint_id, authority_id, message, status_at_time, created_at)
VALUES 
(
    2, 
    2, 
    'Complaint has been received. Electrical engineers have been notified and new LED bulbs have been ordered for Lane 4.', 
    'IN_PROGRESS', 
    DATE_SUB(NOW(), INTERVAL 1 DAY)
);
