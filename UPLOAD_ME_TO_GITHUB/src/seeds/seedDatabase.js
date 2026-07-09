const pool = require('../config/database');

/**
 * Seeds initial data into the database.
 * Uses INSERT OR IGNORE so it is safe to run on every startup.
 * Does NOT close the database pool — safe to call from server.js.
 */
const seedData = async () => {
  const manufacturers = [
    ['TanzaniaBrews Ltd', '+255 22 234 5678'],
    ['East African Beverages', '+255 22 345 6789'],
    ['SafeGuard Spirits', '+255 22 456 7890'],
  ];

  for (const [name, contact] of manufacturers) {
    await pool.query(
      'INSERT OR IGNORE INTO manufacturers (name, contact_info) VALUES (?, ?)',
      [name, contact]
    );
  }

  console.log('Manufacturers seeded');

  const products = [
    ['Premium Blend Whiskey', 1, 'TB-2024-001', 'Premium 12-year aged whiskey'],
    ['East African Gold Rum', 2, 'EA-2024-002', 'Dark rum 40% ABV'],
    ['SafeGuard Premium Vodka', 3, 'SG-2024-003', 'Pure vodka 40% ABV'],
  ];

  for (const [name, manufacturerId, code, description] of products) {
    await pool.query(
      'INSERT OR IGNORE INTO products (name, manufacturer_id, unique_code, description) VALUES (?, ?, ?, ?)',
      [name, manufacturerId, code, description]
    );
  }

  console.log('Products seeded');
};

module.exports = seedData;

// Standalone runner: npm run seed
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err.message);
      process.exit(1);
    });
}
