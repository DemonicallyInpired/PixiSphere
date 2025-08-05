import express from 'express';
import {
  getDashboardKPIs,
  getPendingVerifications,
  verifyPartner,
  getReviewsForModeration,
  moderateReview,
  deleteReview,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  promotePartner,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import {
  validateVerification,
  validateCategory,
  validateLocation,
  validateId,
  validatePagination,
  handleValidationErrors,
} from '../middlewares/validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard KPIs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard KPIs retrieved successfully
 */
router.get('/dashboard', getDashboardKPIs);

/**
 * @swagger
 * /api/admin/verifications:
 *   get:
 *     summary: Get pending partner verifications
 *     tags: [Admin]
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
 *         description: Pending verifications retrieved successfully
 */
router.get('/verifications', validatePagination, handleValidationErrors, getPendingVerifications);

/**
 * @swagger
 * /api/admin/verify/{id}:
 *   put:
 *     summary: Approve or reject partner verification
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Partner profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [verified, rejected]
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner verification status updated successfully
 *       404:
 *         description: Partner profile not found
 */
router.put('/verify/:id', validateId, validateVerification, handleValidationErrors, verifyPartner);

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     summary: Get reviews for moderation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: moderated
 *         schema:
 *           type: boolean
 *         description: Filter by moderation status
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
 *         description: Reviews retrieved successfully
 */
router.get('/reviews', validatePagination, handleValidationErrors, getReviewsForModeration);

/**
 * @swagger
 * /api/admin/reviews/{id}/moderate:
 *   put:
 *     summary: Moderate review (hide/show)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isVisible:
 *                 type: boolean
 *               isModerated:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Review moderated successfully
 *       404:
 *         description: Review not found
 */
router.put('/reviews/:id/moderate', validateId, handleValidationErrors, moderateReview);

/**
 * @swagger
 * /api/admin/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete('/reviews/:id', validateId, handleValidationErrors, deleteReview);

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create new category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Category already exists
 */
router.post('/categories', validateCategory, handleValidationErrors, createCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put('/categories/:id', validateId, validateCategory, handleValidationErrors, updateCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/categories/:id', validateId, handleValidationErrors, deleteCategory);

/**
 * @swagger
 * /api/admin/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Locations retrieved successfully
 */
router.get('/locations', getLocations);

/**
 * @swagger
 * /api/admin/locations:
 *   post:
 *     summary: Create new location
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - state
 *             properties:
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location created successfully
 */
router.post('/locations', validateLocation, handleValidationErrors, createLocation);

/**
 * @swagger
 * /api/admin/locations/{id}:
 *   put:
 *     summary: Update location
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       404:
 *         description: Location not found
 */
router.put('/locations/:id', validateId, validateLocation, handleValidationErrors, updateLocation);

/**
 * @swagger
 * /api/admin/locations/{id}:
 *   delete:
 *     summary: Delete location
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 */
router.delete('/locations/:id', validateId, handleValidationErrors, deleteLocation);

/**
 * @swagger
 * /api/admin/partners/{id}/promote:
 *   put:
 *     summary: Promote partner as featured
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Partner profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Partner featured status updated successfully
 *       404:
 *         description: Partner profile not found
 */
router.put('/partners/:id/promote', validateId, handleValidationErrors, promotePartner);

export default router;
