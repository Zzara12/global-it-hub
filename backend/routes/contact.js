const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
require('dotenv').config();

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// POST /api/contact
router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  db.query(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Contact Message',
        html: `<h3>Message from GlobalIT Hub</h3><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b> ${message}</p>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ error: 'Email failed' });
        res.status(200).json({ success: 'Message sent!' });
      });
    }
  );
});

module.exports = router;
