const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config({ path: __dirname + '/../.env' });

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'eclat_db',
  });

  const adminPass = process.env.SEED_ADMIN_PASS || 'AdminPass123';
  const sellerPass = process.env.SEED_SELLER_PASS || 'SellerPass123';

  const adminHash = await bcrypt.hash(adminPass, 10);
  const sellerHash = await bcrypt.hash(sellerPass, 10);

  const conn = await pool.getConnection();
  try {
    await conn.query("INSERT INTO users (username,email,password,role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE username=username", ['admin','admin@example.com',adminHash,'admin']);
    await conn.query("INSERT INTO users (username,email,password,role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE username=username", ['seller1','seller1@example.com',sellerHash,'seller']);
    console.log('Seed completed. Admin: admin@example.com / Seller: seller1@example.com');
  } catch (err) {
    console.error(err);
  } finally {
    conn.release();
    pool.end();
  }
}

main();
