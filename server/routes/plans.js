const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const plans = db.prepare('SELECT * FROM protection_plans WHERE active = 1 ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, data: { plans } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch protection plans.' });
  }
});

router.get('/all', authMiddleware, (req, res) => {
  try {
    const plans = db.prepare('SELECT * FROM protection_plans ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, data: { plans } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch protection plans.' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  const { name, slug, tagline, description, frequency, monthly_price, included_visits, extra_callout_cost, features, terms, highlight, active, display_order } = req.body;
  if (!name || monthly_price === undefined || monthly_price === null) {
    return res.status(400).json({ success: false, error: 'Plan name and monthly price are required.' });
  }
  const slugVal = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  try {
    const result = db.prepare(`
      INSERT INTO protection_plans (name, slug, tagline, description, frequency, monthly_price, included_visits, extra_callout_cost, features, terms, highlight, active, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      slugVal,
      tagline || null,
      description || null,
      frequency || null,
      monthly_price,
      included_visits !== undefined ? included_visits : 0,
      extra_callout_cost !== undefined ? extra_callout_cost : 0,
      features || null,
      terms || null,
      highlight !== undefined ? (highlight ? 1 : 0) : 0,
      active !== undefined ? (active ? 1 : 0) : 1,
      display_order !== undefined ? display_order : 0
    );
    const plan = db.prepare('SELECT * FROM protection_plans WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { plan } });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, error: 'A plan with this slug already exists.' });
    }
    res.status(500).json({ success: false, error: 'Failed to create protection plan.' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, slug, tagline, description, frequency, monthly_price, included_visits, extra_callout_cost, features, terms, highlight, active, display_order } = req.body;
  try {
    const plan = db.prepare('SELECT * FROM protection_plans WHERE id = ?').get(req.params.id);
    if (!plan) return res.status(404).json({ success: false, error: 'Protection plan not found.' });
    db.prepare(`
      UPDATE protection_plans SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        tagline = CASE WHEN ? IS NOT NULL THEN ? ELSE tagline END,
        description = CASE WHEN ? IS NOT NULL THEN ? ELSE description END,
        frequency = CASE WHEN ? IS NOT NULL THEN ? ELSE frequency END,
        monthly_price = COALESCE(?, monthly_price),
        included_visits = COALESCE(?, included_visits),
        extra_callout_cost = COALESCE(?, extra_callout_cost),
        features = CASE WHEN ? IS NOT NULL THEN ? ELSE features END,
        terms = CASE WHEN ? IS NOT NULL THEN ? ELSE terms END,
        highlight = COALESCE(?, highlight),
        active = COALESCE(?, active),
        display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).run(
      name || null,
      slug || null,
      tagline !== undefined ? tagline : null,
      tagline !== undefined ? tagline : null,
      description !== undefined ? description : null,
      description !== undefined ? description : null,
      frequency !== undefined ? frequency : null,
      frequency !== undefined ? frequency : null,
      monthly_price !== undefined ? monthly_price : null,
      included_visits !== undefined ? included_visits : null,
      extra_callout_cost !== undefined ? extra_callout_cost : null,
      features !== undefined ? features : null,
      features !== undefined ? features : null,
      terms !== undefined ? terms : null,
      terms !== undefined ? terms : null,
      highlight !== undefined ? (highlight ? 1 : 0) : null,
      active !== undefined ? (active ? 1 : 0) : null,
      display_order !== undefined ? display_order : null,
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM protection_plans WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: { plan: updated } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update protection plan.' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const plan = db.prepare('SELECT * FROM protection_plans WHERE id = ?').get(req.params.id);
    if (!plan) return res.status(404).json({ success: false, error: 'Protection plan not found.' });
    db.prepare('DELETE FROM protection_plans WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: { message: 'Protection plan deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete protection plan.' });
  }
});

module.exports = router;
