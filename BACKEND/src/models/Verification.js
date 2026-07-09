const pool = require('../config/database');

class Verification {
  static async create(verificationData) {
    const { product_id, channel, verification_result, location, scanned_code = null } = verificationData;
    const query = `
      INSERT INTO verifications (product_id, channel, verification_result, location, scanned_code)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [product_id, channel, verification_result, location, scanned_code]);
    return result.insertId;
  }

  static async findById(id) {
    const query = `
      SELECT v.*, p.name, p.unique_code, m.name as manufacturer_name
      FROM verifications v
      LEFT JOIN products p ON v.product_id = p.id
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
      WHERE v.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getByProductId(productId, limit = 50, offset = 0) {
    const query = `
      SELECT v.* FROM verifications v
      WHERE v.product_id = ?
      ORDER BY v.verification_time DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [productId, limit, offset]);
    return rows;
  }

  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT v.*, p.name, p.unique_code, m.name as manufacturer_name
      FROM verifications v
      LEFT JOIN products p ON v.product_id = p.id
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
      ORDER BY v.verification_time DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [limit, offset]);
    return rows;
  }

  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_verifications,
        SUM(CASE WHEN verification_result = 'authentic' THEN 1 ELSE 0 END) as authentic_count,
        SUM(CASE WHEN verification_result = 'counterfeit' THEN 1 ELSE 0 END) as counterfeit_count,
        COUNT(DISTINCT channel) as channels_used
      FROM verifications
    `;
    const [rows] = await pool.query(query);
    return rows[0];
  }
}

module.exports = Verification;
