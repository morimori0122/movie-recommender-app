const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

app.get('/api/movies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movies');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/api/search', async (req, res) => {
    const search = req.query.title;
    const result = await pool.query(
        'SELECT * FROM movies WHERE title ILIKE $1',
        [`%${search}%`]
    );
    res.json(result.rows);
})

app.get('/api/movies/:id', async (req, res) => {
    const movieId = req.params.id;
    const result = await pool.query('SELECT * FROM movies WHERE movieId = $1', [movieId]);
    res.json(result.rows[0]);
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})