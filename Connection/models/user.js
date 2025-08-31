const pool = require('../db');
const bcrypt = require('bcrypt');

class User {
  static async create({ username, email, password }) {
    const hashed = await bcrypt.hash(password, 10);
    const res = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email, created_at',
      [username, email, hashed]
    );
    return res.rows[0];
  }

  static async findByEmail(email) {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  }

  static async findById(user_id) {
    const res = await pool.query('SELECT user_id, username, email, created_at FROM users WHERE user_id = $1', [user_id]);
    return res.rows[0];
  }

  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User;
