const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials WHERE active = 1 ORDER BY created_at DESC').all();
    res.json({ success: true, data: { testimonials } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch testimonials.' });
  }
});

router.get('/all', authMiddleware, (req, res) => {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
    res.json({ success: true, data: { testimonials } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch testimonials.' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  const { name, location, rating, review, active } = req.body;
  if (!name || !review) return res.status(400).json({ success: false, error: 'Name and review are required.' });
  try {
    const result = db.prepare('INSERT INTO testimonials (name, location, rating, review, active) VALUES (?, ?, ?, ?, ?)').run(name, location || null, rating || 5, review, active !== undefined ? (active ? 1 : 0) : 1);
    const testimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { testimonial } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create testimonial.' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, location, rating, review, active } = req.body;
  try {
    const t = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
    if (!t) return res.status(404).json({ success: false, error: 'Testimonial not found.' });
    db.prepare(`
      UPDATE testimonials SET
        name = COALESCE(?, name),
        location = CASE WHEN ? IS NOT NULL THEN ? ELSE location END,
        rating = COALESCE(?, rating),
        review = COALESCE(?, review),
        active = COALESCE(?, active)
      WHERE id = ?
    `).run(name || null, location !== undefined ? location : null, location !== undefined ? location : null, rating || null, review || null, active !== undefined ? (active ? 1 : 0) : null, req.params.id);
    const updated = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: { testimonial: updated } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update testimonial.' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const t = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
    if (!t) return res.status(404).json({ success: false, error: 'Testimonial not found.' });
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: { message: 'Testimonial deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete testimonial.' });
  }
});

module.exports = router;
