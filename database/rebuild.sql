-- ===========================================
--  DATABASE REBUILD SCRIPT
-- ===========================================

-- Drop existing tables (optional)
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS accounts;

-- ===========================================
--  CREATE TABLES
-- ===========================================

CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL
);

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) DEFAULT 'Client'
);

CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_description TEXT,
    inv_image VARCHAR(200),
    inv_thumbnail VARCHAR(200),
    classification_id INT REFERENCES classification(classification_id)
);

-- ===========================================
--  INSERT SAMPLE DATA
-- ===========================================

INSERT INTO classification (classification_name) VALUES 
('Sport'),
('SUV'),
('Truck'),
('Sedan');

INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id)
VALUES 
('GM', 'Hummer', 'A powerful SUV with small interiors', '/images/hummer.jpg', '/images/hummer-tn.jpg', 2),
('Toyota', 'Supra', 'A classic sports car', '/images/supra.jpg', '/images/supra-tn.jpg', 1);

INSERT INTO accounts (first_name, last_name, email, password, account_type)
VALUES ('John', 'Doe', 'john@example.com', 'Password123', 'Client');

-- ===========================================
--  END OF INITIAL DATA
-- ===========================================

-- ===========================================
--  TASK 4 FROM ASSIGNMENT 2
--  Modify GM Hummer description
-- ===========================================
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- ===========================================
--  TASK 6 FROM ASSIGNMENT 2
--  Add '/vehicles' to image paths
-- ===========================================
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');