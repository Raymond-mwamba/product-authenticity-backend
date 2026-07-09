const fs = require('fs');
const path = require('path');
const pool = require('./database');

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    const schemaPath = path.join(__dirname, '../../database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const statements = schema.split(';').filter((stmt) => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('Database schema initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  }
};

module.exports = initializeDatabase;
