const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  try {
    const images = db.prepare('SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC').all();
    res.json({ success: true, data: { images } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch gallery.' });
  }
});

router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'Image file is required.' });
  const { title, alt_text, featured, display_order } = req.body;
  try {
    const result = db.prepare('INSERT INTO gallery (filename, title, alt_text, featured, display_order) VALUES (?, ?, ?, ?, ?)').run(req.file.filename, title || null, alt_text || null, featured ? 1 : 0, display_order || 0);
    const image = db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { image } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save image.' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { title, alt_text, featured, display_order } = req.body;
  try {
    const image = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id);
    if (!image) return res.status(404).json({ success: false, error: 'Image not found.' });
    db.prepare(`
      UPDATE gallery SET
        title = CASE WHEN ? IS NOT NULL THEN ? ELSE title END,
        alt_text = CASE WHEN ? IS NOT NULL THEN ? ELSE alt_text END,
        featured = COALESCE(?, featured),
        display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).run(title !== undefined ? title : null, title !== undefined ? title : null, alt_text !== undefined ? alt_text : null, alt_text !== undefined ? alt_text : null, featured !== undefined ? (featured ? 1 : 0) : null, display_order !== undefined ? display_order : null, req.params.id);
    const updated = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: { image: updated } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update image.' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const image = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id);
    if (!image) return res.status(404).json({ success: false, error: 'Image not found.' });
    const filePath = path.join(__dirname, '../uploads', image.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: { message: 'Image deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete image.' });
  }
});

module.exports = router;
