require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
    //connectionString: process.env.DATABASE_URL,
    connectionString: process.env.POSTGRES_URL,
});

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// 📝 **Routes**
// ✅ Get all products
app.get("/products", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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



// ✅ Add a new todo
// app.post("/products", async (req, res) => {
//     try {
//         const { title } = req.body;
//         const result = await pool.query("INSERT INTO products (title) VALUES ($1) RETURNING *", [title]);
//         res.json(result.rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// ✅ Update a todo (mark as completed)
// app.put("/products/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { completed } = req.body;
//         const result = await pool.query("UPDATE products SET completed = $1 WHERE id = $2 RETURNING *", [completed, id]);
//         res.json(result.rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// ✅ Delete a todo
app.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`🚀 Postgres Server running on http://localhost:${port}`);
});

