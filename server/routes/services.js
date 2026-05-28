const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services WHERE active = 1 ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, data: { services } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch services.' });
  }
});

router.get('/all', authMiddleware, (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, data: { services } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch services.' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  const { name, slug, description, icon, category, active, display_order } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'Service name is required.' });
  const slugVal = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  try {
    const result = db.prepare('INSERT INTO services (name, slug, description, icon, category, active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      name,
      slugVal,
      description || null,
      icon || 'Bug',
      category || 'both',
      active !== undefined ? (active ? 1 : 0) : 1,
      display_order || 0
    );
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { service } });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) return res.status(409).json({ success: false, error: 'A service with this slug already exists.' });
    res.status(500).json({ success: false, error: 'Failed to create service.' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, slug, description, icon, category, active, display_order } = req.body;
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });
    db.prepare(`
      UPDATE services SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = CASE WHEN ? IS NOT NULL THEN ? ELSE description END,
        icon = COALESCE(?, icon),
        category = COALESCE(?, category),
        active = COALESCE(?, active),
        display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).run(
      name || null,
      slug || null,
      description !== undefined ? description : null,
      description !== undefined ? description : null,
      icon || null,
      category || null,
      active !== undefined ? (active ? 1 : 0) : null,
      display_order !== undefined ? display_order : null,
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: { service: updated } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update service.' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: { message: 'Service deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete service.' });
  }
});

module.exports = router;
