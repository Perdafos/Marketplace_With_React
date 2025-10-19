import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { sequelize, User, Product } from '../models/index.js';

dotenv.config();

async function seed() {
  await sequelize.sync({ force: true });
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash, role: 'admin' });
  const seller = await User.create({ name: 'Seller', email: 'seller@example.com', passwordHash, role: 'seller' });
  const buyer = await User.create({ name: 'Buyer', email: 'buyer@example.com', passwordHash, role: 'buyer' });
  await Product.create({ title: 'Sample Product', description: 'A test product', price: 9.99, sellerId: seller.id });
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
