import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();

// Public registration: role can only be 'buyer' by default. Admin must set other roles.
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const hashed = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashed, 'buyer']);
  res.json({ ok: true, id: (result as any).insertId });
});

// Allow admin to create users with roles (admin-only endpoint)
import { authMiddleware, requireRole } from '../middleware/auth';

// Admin-only: create a user with role
router.post('/create-user', authMiddleware, requireRole(['admin']), async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  if (!['admin', 'seller', 'buyer'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const hashed = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashed, role]);
  res.json({ ok: true, id: (result as any).insertId });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
});

export default router;
