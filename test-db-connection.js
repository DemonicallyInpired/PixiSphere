// Simple database connection test script
import { testConnection } from './backend/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

if (process.env.DATABASE_URL) {
  console.log('Connection string (without password):', 
    process.env.DATABASE_URL.replace(/:[^:@/]*@/, ':***@'));
}

try {
  const result = await testConnection();
  console.log('Database connection test result:', result ? 'SUCCESS' : 'FAILED');
  process.exit(result ? 0 : 1);
} catch (error) {
  console.error('Database connection test error:', error.message);
  process.exit(1);
}
