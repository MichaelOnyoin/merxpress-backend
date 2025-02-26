const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database (creates file if not exists)
const db = new sqlite3.Database("./db/merxpress.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("❌ Database Connection Error:", err.message);
    } else {
        console.log("✅ Connected to SQLite Merxpress Database.");
    }
});

// Create the todos table if not exists
db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price NUMERIC NOT NULL,
        originalPrice NUMERIC,
        discount NUMERIC,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        imageUrl VARCHAR(255) NOT NULL
        
    )`);

module.exports = db;
