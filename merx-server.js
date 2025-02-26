require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/merxpress");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 📝 **Routes**
// ✅ Get all products pool
app.get("/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 🚀 API Endpoints

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

// ✅ Delete a product
app.delete("/products/:id", (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted" });
    });
});




// Start the server
app.listen(port, () => {
    console.log(`🚀 Merxpress Server running on http://localhost:${port}`);
});

