// src/routes/user.routes.js
const express = require('express');
const router = express.Router();

// Sample route
router.get('/users', (req, res) => {
  res.json({ message: 'User route working' });
});

module.exports = router;
