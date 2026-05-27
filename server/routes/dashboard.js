const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.get('/stats', authMiddleware, (req, res) => {
  try {
    const total_bookings = db.prepare('SELECT COUNT(*) as c FROM bookings').get().c;
    const new_bookings = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'new'").get().c;
    const completed_bookings = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'completed'").get().c;
    const urgent_bookings = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE urgency IN ('urgent','emergency') AND status NOT IN ('completed','cancelled')").get().c;
    const unread_contacts = db.prepare('SELECT COUNT(*) as c FROM contacts WHERE read = 0').get().c;
    const active_services = db.prepare('SELECT COUNT(*) as c FROM services WHERE active = 1').get().c;
    const bookings_today = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE date(created_at) = date('now')").get().c;
    const whatsapp_enquiries = db.prepare('SELECT COUNT(*) as c FROM bookings WHERE whatsapp_sent = 1').get().c;
    const recent_bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10').all();

    res.json({
      success: true,
      data: {
        stats: { total_bookings, new_bookings, completed_bookings, urgent_bookings, unread_contacts, active_services, bookings_today, whatsapp_enquiries },
        recent_bookings,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats.' });
  }
});

module.exports = router;
