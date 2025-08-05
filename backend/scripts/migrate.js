import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../config/database.js';
import logger from '../utils/logger.js';

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');
    
    await migrate(db, { migrationsFolder: './drizzle' });
    
    logger.info('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
