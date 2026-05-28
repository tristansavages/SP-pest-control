const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const industries = db.prepare('SELECT * FROM industries WHERE active = 1 ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, data: { industries } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch industries.' });
  }
});

router.get('/all', authMiddleware, (req, res) => {
  try {
    const industries = db.prepare('SELECT * FROM industries ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, data: { industries } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch industries.' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  const { name, slug, description, common_pests, icon, cta_text, active, display_order } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'Industry name is required.' });
  const slugVal = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  try {
    const result = db.prepare(`
      INSERT INTO industries (name, slug, description, common_pests, icon, cta_text, active, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      slugVal,
      description || null,
      common_pests || null,
      icon || null,
      cta_text || 'Request Industry Plan',
      active !== undefined ? (active ? 1 : 0) : 1,
      display_order !== undefined ? display_order : 0
    );
    const industry = db.prepare('SELECT * FROM industries WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { industry } });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, error: 'An industry with this slug already exists.' });
    }
    res.status(500).json({ success: false, error: 'Failed to create industry.' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, slug, description, common_pests, icon, cta_text, active, display_order } = req.body;
  try {
    const industry = db.prepare('SELECT * FROM industries WHERE id = ?').get(req.params.id);
    if (!industry) return res.status(404).json({ success: false, error: 'Industry not found.' });
    db.prepare(`
      UPDATE industries SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = CASE WHEN ? IS NOT NULL THEN ? ELSE description END,
        common_pests = CASE WHEN ? IS NOT NULL THEN ? ELSE common_pests END,
        icon = COALESCE(?, icon),
        cta_text = COALESCE(?, cta_text),
        active = COALESCE(?, active),
        display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).run(
      name || null,
      slug || null,
      description !== undefined ? description : null,
      description !== undefined ? description : null,
      common_pests !== undefined ? common_pests : null,
      common_pests !== undefined ? common_pests : null,
      icon || null,
      cta_text || null,
      active !== undefined ? (active ? 1 : 0) : null,
      display_order !== undefined ? display_order : null,
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM industries WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: { industry: updated } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update industry.' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const industry = db.prepare('SELECT * FROM industries WHERE id = ?').get(req.params.id);
    if (!industry) return res.status(404).json({ success: false, error: 'Industry not found.' });
    db.prepare('DELETE FROM industries WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: { message: 'Industry deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete industry.' });
  }
});

module.exports = router;
