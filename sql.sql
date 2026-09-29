-- 1. Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS marketplace_db;
USE marketplace_db;

-- 2. Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'Philippines',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insert a default vendor so ID 1 exists
INSERT INTO vendors (store_name, country) VALUES ('My Awesome Store', 'Philippines');

-- 4. Create products table
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE
);
CREATE TABLE vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_name VARCHAR(150) NOT NULL,
    store_description TEXT,
    country VARCHAR(100) DEFAULT 'Philippines',
    is_approved BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE
);

-- 3. Insert a dummy user and vendor so you have a valid vendor_id (ID = 1) to test with
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Test Vendor', 'vendor@test.com', 'hashedpassword123', 'vendor');

INSERT INTO vendors (user_id, store_name, store_description, country) 
VALUES (1, 'Local Crafts Co.', 'Handmade goods from local creators', 'Philippines');
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('buyer', 'vendor', 'admin') DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    store_name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    product_link VARCHAR(500),
    image_url VARCHAR(255),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
ALTER TABLE products CHANGE COLUMN stock product_link VARCHAR(255) NOT NULL;
INSERT INTO vendors (store_name, country) VALUES ('Global Marketplace', 'Philippines');
TRUNCATE TABLE products;
ALTER TABLE products ADD COLUMN product_link VARCHAR(500);
INSERT INTO users (name, email, password, role) VALUES 
('Test Vendor', 'vendor@marketplace.com', 'password123', 'vendor'),
('Test Buyer', 'buyer@marketplace.com', 'password123', 'buyer');
ALTER TABLE users MODIFY COLUMN password VARCHAR(255);