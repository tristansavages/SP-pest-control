const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'sppestcontrol_super_secret_jwt_key_2024_change_in_production',
      { expiresIn: '7d' }
    );
    res.json({ success: true, data: { token, user: { id: user.id, email: user.email, name: user.name } } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

router.get('/verify', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(401).json({ success: false, error: 'User not found.' });
    res.json({ success: true, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

module.exports = router;
