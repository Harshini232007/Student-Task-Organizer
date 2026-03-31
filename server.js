const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));  // Serve HTML/CSS

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // XAMPP default
    database: 'tasksdb'
});

db.connect(err => { if (err) console.log(err); else console.log('MySQL Connected'); });

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.send(err);
        res.json(results);
    });
});

app.post('/add-task', (req, res) => {
    const { title, desc } = req.body;
    db.query('INSERT INTO tasks (title, description, done) VALUES (?, ?, 0)', [title, desc], (err) => {
        if (err) return res.send(err);
        res.redirect('/');
    });
});
// Route to delete a task
app.post('/delete-task', (req, res) => {
    const taskId = req.body.id;
    const sql = "DELETE FROM tasks WHERE id = ?";
    db.query(sql, [taskId], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});
app.listen(3000, () => console.log('Server on http://localhost:3000'));
