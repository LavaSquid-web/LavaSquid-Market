const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serves your HTML files from the root directory

// MySQL Database Connection Pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Put your local MySQL password here if you have one
    database: 'marketplace_db'
});

// Test Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database successfully!');
    connection.release();
});

// Serve login as the entry point
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// API Endpoint: Get all marketplace products with vendor store names
app.get('/api/products', (req, res) => {
    const query = `
        SELECT products.*, vendors.store_name, vendors.country 
        FROM products 
        JOIN vendors ON products.vendor_id = vendors.vendor_id 
        ORDER BY products.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API Endpoint: Add a new product from the vendor dashboard
app.post('/api/products', (req, res) => {
    const vendor_id = req.body.vendor_id || 1;
    const { title, description, price, product_link, image_url } = req.body;
    
    if (!title || !price) {
        return res.status(400).json({ error: 'Missing required fields (title, price)' });
    }

    const query = `
        INSERT INTO products (vendor_id, title, description, price, product_link, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [vendor_id, title, description, price, product_link, image_url], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Product published successfully!', productId: results.insertId });
    });
});

// API Endpoint: Clear all products
app.delete('/api/products', (req, res) => {
    db.query('DELETE FROM products', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'All products cleared successfully!' });
    });
});

// User Registration Endpoint (with secure bcrypt hashing)
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, hashedPassword, role || 'buyer'], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already exists!' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Account created successfully!', userId: result.insertId });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// User Login Endpoint (with secure bcrypt password comparison)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({ 
            message: 'Login successful', 
            role: user.role, 
            userId: user.user_id,
            name: user.name 
        });
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});