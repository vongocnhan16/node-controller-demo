const pool = require('../db');

class Product {
  static async create({ name, brand, model, condition, price, user_id }) {
    const res = await pool.query(
      `INSERT INTO products (name, brand, model, condition, price, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING product_id, name, brand, model, condition, price, user_id, created_at`,
      [name, brand, model, condition, price, user_id]
    );
    return res.rows[0];
  }

  static async getAll() {
    const res = await pool.query('SELECT * FROM products');
    return res.rows;
  }

  static async getById(product_id) {
    const res = await pool.query('SELECT * FROM products WHERE product_id = $1', [product_id]);
    return res.rows[0];
  }

  static async delete(product_id) {
    await pool.query('DELETE FROM products WHERE product_id = $1', [product_id]);
  }

  static async getByUser(user_id) {
    const res = await pool.query('SELECT * FROM products WHERE user_id = $1', [user_id]);
    return res.rows;
  }
}

module.exports = Product;
