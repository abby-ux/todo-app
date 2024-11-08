// server/server.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
    const { text, completed } = req.body;
    const sql = 'INSERT INTO tasks (text, completed) VALUES (?, ?)';
    db.run(sql, [text, completed ? 1 : 0], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            id: this.lastID,
            text,
            completed
        });
    });
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
    const { completed } = req.body;
    const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
    db.run(sql, [completed ? 1 : 0, req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: req.params.id, completed });
    });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.run(sql, req.params.id, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Task deleted' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});