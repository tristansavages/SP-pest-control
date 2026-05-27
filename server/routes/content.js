const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM content').all();
    const content = {};
    rows.forEach(row => { content[row.key] = row.value; });
    res.json({ success: true, data: { content } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch content.' });
  }
});

router.put('/:key', authMiddleware, (req, res) => {
  const { value } = req.body;
  if (value === undefined) return res.status(400).json({ success: false, error: 'Value is required.' });
  try {
    const existing = db.prepare('SELECT id FROM content WHERE key = ?').get(req.params.key);
    if (existing) {
      db.prepare("UPDATE content SET value = ?, updated_at = datetime('now') WHERE key = ?").run(value, req.params.key);
    } else {
      db.prepare('INSERT INTO content (key, value) VALUES (?, ?)').run(req.params.key, value);
    }
    res.json({ success: true, data: { key: req.params.key, value } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update content.' });
  }
});

module.exports = router;
