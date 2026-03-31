const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://student_tasks_db_s201_user:2eMBsPNteJUcWiogjUGkvWCjiiYC7fVn@dpg-d75uu57pm1nc73cljhhg-a.singapore-postgres.render.com/student_tasks_db_s201',
    ssl: {
        rejectUnauthorized: false
    }
});
pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT
  );
`, (err, res) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table is ready!');
    }
});
// 1. Updated Route to add a task
app.post('/add-task', (req, res) => {
    const { title, desc } = req.body;
    // In Postgres, we use $1, $2 instead of ?
    pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [title, desc], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
});

// 2. Updated Route to delete a task
app.post('/delete-task', (req, res) => {
    const taskId = req.body.id;
    pool.query('DELETE FROM tasks WHERE id = $1', [taskId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
});

// 3. IMPORTANT: Make sure your app.listen looks like this for Render!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
