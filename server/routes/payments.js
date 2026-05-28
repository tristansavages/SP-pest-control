const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const GATEWAY = process.env.PAYMENT_GATEWAY || 'payfast';
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || '';
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || '';
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || '';
const PAYFAST_SANDBOX = process.env.PAYFAST_SANDBOX !== 'false';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

function generatePfSignature(data, passPhrase) {
  const keys = Object.keys(data).sort();
  let pfStr = '';
  keys.forEach(key => {
    const val = data[key];
    if (val !== '' && val !== null && val !== undefined && key !== 'signature') {
      pfStr += `${key}=${encodeURIComponent(String(val).trim()).replace(/%20/g, '+')}&`;
    }
  });
  pfStr = pfStr.slice(0, -1);
  if (passPhrase) pfStr += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  return crypto.createHash('md5').update(pfStr).digest('hex');
}

function generateReference() {
  return `SP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// POST /api/payments/create
router.post('/create', (req, res) => {
  const { booking_id, amount, item_name, item_description, name_first, name_last, email_address, payment_type } = req.body;
  if (!booking_id || !amount) {
    return res.status(400).json({ success: false, error: 'booking_id and amount are required.' });
  }
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });

  const merchant_reference = generateReference();
  const parsedAmount = parseFloat(amount);

  try {
    db.prepare(`
      INSERT INTO payments (booking_id, amount, gateway, payment_type, merchant_reference, item_name, item_description, name_first, name_last, email_address, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      booking_id, parsedAmount, GATEWAY,
      payment_type || 'once_off', merchant_reference,
      item_name || `Pest Control Service — Booking #${booking_id}`,
      item_description || '',
      name_first || '', name_last || '', email_address || ''
    );

    db.prepare(`UPDATE bookings SET payment_status = 'pending', payment_reference = ?, total_amount = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(merchant_reference, parsedAmount, booking_id);

    const isPfConfigured = PAYFAST_MERCHANT_ID && PAYFAST_MERCHANT_KEY;

    if (GATEWAY === 'payfast' && isPfConfigured) {
      const pfData = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: `${APP_URL}/payment/success?ref=${merchant_reference}`,
        cancel_url: `${APP_URL}/payment/cancelled?ref=${merchant_reference}`,
        notify_url: `${APP_URL}/api/payments/webhook`,
        m_payment_id: merchant_reference,
        amount: parsedAmount.toFixed(2),
        item_name: item_name || 'Pest Control Service',
        item_description: item_description || `Booking #${booking_id}`,
        name_first: name_first || '',
        name_last: name_last || '',
        email_address: email_address || '',
      };

      // Remove blank fields (PayFast rejects empty params in signature)
      Object.keys(pfData).forEach(k => {
        if (pfData[k] === '' || pfData[k] === null || pfData[k] === undefined) delete pfData[k];
      });

      pfData.signature = generatePfSignature(pfData, PAYFAST_PASSPHRASE || null);

      const pfUrl = PAYFAST_SANDBOX
        ? 'https://sandbox.payfast.co.za/eng/process'
        : 'https://www.payfast.co.za/eng/process';

      return res.json({ success: true, data: { gateway: 'payfast', url: pfUrl, fields: pfData, merchant_reference } });
    }

    // Gateway not configured — return manual fallback
    return res.json({
      success: true,
      data: { gateway: 'manual', merchant_reference, amount: parsedAmount },
    });
  } catch (err) {
    console.error('Payment create error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to create payment record.' });
  }
});

