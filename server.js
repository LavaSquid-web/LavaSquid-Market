const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
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
const { title, description, price, stock, image_url } = req.body;
    if (!title || !price) {
        return res.status(400).json({ error: 'Missing required fields (vendor id, title, price)' });
    }

    const query = `
        INSERT INTO products (vendor_id, title, description, price, stock, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [vendor_id, title, description, price, stock, image_url], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Product published successfully!', productId: results.insertId });
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});