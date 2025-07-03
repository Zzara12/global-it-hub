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

// ✅ GET all blog posts
router.get('/', (req, res) => {
  db.query('SELECT * FROM blog_posts ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.status(200).json(results);
  });
});

// ✅ POST new blog post
router.post('/', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content' });
  }

  const query = 'INSERT INTO blog_posts (title, content, created_at) VALUES (?, ?, NOW())';
  db.query(query, [title, content], (err) => {
    if (err) return res.status(500).json({ error: 'Insert failed' });
    res.status(200).json({ success: 'Blog post added' });
  });
});

// ✅ DELETE a blog post
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.status(200).json({ success: 'Blog post deleted' });
  });
});

module.exports = router;
