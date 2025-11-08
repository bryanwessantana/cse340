-- 1️⃣ Insert a new record into the accounts table
-- The fields account_id and account_type are handled automatically
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2️⃣ Update Tony Stark's record to change the account type to 'Administrator'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3️⃣ Delete Tony Stark's record from the database
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4️⃣ Modify the GM Hummer description to replace 'small interiors' with 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'GM Hummer';

-- 5️⃣ Use an INNER JOIN to select make, model, and classification name
-- for inventory items belonging to the 'Sport' category
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6️⃣ Update all inventory records to add '/vehicles' into the image and thumbnail paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
