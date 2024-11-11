// server/server.js
const express = require('express'); // import express library, web framework for Node.js
const cors = require('cors'); // allows web browser to make requests to server (from frontend or other ports)
const db = require('./database'); // database connection

const app = express(); // create the application
const port = 3000; // server runs on port 3000

// Middleware
app.use(cors()); // allows requests from frontend to backend
app.use(express.json()); // parse JSON data from requests
app.use(express.static('public')); // serve frontend files from the 'public' folder

// Get all tasks, GET route
// get all the tasks from the task table in the database 
app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks'; // select all rows 
    db.all(sql, [], (err, rows) => { // execute the sql query
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows); // send back the rows in a json response
    });
});

// Add a new task
// define a POST route to api/tasks
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