import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/pixisphere_test';

// Global test setup
beforeAll(async () => {
  // Setup test database or any global test configuration
});

afterAll(async () => {
  // Cleanup after all tests
});
