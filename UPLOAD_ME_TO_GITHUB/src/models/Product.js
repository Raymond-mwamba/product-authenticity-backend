const pool = require('../config/database');

class Product {
  static async create(productData) {
    const { name, manufacturer_id, unique_code, description } = productData;
    const query = `
      INSERT INTO products (name, manufacturer_id, unique_code, description)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [name, manufacturer_id, unique_code, description]);
    return result.insertId;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, m.name as manufacturer_name, m.contact_info
      FROM products p
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByUniqueCode(code) {
    const query = `
      SELECT p.*, m.name as manufacturer_name, m.contact_info
      FROM products p
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
      WHERE p.unique_code = ?
    `;
    const [rows] = await pool.query(query, [code]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async search(searchTerm) {
    const query = `
      SELECT p.*, m.name as manufacturer_name
      FROM products p
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
      WHERE p.name LIKE ? OR p.unique_code LIKE ?
      LIMIT 20
    `;
    const term = `%${searchTerm}%`;
    const [rows] = await pool.query(query, [term, term]);
    return rows;
  }

  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT p.*, m.name as manufacturer_name
      FROM products p
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [limit, offset]);
    return rows;
  }
}

module.exports = Product;
