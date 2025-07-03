const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// GET all jobs
router.get('/', (req, res) => {
  db.query('SELECT * FROM jobs ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.status(200).json(results);
  });
});

// POST new job
router.post('/', (req, res) => {
  const { title, type, description } = req.body;
  db.query(
    'INSERT INTO jobs (title, type, description) VALUES (?, ?, ?)',
    [title, type, description],
    (err) => {
      if (err) return res.status(500).json({ error: 'Insert failed' });
      res.status(200).json({ success: 'Job added successfully' });
    }
  );
});

// DELETE job
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM jobs WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.status(200).json({ success: 'Job deleted successfully' });
  });
});

module.exports = router;
