import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Mock OTP generation (for development)
export const generateOTP = () => {
  if (process.env.MOCK_OTP_ENABLED === 'true') {
    return '123456'; // Mock OTP for development
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock OTP verification (for development)
export const verifyOTP = (providedOTP, generatedOTP) => {
  if (process.env.MOCK_OTP_ENABLED === 'true') {
    return providedOTP === '123456';
  }
  return providedOTP === generatedOTP;
};
