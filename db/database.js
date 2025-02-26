const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database (creates file if not exists)
const db = new sqlite3.Database("./db/todo.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("❌ Database Connection Error:", err.message);
    } else {
        console.log("✅ Connected to SQLite Database.");
    }
});

// Create the todos table if not exists
db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
)`);

module.exports = db;
