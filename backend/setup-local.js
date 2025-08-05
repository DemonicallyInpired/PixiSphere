#!/usr/bin/env node

/**
 * Local Development Setup Script
 * This script helps set up the Pixisphere marketplace for local development
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupLocalDevelopment = () => {
  console.log('🚀 Setting up Pixisphere Marketplace for Local Development\n');

  // Check if .env exists
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file from .env.example...');
    const envExamplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env file created successfully\n');
    } else {
      console.log('❌ .env.example not found\n');
    }
  } else {
    console.log('✅ .env file already exists\n');
  }

  // Create logs directory
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log('📁 Created logs directory\n');
  }

  // Display setup instructions
  console.log('📋 Setup Instructions:');
  console.log('='.repeat(50));
  console.log('');
  console.log('1. 🗄️  Database Setup Options:');
  console.log('   Option A - Docker (Recommended):');
  console.log('     • Install Docker: https://docs.docker.com/get-docker/');
  console.log('     • Run: docker-compose up postgres -d');
  console.log('     • Run: npm run db:push');
  console.log('');
  console.log('   Option B - Local PostgreSQL:');
  console.log('     • Install PostgreSQL locally');
  console.log('     • Create database: createdb pixisphere_db');
  console.log('     • Update DATABASE_URL in .env file');
  console.log('     • Run: npm run db:push');
  console.log('');
  console.log('   Option C - Cloud Database (Render/Neon/Supabase):');
  console.log('     • Create a free PostgreSQL database');
  console.log('     • Update DATABASE_URL in .env file');
  console.log('     • Run: npm run db:push');
  console.log('');
  console.log('2. 🚀 Start Development Server:');
  console.log('   • Run: npm run dev');
  console.log('   • Visit: http://localhost:3000');
  console.log('   • API Docs: http://localhost:3000/api-docs');
  console.log('');
  console.log('3. 🧪 Test the API:');
  console.log('   • Import postman/Pixisphere-API.postman_collection.json');
  console.log('   • Or use curl/Postman to test endpoints');
  console.log('   • Run tests: npm test');
  console.log('');
  console.log('4. 🔑 Default Admin Account:');
  console.log('   • Email: admin@pixisphere.com');
  console.log('   • Password: admin123');
  console.log('   • (Created automatically when database is initialized)');
  console.log('');
  console.log('📚 Documentation:');
  console.log('   • README.md - Complete setup guide');
  console.log('   • /api-docs - Swagger API documentation');
  console.log('   • postman/ - Postman collection for testing');
  console.log('');
  console.log('🎯 Quick Test Commands:');
  console.log('   • Health check: curl http://localhost:3000/health');
  console.log('   • API info: curl http://localhost:3000/');
  console.log('   • Signup: curl -X POST http://localhost:3000/api/auth/signup \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"email":"test@example.com","password":"password123","role":"client"}\'');
  console.log('');
  console.log('🐳 Docker Full Stack (if Docker is available):');
  console.log('   • Run: docker-compose up -d');
  console.log('   • This starts PostgreSQL + Redis + API server');
  console.log('');
  console.log('✨ Your Pixisphere Marketplace backend is ready!');
  console.log('='.repeat(50));
};

// Run setup
setupLocalDevelopment();
