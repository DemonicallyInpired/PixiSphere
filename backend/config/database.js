import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/schema.js';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, { max: 1 });

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
    return false;
  }
};

// Close connection function
export const closeConnection = async () => {
  await sql.end();
};
