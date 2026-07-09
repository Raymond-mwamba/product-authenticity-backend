require('dotenv').config();

// Inject the Aiven credentials into the environment variables
process.env.DB_HOST = 'mysql-2c484780-mwambah92-0d30.d.aivencloud.com';
process.env.DB_PORT = '12958';
process.env.DB_USER = 'avnadmin';
process.env.DB_PASSWORD = 'AVNS_2-3XP-pqYOb2FVJ9yAW';
process.env.DB_NAME = 'defaultdb';
process.env.DB_SSL = 'true';

const initializeDatabase = require('./src/config/initDB');

initializeDatabase()
  .then(() => {
    console.log('Successfully initialized Aiven cloud database!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
