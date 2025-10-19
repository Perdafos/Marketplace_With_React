import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './user.js';
import ProductModel from './product.js';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/marketplace';

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
});

export const User = UserModel(sequelize);
export const Product = ProductModel(sequelize);

// Associations
User.hasMany(Product, { as: 'products', foreignKey: 'sellerId' });
Product.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });

export default sequelize;
