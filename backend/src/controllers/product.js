import { Product } from '../models/index.js';

export async function list(req, res) {
  const products = await Product.findAll();
  res.json(products);
}

export async function getById(req, res) {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
}

export async function create(req, res) {
  const { title, description, price } = req.body;
  if (!title || !price) return res.status(400).json({ message: 'title and price required' });
  try {
    const product = await Product.create({ title, description, price, sellerId: req.user.id });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function update(req, res) {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  // seller can only update own products unless admin
  if (req.user.role !== 'admin' && p.sellerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  const { title, description, price } = req.body;
  try {
    await p.update({ title: title ?? p.title, description: description ?? p.description, price: price ?? p.price });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function remove(req, res) {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  if (req.user.role !== 'admin' && p.sellerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  await p.destroy();
  res.json({ message: 'Deleted' });
}
