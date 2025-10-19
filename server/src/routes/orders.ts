import express, { Router } from 'express';
import pool from '../db';
import snap from '../midtrans';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/auth';

const router = Router();

// Create an order and request Midtrans snap token
router.post('/', authMiddleware, async (req, res) => {
  const user = (req as any).user;
  const { items } = req.body; // items: [{ product_id, quantity }]
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Empty cart' });

  // calculate total and insert order
  let total = 0;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const it of items) {
      const [rows]: any = await conn.query('SELECT price FROM products WHERE id = ?', [it.product_id]);
      const prod = rows[0];
      if (!prod) throw new Error('Product not found');
      total += Number(prod.price) * Number(it.quantity || 1);
    }

    const [orderRes]: any = await conn.query('INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)', [user.id, total, 'pending']);
    const orderId = orderRes.insertId;

    for (const it of items) {
      const [rows]: any = await conn.query('SELECT price FROM products WHERE id = ?', [it.product_id]);
      const prod = rows[0];
      await conn.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, it.product_id, it.quantity || 1, prod.price]);
    }

    // create midtrans transaction
    const params = {
      transaction_details: { order_id: `order-${orderId}`, gross_amount: total },
      credit_card: { secure: true },
    };

    const snapResp = await snap.createTransaction(params);

    await conn.commit();

    res.json({ orderId, total, snapToken: snapResp.token, redirect_url: snapResp.redirect_url });
  } catch (err: any) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// Midtrans webhook to update payment status
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // raw body is available as Buffer because we used express.raw
    const raw = req.body as Buffer | string;
    const text = Buffer.isBuffer(raw) ? raw.toString('utf8') : String(raw);
    if (!text) return res.status(400).send('empty body');

    let payload: any;
    try {
      payload = JSON.parse(text);
    } catch (err) {
      return res.status(400).send('invalid json');
    }

    // Verify Midtrans signature_key: sha512(order_id + status_code + gross_amount + serverKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const signatureKey = payload.signature_key || payload.signatureKey || '';
    if (serverKey) {
      const crypto = await import('crypto');
      const orderIdStr = payload.order_id || payload.transaction_details?.order_id;
      const statusCode = payload.status_code || payload.statusCode || '';
      const grossAmount = payload.gross_amount || payload.transaction_details?.gross_amount || '';
      const expected = crypto.createHash('sha512').update(`${orderIdStr}${statusCode}${grossAmount}${serverKey}`).digest('hex');
      if (!signatureKey || expected !== signatureKey) {
        console.warn('Midtrans webhook signature mismatch', { expected, signatureKey });
        return res.status(400).send('invalid signature');
      }
    }

    const orderIdStr = payload.order_id || payload.transaction_details?.order_id;
    if (!orderIdStr) return res.status(400).send('missing order id');

    const orderId = Number(String(orderIdStr).replace(/^order-/, ''));
    const status = payload.transaction_status || payload.status || payload.transaction_status;

    // insert payment and update order status
    await pool.query('INSERT INTO payments (order_id, payment_method, payment_status, raw_response) VALUES (?, ?, ?, ?)', [orderId, payload.payment_type || null, status || null, text]);
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status || 'unknown', orderId]);

    res.json({ ok: true });
  } catch (err: any) {
    console.error('Webhook processing error', err);
    res.status(500).json({ error: 'webhook processing error' });
  }
});

// List orders (role-based): admin sees all, seller sees orders for their products, buyer sees their orders
router.get('/', authMiddleware, async (req, res) => {
  const user = (req as any).user;
  if (user.role === 'admin') {
    const [rows]: any = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return res.json(rows);
  }

  if (user.role === 'seller') {
    // find orders that contain products for this seller
    const [rows]: any = await pool.query(`
      SELECT DISTINCT o.* FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      WHERE p.seller_id = ?
      ORDER BY o.created_at DESC
    `, [user.id]);
    return res.json(rows);
  }

  // buyer
  const [rows]: any = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [user.id]);
  res.json(rows);
});

// Get a single order with items (role-based access)
router.get('/:id', authMiddleware, async (req, res) => {
  const user = (req as any).user;
  const id = Number(req.params.id);

  const [[order]]: any = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
  if (!order) return res.status(404).json({ error: 'Not found' });

  if (user.role === 'admin') {
    // admin allowed
  } else if (user.role === 'seller') {
    const [rows]: any = await pool.query(`
      SELECT 1 FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ? AND p.seller_id = ? LIMIT 1
    `, [id, user.id]);
    if (!rows.length) return res.status(403).json({ error: 'Not allowed' });
  } else {
    if (order.user_id !== user.id) return res.status(403).json({ error: 'Not allowed' });
  }

  const [items]: any = await pool.query('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?', [id]);
  res.json({ order, items });
});

export default router;

