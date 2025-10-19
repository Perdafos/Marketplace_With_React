import { Router } from 'express';
import pool from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// Public: list products with pagination
// Public: production-ready listing with search, filters, sorting and pagination
router.get('/', async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Number(req.query.limit || 20));
  const offset = (page - 1) * limit;

  const q = (req.query.q || '').toString().trim();
  const category = (req.query.category || '').toString().trim();
  const sellerId = req.query.seller_id ? Number(req.query.seller_id) : undefined;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const sort = (req.query.sort || 'newest').toString(); // newest, price_asc, price_desc

  const whereClauses: string[] = [];
  const params: any[] = [];

  if (q) {
    whereClauses.push('(name LIKE ? OR category LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like);
  }

  if (category) {
    whereClauses.push('category = ?');
    params.push(category);
  }

  if (typeof sellerId === 'number' && !Number.isNaN(sellerId)) {
    whereClauses.push('seller_id = ?');
    params.push(sellerId);
  }

  if (typeof minPrice === 'number' && !Number.isNaN(minPrice)) {
    whereClauses.push('price >= ?');
    params.push(minPrice);
  }

  if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice)) {
    whereClauses.push('price <= ?');
    params.push(maxPrice);
  }

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  let orderSQL = 'ORDER BY created_at DESC';
  if (sort === 'price_asc') orderSQL = 'ORDER BY price ASC';
  if (sort === 'price_desc') orderSQL = 'ORDER BY price DESC';

  // total count for pagination
  const countSql = `SELECT COUNT(*) as total FROM products ${whereSQL}`;
  const [countRows]: any = await pool.query(countSql, params);
  const total = Number(countRows[0]?.total || 0);

  const dataSql = `SELECT * FROM products ${whereSQL} ${orderSQL} LIMIT ? OFFSET ?`;
  const dataParams = params.concat([limit, offset]);
  const [rows]: any = await pool.query(dataSql, dataParams);

  const totalPages = Math.ceil(total / limit) || 1;

  res.json({ meta: { page, limit, total, totalPages }, data: rows });
});

// Public: get product by id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  const p = rows[0];
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Create product: sellers or admin
router.post('/', authMiddleware, requireRole(['seller', 'admin']), async (req, res) => {
  const user = (req as any).user;
  const { name, category, price, image } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Missing fields' });

  const [result]: any = await pool.query('INSERT INTO products (seller_id, name, category, price, image) VALUES (?, ?, ?, ?, ?)', [user.id, name, category || null, price, image || null]);
  res.status(201).json({ ok: true, id: result.insertId });
});

// Update product: seller-owner or admin
router.put('/:id', authMiddleware, requireRole(['seller', 'admin']), async (req, res) => {
  const user = (req as any).user;
  const id = Number(req.params.id);
  const { name, category, price, image } = req.body;

  const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  const p = rows[0];
  if (!p) return res.status(404).json({ error: 'Not found' });

  if (user.role !== 'admin' && p.seller_id !== user.id) return res.status(403).json({ error: 'Not allowed' });

  await pool.query('UPDATE products SET name = ?, category = ?, price = ?, image = ? WHERE id = ?', [name || p.name, category || p.category, price || p.price, image || p.image, id]);
  res.json({ ok: true });
});

// Delete product: seller-owner or admin
router.delete('/:id', authMiddleware, requireRole(['seller', 'admin']), async (req, res) => {
  const user = (req as any).user;
  const id = Number(req.params.id);
  const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  const p = rows[0];
  if (!p) return res.status(404).json({ error: 'Not found' });
  if (user.role !== 'admin' && p.seller_id !== user.id) return res.status(403).json({ error: 'Not allowed' });

  await pool.query('DELETE FROM products WHERE id = ?', [id]);
  res.json({ ok: true });
});

export default router;
