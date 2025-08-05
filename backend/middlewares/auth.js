import { verifyToken } from '../utils/auth.js';
import { db } from '../config/database.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import logger from '../utils/logger.js';

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = verifyToken(token);
      
      // Fetch user from database
      const user = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);
      
      if (!user.length || !user[0].isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or inactive user'
        });
      }

      req.user = user[0];
      next();
    } catch (jwtError) {
      logger.error('JWT verification failed:', jwtError);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Optional authentication middleware (for public routes that can benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = verifyToken(token);
        const user = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);
        
        if (user.length && user[0].isActive) {
          req.user = user[0];
        }
      } catch (jwtError) {
        // Ignore JWT errors for optional auth
        logger.debug('Optional auth JWT verification failed:', jwtError.message);
      }
    }
    
    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};
