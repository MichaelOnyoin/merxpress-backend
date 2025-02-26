const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
//const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database(":memory:", (err) => {
    if (err) console.error(err.message);
    console.log("Connected to SQLite database.");
});

// PostgreSQL connection
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// });


db.serialize(() => {
    db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price NUMERIC NOT NULL,
        originalPrice NUMERIC,
        discount NUMERIC,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        imageUrl VARCHAR(255) NOT NULL
        
    )`);

    const stmt = db.prepare("INSERT INTO products ( price, originalPrice, discount, title, description, imageUrl) VALUES (?, ?,?,?,?,?)");
    stmt.run('369','', '', 'Nintendo Switch™ Mario Kart™ 8 Deluxe Bundle', 'Full Game Download + 3 Mo. Nintendo Switch Online Membership Included', '/images/nintendo.png');
    stmt.run('264.09','300.09','5', 'Dyson Airwrap Complete Long', 'Multi-styler for long hair, includes barrels and brushes, without extreme heat', '/images/screw.png');
    stmt.finalize();
});


// 🚀 API Endpoints


app.get("/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get a single Product by ID
app.get("/products/:id", (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Product not found" });
        res.json(row);
    });
});

// Create a new Product
app.post("/products", (req, res) => {
    const { price, originalPrice, discount, title, description, imageUrl } = req.body;
    if (!price || !title) return res.status(400).json({ error: "Title and price are required" });

    db.run("INSERT INTO products (price, originalPrice, discount, title, description, imageUrl) VALUES (?, ?,?, ?,?, ?)", [price, originalPrice, discount, title, description, imageUrl], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, price, originalPrice, discount, title, description, imageUrl });
    });
});

// Update Product by ID
// app.put("/products/:id", (req, res) => {
//     const { title, description } = req.body;
//     db.run("UPDATE products SET title = ?, description = ? WHERE id = ?", [title, description, req.params.id], function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         if (this.changes === 0) return res.status(404).json({ error: "Product not found" });
//         res.json({ message: "Product updated" });
//     });
// });

// Delete a Product by ID
app.delete("/products/:id", (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted" });
    });
});


//close db connection
// db.close((err) => {
//     if (err) console.error(err.message);
//     console.log("Closed the database connection.");
// });
// Start the server
app.listen(port, () => {
    
    console.log(`Server is running on http://localhost:${port} 🚀`);
});
