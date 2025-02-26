require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/database");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 📝 **Routes**
// ✅ Get all todos
app.get("/todos", (req, res) => {
    db.all("SELECT * FROM todos ORDER BY id ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ✅ Add a new todo
app.post("/todos", (req, res) => {
    const { title } = req.body;
    db.run("INSERT INTO todos (title) VALUES (?)", [title], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, completed: false });
    });
});

// ✅ Update a todo (toggle complete)
app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.run("UPDATE todos SET completed = ? WHERE id = ?", [completed, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Todo updated" });
    });
});

// ✅ Delete a todo
app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Todo deleted" });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
