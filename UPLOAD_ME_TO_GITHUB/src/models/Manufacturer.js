const pool = require('../config/database');

class Manufacturer {
  static async create(manufacturerData) {
    const { name, contact_info } = manufacturerData;
    const query = `
      INSERT INTO manufacturers (name, contact_info)
      VALUES (?, ?)
    `;
    const [result] = await pool.query(query, [name, contact_info]);
    return result.insertId;
  }

  static async findById(id) {
    const query = `SELECT * FROM manufacturers WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getAll() {
    const query = `SELECT * FROM manufacturers`;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async update(id, manufacturerData) {
    const { name, contact_info } = manufacturerData;
    const query = `
      UPDATE manufacturers 
      SET name = ?, contact_info = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [name, contact_info, id]);
    return result.affectedRows > 0;
  }
}

module.exports = Manufacturer;
