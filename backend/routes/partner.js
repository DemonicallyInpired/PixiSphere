import express from 'express';
import {
  createPartnerProfile,
  getPartnerProfile,
  getAssignedLeads,
  respondToLead,
  addPortfolioItem,
  getPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../controllers/partnerController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { uploadLimiter } from '../middlewares/rateLimiter.js';
import {
  validatePartnerProfile,
  validatePortfolio,
  validateLeadResponse,
  validateId,
  validatePagination,
  handleValidationErrors,
} from '../middlewares/validation.js';

const router = express.Router();

// All partner routes require authentication and partner role
router.use(authenticate);
router.use(authorize('partner'));

/**
 * @swagger
 * /api/partner/profile:
 *   post:
 *     summary: Create or update partner profile
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *             properties:
 *               businessName:
 *                 type: string
 *               description:
 *                 type: string
 *               experience:
 *                 type: integer
 *               basePrice:
 *                 type: number
 *               serviceCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *               aadharNumber:
 *                 type: string
 *               panNumber:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Partner profile created successfully
 *       200:
 *         description: Partner profile updated successfully
 */
router.post('/profile', validatePartnerProfile, handleValidationErrors, createPartnerProfile);

/**
 * @swagger
 * /api/partner/profile:
 *   get:
 *     summary: Get partner profile
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partner profile retrieved successfully
 *       404:
 *         description: Partner profile not found
 */
router.get('/profile', getPartnerProfile);

/**
 * @swagger
 * /api/partner/leads:
 *   get:
 *     summary: Get assigned leads for partner
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Assigned leads retrieved successfully
 */
router.get('/leads', validatePagination, handleValidationErrors, getAssignedLeads);

/**
 * @swagger
 * /api/partner/leads/{id}/respond:
 *   put:
 *     summary: Respond to a lead
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lead assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - responseMessage
 *             properties:
 *               responseMessage:
 *                 type: string
 *               quotedPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Response submitted successfully
 *       404:
 *         description: Lead assignment not found
 */
router.put('/leads/:id/respond', validateId, validateLeadResponse, handleValidationErrors, respondToLead);

/**
 * @swagger
 * /api/partner/portfolio:
 *   post:
 *     summary: Add portfolio item
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - imageUrl
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *                 enum: [wedding, maternity, portrait, event, commercial, fashion]
 *               displayOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Portfolio item added successfully
 */
router.post('/portfolio', uploadLimiter, validatePortfolio, handleValidationErrors, addPortfolioItem);

/**
 * @swagger
 * /api/partner/portfolio:
 *   get:
 *     summary: Get portfolio items
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio items retrieved successfully
 */
router.get('/portfolio', getPortfolioItems);

/**
 * @swagger
 * /api/partner/portfolio/{id}:
 *   put:
 *     summary: Update portfolio item
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Portfolio item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *                 enum: [wedding, maternity, portrait, event, commercial, fashion]
 *               displayOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Portfolio item updated successfully
 *       404:
 *         description: Portfolio item not found
 */
router.put('/portfolio/:id', validateId, validatePortfolio, handleValidationErrors, updatePortfolioItem);

/**
 * @swagger
 * /api/partner/portfolio/{id}:
 *   delete:
 *     summary: Delete portfolio item
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Portfolio item ID
 *     responses:
 *       200:
 *         description: Portfolio item deleted successfully
 *       404:
 *         description: Portfolio item not found
 */
router.delete('/portfolio/:id', validateId, handleValidationErrors, deletePortfolioItem);

export default router;
