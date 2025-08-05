import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/schema.js';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection
const connectionString = process.env.DATABASE_URL;

// Validate database URL
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create the connection with better error handling
const sql = postgres(connectionString, { 
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the database instance
export const db = drizzle(sql, { schema });

// Test connection function
export const testConnection = async () => {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('❌ Connection string (without password):', connectionString.replace(/:[^:@/]*@/, ':***@'));
    return false;
  }
};

// Close connection function
export const closeConnection = async () => {
  await sql.end();
};
