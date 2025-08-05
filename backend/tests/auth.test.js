import request from 'supertest';
import app from '../app.js';
import { db } from '../config/database.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';

describe('Authentication Endpoints', () => {
  let testUser = {
    email: 'test@example.com',
    password: 'password123',
    role: 'client',
    firstName: 'Test',
    lastName: 'User',
    city: 'Mumbai',
  };

  afterEach(async () => {
    // Clean up test user
    try {
      await db.delete(users).where(eq(users.email, testUser.email));
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.role).toBe(testUser.role);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for duplicate email', async () => {
      // Create user first
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      // Try to create again
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should return validation error for invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return validation error for short password', async () => {
      const invalidUser = { ...testUser, password: '123' };
      
      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should return error for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken;

    beforeEach(async () => {
      // Create and login user
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      
      authToken = signupResponse.body.data.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access token is required');
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired token');
    });
  });

  describe('POST /api/auth/request-otp', () => {
    it('should request OTP successfully', async () => {
      const response = await request(app)
        .post('/api/auth/request-otp')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP sent successfully');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('should verify OTP successfully with mock OTP', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ 
          email: 'test@example.com',
          otp: '123456' // Mock OTP
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP verified successfully');
    });

    it('should return error for invalid OTP', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ 
          email: 'test@example.com',
          otp: '000000' // Invalid OTP
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired OTP');
    });
  });
});
