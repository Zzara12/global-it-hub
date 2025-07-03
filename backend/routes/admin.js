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

// Admin login POST
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      res.status(200).json({ success: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

module.exports = router;
