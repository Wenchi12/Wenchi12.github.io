import express from 'express';
import dotenv from 'dotenv';
import pool from './config/database.js';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { generateToken, authenticateToken } from './middleware/auth.js';
import { sendQuoteEmail } from './utils/email.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// user authentication routes
app.post('/api/auth/signup', async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (full_name,email,phone,password) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
      [fullName, email, phone || '', hash]
    );
    const userId = result.insertId;
    const token = generateToken({ id: userId, email });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'signup error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken({ id: user.id, email: user.email });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'login error' });
  }
});

// simple calculate endpoint
app.post('/api/quotes/calculate', async (req, res) => {
  const { vehicleType, marketValue, coverageType } = req.body;
  const baseRate = 0.05;
  let multiplier = 1;
  if (vehicleType === 'Truck') multiplier += 0.3;
  if (vehicleType === 'Motorcycle') multiplier += 0.5;
  if (coverageType === 'Comprehensive') multiplier += 0.5;
  if (coverageType === 'Third Party Fire & Theft') multiplier += 0.25;
  const premium = marketValue * baseRate * multiplier;
  res.json({ premium: Math.round(premium*100)/100, currency: 'ZMW', details:{baseRate,multiplier} });
});

// save quote (authenticated users only)
app.post('/api/quotes', authenticateToken, async (req, res) => {
  // user id comes from token payload
  const userId = req.user.id;
  const { vehicleType, marketValue, plateNumber, coverageType, premium } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // ensure user exists and get their info
    const [userRows] = await conn.query('SELECT id,email,full_name FROM users WHERE id=?', [userId]);
    if (!userRows || !userRows.length) {
      await conn.rollback();
      return res.status(400).json({ error: 'invalid user' });
    }
    const user = userRows[0];

    const [vehRows] = await conn.query(
      'INSERT INTO vehicles (user_id,vehicle_type,plate_number,market_value) VALUES (?,?,?,?)',
      [userId, vehicleType, plateNumber, marketValue]
    );
    const vehicleId = vehRows.insertId;
    const [quoteRows] = await conn.query(
      'INSERT INTO quotes (user_id,vehicle_id,coverage_type,premium) VALUES (?,?,?,?)',
      [userId, vehicleId, coverageType, premium]
    );
    await conn.commit();
    // send email notification (async, don't block)
    try {
      sendQuoteEmail(user.email, {
        fullName: user.full_name,
        vehicleType,
        marketValue,
        coverageType,
        premium
      }).catch(console.error);
    } catch (e) {
      console.error('email send failed', e);
    }
    res.json({ quoteId: quoteRows.insertId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'db error' });
  } finally { conn.release(); }
});

