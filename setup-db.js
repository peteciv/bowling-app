// Database setup script for Railway PostgreSQL
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');

async function setupDatabase() {
  // Check if DATABASE_URL contains 'railway.internal' - need public URL
  if (process.env.DATABASE_URL?.includes('railway.internal')) {
    console.error('\n❌ ERROR: DATABASE_URL uses internal Railway hostname.');
    console.error('   You need the PUBLIC connection string from Railway.\n');
    console.error('   Steps to get it:');
    console.error('   1. Go to Railway dashboard → Your project');
    console.error('   2. Click on PostgreSQL service');
    console.error('   3. Go to Variables tab');
    console.error('   4. Copy the DATABASE_URL that starts with "postgresql://postgres:...@..."');
    console.error('   5. Replace in .env.local\n');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Connecting to Railway PostgreSQL...');

    // Read and execute setup SQL
    const sql = fs.readFileSync('./setup.sql', 'utf8');
    await pool.query(sql);

    console.log('✅ Database setup complete!');
    console.log('   - Tables created: players, match_days, availability');
    console.log('   - Indexes created');
    console.log('   - Initial players inserted (Jeff, Neil, Peter, Tim, Jay)');
    console.log('\n🎳 Ready to bowl! Start the dev server with: npm run dev\n');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
