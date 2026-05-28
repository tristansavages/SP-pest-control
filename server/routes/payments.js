const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const { generatePayFastSignature } = require('../utils/payfastSignature');

const IS_DEV = process.env.NODE_ENV !== 'production';

// Env vars — support both new names and legacy fallbacks
const PAYFAST_MERCHANT_ID  = process.env.PAYFAST_MERCHANT_ID  || '';
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || '';
const PAYFAST_PASSPHRASE   = process.env.PAYFAST_PASSPHRASE   || '';

// PAYFAST_MODE: sandbox | live  (fallback: derive from legacy PAYFAST_SANDBOX)
const PAYFAST_MODE = process.env.PAYFAST_MODE
  || (process.env.PAYFAST_SANDBOX === 'false' ? 'live' : 'sandbox');

// FRONTEND_URL — used for return_url and cancel_url
// BACKEND_URL  — used for notify_url (must be publicly reachable)
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:5173';
const BACKEND_URL  = process.env.BACKEND_URL  || process.env.APP_URL || 'http://localhost:5000';

const PAYFAST_PROCESS_URL = PAYFAST_MODE === 'live'
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPayFastAmount(amount) {
  return parseFloat(amount).toFixed(2);
}

function generateReference() {
  return `SP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function isPfConfigured() {
  return !!(PAYFAST_MERCHANT_ID && PAYFAST_MERCHANT_KEY);
}

/**
 * Build the PayFast payload in the official PayFast field order.
 * Only populate fields that carry a real value.
 * All values are plain strings — nothing is pre-encoded here.
 * The signature function handles encoding.
 *
 * Official order:
 *   merchant_id, merchant_key,
 *   return_url, cancel_url, notify_url,
 *   name_first, name_last, email_address, cell_number,
 *   m_payment_id, amount,
 *   item_name, item_description,
 *   custom_int1-5, custom_str1-5,
 *   email_confirmation, confirmation_address, payment_method
 */
function buildPfPayload({ merchantReference, parsedAmount, itemName, itemDescription, nameFirst, nameLast, emailAddress }) {
  const payload = {};

  // Merchant credentials
  payload.merchant_id  = PAYFAST_MERCHANT_ID;
  payload.merchant_key = PAYFAST_MERCHANT_KEY;

  // Redirect URLs
  payload.return_url = `${FRONTEND_URL}/payment/success?ref=${merchantReference}`;
  payload.cancel_url = `${FRONTEND_URL}/payment/cancelled?ref=${merchantReference}`;
  payload.notify_url = `${BACKEND_URL}/api/payments/webhook`;

  // Customer info — must come before payment details per PayFast spec
  if (nameFirst && String(nameFirst).trim())     payload.name_first    = String(nameFirst).trim();
  if (nameLast  && String(nameLast).trim())      payload.name_last     = String(nameLast).trim();
  if (emailAddress && String(emailAddress).trim()) payload.email_address = String(emailAddress).trim();

  // Payment details
  payload.m_payment_id = merchantReference;
  payload.amount       = formatPayFastAmount(parsedAmount);

  // item_name: strip em/en dashes (avoid multi-byte encoding edge cases), max 100 chars
  const cleanItemName = String(itemName || 'Pest Control Service')
    .replace(/[—–]/g, '-')
    .trim()
    .substring(0, 100);
  payload.item_name = cleanItemName;

  if (itemDescription && String(itemDescription).trim()) {
    payload.item_description = String(itemDescription).trim().substring(0, 255);
  }

  return payload;
}

// ─── routes ─────────────────────────────────────────────────────────────────

// GET /api/payments/debug-signature  (development only)
router.get('/debug-signature', (req, res) => {
  if (!IS_DEV) return res.status(404).json({ error: 'Not found' });

  const testRef = 'SP-DEBUG-000000';

  const payload = buildPfPayload({
    merchantReference: testRef,
    parsedAmount:      120,
    itemName:          'RoachGuard 360 - First Month Payment',
    itemDescription:   'Booking #1 | Cockroaches',
    nameFirst:         'Test',
    nameLast:          'User',
    emailAddress:      'test@example.com',
  });

  // Rebuild the query string the same way the signature function does
  const { payfastEncode } = require('../utils/payfastSignature');
  const filteredKeys = Object.keys(payload).filter(k => {
    const v = payload[k];
    return v !== null && v !== undefined && v !== '' && k !== 'signature';
  });
  const sigString = filteredKeys
    .map(k => `${k}=${payfastEncode(String(payload[k]).trim())}`)
    .join('&')
    + (PAYFAST_PASSPHRASE && PAYFAST_PASSPHRASE.trim()
      ? `&passphrase=${payfastEncode(PAYFAST_PASSPHRASE.trim())}`
      : '');

  const signature = generatePayFastSignature(payload, PAYFAST_PASSPHRASE || '');

  res.json({
    mode:             PAYFAST_MODE,
    process_url:      PAYFAST_PROCESS_URL,
    frontend_url:     FRONTEND_URL,
    backend_url:      BACKEND_URL,
    configured:       isPfConfigured(),
    merchant_id:      PAYFAST_MERCHANT_ID || '(not set)',
    merchant_key_set: !!PAYFAST_MERCHANT_KEY,
    passphrase_set:   !!(PAYFAST_PASSPHRASE && PAYFAST_PASSPHRASE.trim()),
    payload,
    signature_string: sigString,
    signature,
  });
});

// POST /api/payments/create
router.post('/create', (req, res) => {
  const {
    booking_id, amount,
    item_name, item_description,
    name_first, name_last, email_address,
    payment_type,
  } = req.body;

  if (!booking_id || !amount) {
    return res.status(400).json({ success: false, error: 'booking_id and amount are required.' });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });

  if (!isPfConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'PayFast is not configured correctly. Please check PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY.',
    });
  }

  const merchantReference = generateReference();
  const parsedAmount      = parseFloat(amount);

  try {
    db.prepare(`
      INSERT INTO payments (booking_id, amount, gateway, payment_type, merchant_reference, item_name, item_description, name_first, name_last, email_address, status)
      VALUES (?, ?, 'payfast', ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      booking_id,
      parsedAmount,
      payment_type || 'once_off',
      merchantReference,
      item_name  || `Pest Control Service - Booking #${booking_id}`,
      item_description || '',
      name_first  || '',
      name_last   || '',
      email_address || '',
    );

    db.prepare(`UPDATE bookings SET payment_status = 'pending', payment_reference = ?, total_amount = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(merchantReference, parsedAmount, booking_id);

    // Step 1: build payload in the correct PayFast field order
    const pfPayload = buildPfPayload({
      merchantReference,
      parsedAmount,
      itemName:        item_name,
      itemDescription: item_description,
      nameFirst:       name_first,
      nameLast:        name_last,
      emailAddress:    email_address,
    });

    if (IS_DEV) {
      console.log('[PayFast] Mode        :', PAYFAST_MODE);
      console.log('[PayFast] Process URL :', PAYFAST_PROCESS_URL);
      console.log('[PayFast] Payload     :', { ...pfPayload, merchant_key: '***' });
    }

    // Step 2: generate signature from the EXACT payload that will be submitted
    // Nothing is added to or removed from pfPayload after this line
    pfPayload.signature = generatePayFastSignature(pfPayload, PAYFAST_PASSPHRASE || '');

    if (IS_DEV) {
      console.log('[PayFast] Signature   :', pfPayload.signature);
    }

    // Step 3: return the complete signed payload to the frontend
    return res.json({
      success: true,
      data: {
        gateway:            'payfast',
        url:                PAYFAST_PROCESS_URL,
        fields:             pfPayload,
        merchant_reference: merchantReference,
      },
    });
  } catch (err) {
    console.error('Payment create error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to create payment record.' });
  }
});

// POST /api/payments/webhook  (PayFast ITN)
router.post('/webhook', (req, res) => {
  try {
    const data              = req.body;
    const receivedSignature = data.signature;
    const merchantReference = data.m_payment_id;

    if (!merchantReference) return res.status(400).send('Missing reference');

    const payment = db.prepare('SELECT * FROM payments WHERE merchant_reference = ?').get(merchantReference);
    if (!payment) return res.status(404).send('Payment not found');

    // Verify ITN signature — req.body preserves field order from PayFast
    const verifyData = { ...data };
    delete verifyData.signature;
    const expectedSignature = generatePayFastSignature(verifyData, PAYFAST_PASSPHRASE || '');

    if (receivedSignature !== expectedSignature) {
      console.error('[PayFast] ITN mismatch | ref:', merchantReference,
        '| received:', receivedSignature, '| expected:', expectedSignature);
      return res.status(400).send('Invalid signature');
    }

    const newStatus        = data.payment_status === 'COMPLETE' ? 'complete' : 'failed';
    const bookingPmtStatus = newStatus === 'complete' ? 'paid' : 'failed';

    db.prepare(`UPDATE payments SET status = ?, pf_payment_id = ?, gateway_data = ?, updated_at = datetime('now') WHERE merchant_reference = ?`)
      .run(newStatus, data.pf_payment_id || null, JSON.stringify(data), merchantReference);

    db.prepare(`UPDATE bookings SET payment_status = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(bookingPmtStatus, payment.booking_id);

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
    const total_revenue  = db.prepare("SELECT COALESCE(SUM(amount), 0) as v FROM payments WHERE status = 'complete'").get().v;
    const total_paid     = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'complete'").get().c;
    const total_pending  = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'pending'").get().c;
    const total_failed   = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status IN ('failed','cancelled')").get().c;
    const revenue_today  = db.prepare("SELECT COALESCE(SUM(amount), 0) as v FROM payments WHERE status = 'complete' AND date(created_at) = date('now')").get().v;
    const revenue_month  = db.prepare("SELECT COALESCE(SUM(amount), 0) as v FROM payments WHERE status = 'complete' AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get().v;
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