// mark quote paid (called after successful payment)
app.post('/api/quotes/:id/paid', authenticateToken, async (req,res)=>{
  const quoteId = req.params.id;
  const { reference } = req.body; // payment ref
  try {
    const [result] = await pool.query(
      'UPDATE quotes SET status=?, paid_reference=? WHERE id=?',
      ['paid', reference || '', quoteId]
    );
    if(result.affectedRows) return res.json({ success: true });
    else return res.status(404).json({ error: 'quote not found' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// simple retrieval
app.get('/api/quotes/:id', async (req,res)=>{
  const [rows] = await pool.query(
    `SELECT q.*,u.full_name,u.email,v.vehicle_type,v.market_value
     FROM quotes q
     JOIN users u ON q.user_id=u.id
     JOIN vehicles v ON q.vehicle_id=v.id
     WHERE q.id=?`, [req.params.id]
  );
  if(rows.length) res.json(rows[0]); else res.status(404).json({error:'not found'});
});

// payment initialization (Paystack or other gateway)
app.post('/api/payments/initialize', authenticateToken, async (req, res) => {
  const { amount, email } = req.body;
  if (!amount || !email) return res.status(400).json({ error: 'amount and email required' });
  try {
    // include optional metadata (e.g. quoteId) so webhook can relate payment to quote
    const metadata = req.body.metadata || {};
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYMENT_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // convert to kobo/cents
        currency: 'ZMW',
        metadata
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('payment init error', err);
    res.status(500).json({ error: 'payment init failed' });
  }
});

// Paystack webhook handler - verify signature and update quote status
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'] || req.headers['x-paystack-signature'.toLowerCase()];
    const secret = process.env.PAYMENT_SECRET_KEY || '';
    const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');
    if (signature !== hash) {
      console.warn('Invalid Paystack signature');
      return res.status(400).send('invalid signature');
    }
    const event = JSON.parse(req.body.toString());
    // handle successful charge
    if (event.event === 'charge.success' && event.data) {
      const ref = event.data.reference;
      const metadata = event.data.metadata || {};
      const quoteId = metadata.quoteId || metadata.quote_id;
      try {
        if (quoteId) {
          await pool.query('UPDATE quotes SET status=?, paid_reference=? WHERE id=?', ['paid', ref, quoteId]);
        }
      } catch (e) {
        console.error('Failed to update quote on webhook', e);
      }
    }
    // respond with 200 quickly
    res.json({ received: true });
  } catch (err) {
    console.error('webhook error', err);
    res.status(500).send('error');
  }
});

// Verify transaction with Paystack and reconcile
app.get('/api/payments/verify/:reference', authenticateToken, async (req, res) => {
  const reference = req.params.reference;
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYMENT_SECRET_KEY}` }
    });
    const data = await response.json();
    if (!data || !data.status) return res.status(400).json({ error: 'verification failed', detail: data });
    const d = data.data;
    // if successful, update quote if metadata contains quoteId
    if (d && d.status === 'success') {
      const metadata = d.metadata || {};
      const quoteId = metadata.quoteId || metadata.quote_id;
      if (quoteId) {
        try {
          // idempotent update
          await pool.query('UPDATE quotes SET status=?, paid_reference=? WHERE id=? AND status<>?', ['paid', reference, quoteId, 'paid']);
        } catch (e) {
          console.error('Failed to update quote during verify', e);
        }
      }
    }
    res.json({ verified: d.status, data });
  } catch (err) {
    console.error('verify error', err);
    res.status(500).json({ error: 'verify error' });
  }
});

// reconcile recent transactions - fetch from Paystack and update any matching quote metadata
app.post('/api/payments/reconcile', authenticateToken, async (req, res) => {
  const { from, to, status } = req.body || {}; // optional filters
  try {
    // build query params
    let url = 'https://api.paystack.co/transaction';
    const params = [];
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (from) params.push(`from=${encodeURIComponent(from)}`); // unix timestamp
    if (to) params.push(`to=${encodeURIComponent(to)}`);
    if (params.length) url += '?' + params.join('&');
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.PAYMENT_SECRET_KEY}` }
    });
    const data = await response.json();
    if (!data || !data.status) return res.status(400).json({ error: 'fetch failed', detail: data });
    const transactions = data.data;
    let updated = 0;
    for (const tx of transactions) {
      if (tx.status === 'success' && tx.metadata) {
        const quoteId = tx.metadata.quoteId || tx.metadata.quote_id;
        if (quoteId) {
          const ref = tx.reference;
          const [result] = await pool.query(
            'UPDATE quotes SET status=?, paid_reference=? WHERE id=? AND status<>?',
            ['paid', ref, quoteId, 'paid']
          );
          if (result.affectedRows) updated++;
        }
      }
    }
    res.json({ reconciled: updated, checked: transactions.length });
  } catch (err) {
    console.error('reconcile error', err);
    res.status(500).json({ error: 'reconcile error' });
  }
});

// admin get all quotes (requires token)
app.get('/api/admin/quotes', authenticateToken, async (req,res)=>{
  try {
    const [rows] = await pool.query(
      `SELECT q.id,q.premium,q.coverage_type,q.status,q.paid_reference,q.created_at,u.full_name,u.email,v.vehicle_type,v.market_value
       FROM quotes q
       JOIN users u ON q.user_id=u.id
       JOIN vehicles v ON q.vehicle_id=v.id
       ORDER BY q.created_at DESC
       LIMIT 1000`
    );
    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({error:'db error'});
  }
});

const PORT = process.env.PORT||4000;
app.listen(PORT,()=>console.log('🚀 API up on port',PORT));
