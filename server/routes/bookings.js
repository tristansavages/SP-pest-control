const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.post('/', (req, res) => {
  const { full_name, phone, email, address, customer_type, service_category, pest_problem, preferred_date, preferred_time, urgency, message, payment_option } = req.body;
  if (!full_name || !phone || !address || !pest_problem) {
    return res.status(400).json({ success: false, error: 'Full name, phone, address, and pest problem are required.' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO bookings (full_name, phone, email, address, customer_type, service_category, pest_problem, preferred_date, preferred_time, urgency, message, payment_option)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      full_name,
      phone,
      email || null,
      address,
      customer_type || 'Residential',
      service_category || null,
      pest_problem,
      preferred_date || null,
      preferred_time || null,
      urgency || 'normal',
      message || null,
      payment_option || 'quote_first'
    );
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { booking } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save booking. Please try again.' });
  }
});

router.get('/', authMiddleware, (req, res) => {
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    const stats = {
      total: db.prepare('SELECT COUNT(*) as c FROM bookings').get().c,
      new: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'new'").get().c,
      contacted: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'contacted'").get().c,
      scheduled: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'scheduled'").get().c,
      completed: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'completed'").get().c,
      cancelled: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'cancelled'").get().c,
      urgent: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE urgency IN ('urgent','emergency') AND status NOT IN ('completed','cancelled')").get().c,
      commercial: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE customer_type IN ('Commercial','Restaurant','School','Retail','Property Manager')").get().c,
      plan_enquiries: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE service_category IS NOT NULL AND service_category != ''").get().c,
    };
    res.json({ success: true, data: { bookings, stats } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch bookings.' });
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });
    res.json({ success: true, data: { booking } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch booking.' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  const { status, internal_notes, whatsapp_sent } = req.body;
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });
    db.prepare(`
      UPDATE bookings SET
        status = COALESCE(?, status),
        internal_notes = CASE WHEN ? IS NOT NULL THEN ? ELSE internal_notes END,
        whatsapp_sent = COALESCE(?, whatsapp_sent),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      status !== undefined ? status : null,
      internal_notes !== undefined ? internal_notes : null,
      internal_notes !== undefined ? internal_notes : null,
      whatsapp_sent !== undefined ? (whatsapp_sent ? 1 : 0) : null,
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: { booking: updated } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update booking.' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });
    db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    res.json({ success: true, data: { message: 'Booking deleted successfully.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete booking.' });
  }
});

module.exports = router;
