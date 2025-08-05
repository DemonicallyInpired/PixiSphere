import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validation rules
export const validateSignup = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['client', 'partner', 'admin']).withMessage('Role must be client, partner, or admin'),
  body('firstName').optional().trim().isLength({ min: 1, max: 100 }).withMessage('First name must be 1-100 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Last name must be 1-100 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('city').optional().trim().isLength({ min: 1, max: 100 }).withMessage('City must be 1-100 characters'),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Partner profile validation
export const validatePartnerProfile = [
  body('businessName').trim().isLength({ min: 1, max: 255 }).withMessage('Business name is required (1-255 characters)'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('experience').optional().isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0-50 years'),
  body('basePrice').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Base price must be a valid decimal'),
  body('serviceCategories').optional().isArray().withMessage('Service categories must be an array'),
  body('aadharNumber').optional().isLength({ min: 12, max: 12 }).isNumeric().withMessage('Aadhar number must be 12 digits'),
  body('panNumber').optional().isLength({ min: 10, max: 10 }).withMessage('PAN number must be 10 characters'),
  body('gstNumber').optional().isLength({ min: 15, max: 15 }).withMessage('GST number must be 15 characters'),
];

// Portfolio validation
export const validatePortfolio = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required (1-255 characters)'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('imageUrl').isURL().withMessage('Valid image URL is required'),
  body('category').isIn(['wedding', 'maternity', 'portrait', 'event', 'commercial', 'fashion']).withMessage('Valid category is required'),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
];

// Inquiry validation
export const validateInquiry = [
  body('category').isIn(['wedding', 'maternity', 'portrait', 'event', 'commercial', 'fashion']).withMessage('Valid category is required'),
  body('eventDate').optional().isISO8601().withMessage('Valid event date is required'),
  body('budget').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Budget must be a valid decimal'),
  body('city').trim().isLength({ min: 1, max: 100 }).withMessage('City is required (1-100 characters)'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('referenceImageUrl').optional().isURL().withMessage('Reference image must be a valid URL'),
];

// Lead response validation
export const validateLeadResponse = [
  body('responseMessage').trim().isLength({ min: 1, max: 1000 }).withMessage('Response message is required (1-1000 characters)'),
  body('quotedPrice').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Quoted price must be a valid decimal'),
];

// Review validation
export const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters'),
];

// Admin verification validation
export const validateVerification = [
  body('status').isIn(['verified', 'rejected']).withMessage('Status must be verified or rejected'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters'),
];

// Category validation
export const validateCategory = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Category name is required (1-100 characters)'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
];

// Location validation
export const validateLocation = [
  body('city').trim().isLength({ min: 1, max: 100 }).withMessage('City is required (1-100 characters)'),
  body('state').trim().isLength({ min: 1, max: 100 }).withMessage('State is required (1-100 characters)'),
];

// Parameter validation
export const validateId = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required'),
];

// Query validation
export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
];
