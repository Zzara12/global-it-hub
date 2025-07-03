const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Frontend & Uploads
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/jobs', require('./routes/jobs'));

// Redirect root to homepage
app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
