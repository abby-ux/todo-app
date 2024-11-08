// server/database.js
const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const db = new sqlite3.Database('tasks.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        createTable();
    }
});

// Create tasks table if it doesn't exist
function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0
        )
    `;
    
    db.run(sql, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Tasks table created or already exists');
        }
    });
}

module.exports = db;