// POST /api/payments/webhook  (PayFast ITN)
router.post('/webhook', (req, res) => {
  try {
    const data = req.body;
    const receivedSignature = data.signature;
    const merchantReference = data.m_payment_id;

    if (!merchantReference) return res.status(400).send('Missing reference');

    const payment = db.prepare('SELECT * FROM payments WHERE merchant_reference = ?').get(merchantReference);
    if (!payment) return res.status(404).send('Payment not found');

    // Verify signature
    const verifyData = { ...data };
    delete verifyData.signature;
    const expectedSignature = generatePfSignature(verifyData, PAYFAST_PASSPHRASE || null);

    if (receivedSignature !== expectedSignature) {
      console.error('PayFast ITN signature mismatch for ref:', merchantReference);
      return res.status(400).send('Invalid signature');
    }

    const newStatus = data.payment_status === 'COMPLETE' ? 'complete' : 'failed';
    db.prepare(`UPDATE payments SET status = ?, pf_payment_id = ?, gateway_data = ?, updated_at = datetime('now') WHERE merchant_reference = ?`)
      .run(newStatus, data.pf_payment_id || null, JSON.stringify(data), merchantReference);

    const bookingPaymentStatus = newStatus === 'complete' ? 'paid' : 'failed';
    db.prepare(`UPDATE bookings SET payment_status = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(bookingPaymentStatus, payment.booking_id);

    if (newStatus === 'complete') {
      db.prepare(`UPDATE bookings SET status = 'scheduled', updated_at = datetime('now') WHERE id = ? AND status = 'new'`)
        .run(payment.booking_id);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).send('Error');
  }
});

// GET /api/payments/revenue-summary  (admin)
router.get('/revenue-summary', authMiddleware, (req, res) => {
  try {
    const total_revenue = db.prepare("SELECT COALESCE(SUM(amount), 0) as v FROM payments WHERE status = 'complete'").get().v;
    const total_paid = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'complete'").get().c;
    const total_pending = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'pending'").get().c;
    const total_failed = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status IN ('failed','cancelled')").get().c;
    const revenue_today = db.prepare("SELECT COALESCE(SUM(amount), 0) as v FROM payments WHERE status = 'complete' AND date(created_at) = date('now')").get().v;
    const revenue_month = db.prepare("SELECT COALESCE(SUM(amount), 0) as v FROM payments WHERE status = 'complete' AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get().v;
    const recent_payments = db.prepare(`
      SELECT p.*, b.full_name, b.phone FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      ORDER BY p.created_at DESC LIMIT 5
    `).all();
    res.json({ success: true, data: { total_revenue, total_paid, total_pending, total_failed, revenue_today, revenue_month, recent_payments } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch revenue summary.' });
  }
});

// GET /api/payments  (admin)
router.get('/', authMiddleware, (req, res) => {
  try {
    const payments = db.prepare(`
      SELECT p.*, b.full_name, b.phone, b.address, b.pest_problem, b.customer_type, b.service_category
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      ORDER BY p.created_at DESC
    `).all();
    res.json({ success: true, data: { payments } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch payments.' });
  }
});

// GET /api/payments/:id  (admin)
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const payment = db.prepare(`
      SELECT p.*, b.full_name, b.phone, b.address, b.pest_problem, b.service_category
      FROM payments p LEFT JOIN bookings b ON p.booking_id = b.id
      WHERE p.id = ?
    `).get(req.params.id);
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found.' });
    res.json({ success: true, data: { payment } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch payment.' });
  }
});

// PUT /api/payments/:id  (admin — manual status update)
router.put('/:id', authMiddleware, (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['pending', 'complete', 'failed', 'cancelled'];
  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value.' });
  }
  try {
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found.' });

    db.prepare(`UPDATE payments SET status = COALESCE(?, status), updated_at = datetime('now') WHERE id = ?`)
      .run(status || null, req.params.id);

    if (status === 'complete') {
      db.prepare(`UPDATE bookings SET payment_status = 'paid', updated_at = datetime('now') WHERE id = ?`).run(payment.booking_id);
    } else if (status === 'failed' || status === 'cancelled') {
      db.prepare(`UPDATE bookings SET payment_status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, payment.booking_id);
    }

    const updated = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: { payment: updated } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update payment.' });
  }
});

module.exports = router;
