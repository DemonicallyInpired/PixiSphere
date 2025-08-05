import { db } from '../config/database.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword, generateToken, generateOTP, verifyOTP } from '../utils/auth.js';
import logger from '../utils/logger.js';

// Signup controller (OTP-gated, no DB insert yet)
export const signup = async (req, res) => {
  try {
    const { email, password, role = 'client', firstName, lastName, phone, city } = req.body;
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    // Generate OTP
    const otp = generateOTP();
    // Store signup payload + OTP in-memory for verification (expires in 5 min)
    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      signupPayload: { email, password, role, firstName, lastName, phone, city }
    };
    // Send OTP via Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Pixisphere OTP',
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });
    logger.info(`Signup initiated for email: ${email}, OTP sent.`);
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Complete verification to activate your account.'
    });
  } catch (error) {
    logger.error('Signup/OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user.length) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user[0].isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user[0].password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user[0].id,
      email: user[0].email,
      role: user[0].role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user[0];

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Request OTP (Resend integration)
import { Resend } from 'resend';
console.log(process.env.RESEND_API_KEY); 
const resend = new Resend(process.env.RESEND_API_KEY);
const otpStore = {};

export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();

    // Store OTP in-memory for demo (expires in 5 min)
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // Send OTP via Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Pixisphere OTP',
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });

    logger.info(`OTP requested for email: ${email}, Generated OTP: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    logger.error('Request OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


// Verify OTP (checks in-memory store)
// OTP verification and user creation
export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record || record.expires < Date.now() || record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    // OTP is valid, proceed to create user
    const { signupPayload } = record;
    if (!signupPayload) {
      return res.status(400).json({
        success: false,
        message: 'No signup data found for this OTP/email.'
      });
    }
    // Double-check user doesn't exist (race condition)
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }
    // Hash password
    const hashedPassword = await hashPassword(signupPayload.password);
    // Create user in DB
    const newUser = await db.insert(users).values({
      email: signupPayload.email,
      password: hashedPassword,
      role: signupPayload.role,
      firstName: signupPayload.firstName,
      lastName: signupPayload.lastName,
      phone: signupPayload.phone,
      city: signupPayload.city,
      isActive: true
    }).returning();
    // Generate JWT token
    const token = generateToken({
      id: newUser[0].id,
      email: newUser[0].email,
      role: newUser[0].role,
    });
    // Clean up OTP store
    delete otpStore[email];
    logger.info(`User created after OTP verification: ${email}`);
    res.status(201).json({
      success: true,
      message: 'Account created and verified successfully.',
      data: {
        user: newUser[0],
        token
      }
    });
  } catch (error) {
    logger.error('OTP verification/user creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

