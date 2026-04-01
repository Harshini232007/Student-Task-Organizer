const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 1. Database Connection Settings
const pool = new Pool({
    connectionString: 'postgresql://student_tasks_db_s201_user:2eMBsPNteJUcWiogjUGkvWCjiiYC7fVn@dpg-d75uu57pm1nc73cljhhg-a.singapore-postgres.render.com/student_tasks_db_s201',
    ssl: {
        rejectUnauthorized: false
    }
});

// 2. Automatic Table Creation
pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT
    );`, (err, res) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table is ready!');
    }
});

// 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 4. Routes
app.get('/tasks', (req, res) => {
    pool.query('SELECT * FROM tasks ORDER BY id ASC', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result.rows);
    });
});

app.post('/add-task', (req, res) => {
    const { title, desc } = req.body;
    pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [title, desc], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.post('/delete-task', (req, res) => {
    const { taskId } = req.body;
    pool.query('DELETE FROM tasks WHERE id = $1', [taskId], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
