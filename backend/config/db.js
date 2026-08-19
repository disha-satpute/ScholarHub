const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Handle unexpected errors on idle PostgreSQL clients
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error ❌', err.message);
});

// Test the database connection without holding a client
pool
  .query('SELECT NOW()')
  .then(() => {
    console.log('Connected to PostgreSQL ✅');
  })
  .catch((err) => {
    console.error('Database connection error ❌', err.message);
  });

module.exports = pool;