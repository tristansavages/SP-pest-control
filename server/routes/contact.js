const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.post('/', (req, res) => {
  const { name, phone, email, message } = req.body;
  if (!name || !message) return res.status(400).json({ success: false, error: 'Name and message are required.' });
  try {
    const result = db.prepare('INSERT INTO contacts (name, phone, email, message) VALUES (?, ?, ?, ?)').run(name, phone || null, email || null, message);
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { contact } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
});

router.get('/', authMiddleware, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json({ success: true, data: { contacts } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
});

router.put('/:id/read', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE contacts SET read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: { message: 'Marked as read.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update message.' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: { message: 'Message deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete message.' });
  }
});

module.exports = router;
