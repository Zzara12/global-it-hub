const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Storage Config for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST /api/careers/apply
router.post('/apply', upload.single('resume'), (req, res) => {
  const { name, email, position } = req.body;
  const file = req.file;

  console.log("📥 Form Data:", req.body);
  console.log("📎 Uploaded File:", file);

  if (!file) {
    return res.status(400).json({ error: 'Resume file missing or invalid!' });
  }

  const resumePath = file.filename;

  db.query(
    'INSERT INTO applicants (name, email, position, resume) VALUES (?, ?, ?, ?)',
    [name, email, position, resumePath],
    (err) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ success: 'Application submitted!' });
    }
  );
});

// GET /api/careers/applicants - For Admin View
router.get('/applicants', (req, res) => {
  db.query('SELECT * FROM applicants ORDER BY submitted_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json(results);
  });
});

module.exports = router;
