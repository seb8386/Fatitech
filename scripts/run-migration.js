const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

async function runMigration() {
  const migrationPath = path.join(__dirname, '..', 'drizzle', 'migrate_add_new_columns.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  // Split by statement separator
  const statements = migrationSQL.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s);
  
  const client = await pool.connect();
  
  try {
    console.log('Starting migration...');
    
    for (const statement of statements) {
      if (statement.startsWith('--') || statement.length === 0) continue;
      
      try {
        await client.query(statement);
        console.log('✓ Executed statement successfully');
      } catch (error) {
        // Some statements might fail if they already exist, that's okay
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate column') ||
            error.message.includes('does not exist')) {
          console.log('⊘ Statement skipped (already exists):', error.message.substring(0, 100));
        } else {
          console.error('✗ Error executing statement:', error.message);
          throw error;
        }
      }
    }
    
    console.log('Migration completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
