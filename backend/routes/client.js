import express from 'express';
import {
  submitInquiry,
  getMyInquiries,
  getInquiryResponses,
  browsePartners,
  getPartnerDetails,
} from '../controllers/clientController.js';
import { authenticate, authorize, optionalAuth } from '../middlewares/auth.js';
import {
  validateInquiry,
  validateId,
  validatePagination,
  handleValidationErrors,
} from '../middlewares/validation.js';

const router = express.Router();

/**
 * @swagger
 * /api/inquiry:
 *   post:
 *     summary: Submit a service inquiry
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - city
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [wedding, maternity, portrait, event, commercial, fashion]
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *               budget:
 *                 type: number
 *               city:
 *                 type: string
 *               description:
 *                 type: string
 *               referenceImageUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Inquiry submitted successfully
 *       400:
 *         description: Validation error
 */
router.post('/inquiry', authenticate, authorize('client'), validateInquiry, handleValidationErrors, submitInquiry);

/**
 * @swagger
 * /api/client/inquiries:
 *   get:
 *     summary: Get client's inquiries
 *     tags: [Client]
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
 *         description: Inquiries retrieved successfully
 */
router.get('/client/inquiries', authenticate, authorize('client'), validatePagination, handleValidationErrors, getMyInquiries);

/**
 * @swagger
 * /api/client/inquiries/{id}/responses:
 *   get:
 *     summary: Get responses for a specific inquiry
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inquiry ID
 *     responses:
 *       200:
 *         description: Inquiry responses retrieved successfully
 *       404:
 *         description: Inquiry not found
 */
router.get('/client/inquiries/:id/responses', authenticate, authorize('client'), validateId, handleValidationErrors, getInquiryResponses);

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Browse partners (public endpoint)
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by service category
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
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
 *         description: Partners retrieved successfully
 */
router.get('/partners', optionalAuth, validatePagination, handleValidationErrors, browsePartners);

/**
 * @swagger
 * /api/partners/{id}:
 *   get:
 *     summary: Get partner details with portfolio
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Partner ID
 *     responses:
 *       200:
 *         description: Partner details retrieved successfully
 *       404:
 *         description: Partner not found
 */
router.get('/partners/:id', optionalAuth, validateId, handleValidationErrors, getPartnerDetails);

export default router;
