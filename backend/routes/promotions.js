const express = require('express');
const router = express.Router();
const {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  searchPromotionsByCode,
} = require('../controllers/promotion.controller');
const { auth, isAdmin } = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Promotion Management
 *   description: API endpoints for managing promotions (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Promotion:
 *       type: object
 *       required:
 *         - Title
 *         - StartTime
 *         - EndTime
 *         - DiscountValue
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the promotion
 *         Title:
 *           type: string
 *           description: The title of the promotion
 *         StartTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the promotion
 *         EndTime:
 *           type: string
 *           format: date-time
 *           description: End time of the promotion
 *         DiscountValue:
 *           type: number
 *           format: float
 *           description: Discount value of the promotion
 *         Detail:
 *           type: string
 *           description: Detailed description of the promotion
 *         Image:
 *           type: string
 *           description: URL of the promotion image
 */

/**
 * @swagger
 * /api/promotions/getAll:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotion Management]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of promotions per page (0 = all promotions)
 *     responses:
 *       200:
 *         description: List of all promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 promotions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Promotion'
 */
router.get('/getAll', getAllPromotions);

/**
 * @swagger
 * /api/promotions/search:
 *   get:
 *     summary: Search promotions by code with pagination and sorting
 *     tags: [Promotion Management]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion code to search (partial match)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of promotions per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [CreatedAt, StartTime, EndTime, DiscountValue, Title]
 *           default: CreatedAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Promotions found
 *       400:
 *         description: Missing or invalid promotion code
 *       500:
 *         description: Internal server error
 */
router.get('/search', searchPromotionsByCode);

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Get promotion by ID
 *     tags: [Promotion Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The promotion ID
 *     responses:
 *       200:
 *         description: Promotion details
 */
router.get('/:id', getPromotionById);

/**
 * @swagger
 * /api/promotions/create:
 *   post:
 *     summary: Create new promotion
 *     tags: [Promotion Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startTime
 *               - endTime
 *               - discountValue
 *             properties:
 *               title:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               discountValue:
 *                 type: number
 *               detail:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: integer
 *                 description: Status of the promotion
 *               code:
 *                 type: string
 *                 description: Promotion code
 *     responses:
 *       201:
 *         description: Promotion created successfully
 */
router.post('/create', auth, isAdmin, upload.fields([{name: 'image', maxCount: 1}]), createPromotion);

/**
 * @swagger
 * /api/promotions/update/{id}:
 *   put:
 *     summary: Update promotion
 *     tags: [Promotion Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               discountValue:
 *                 type: number
 *               detail:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: integer
 *                 description: Status of the promotion
 *               code:
 *                 type: string
 *                 description: Promotion code
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 */
router.put('/update/:id', auth, isAdmin, upload.fields([{name: 'image', maxCount: 1}]), updatePromotion);

/**
 * @swagger
 * /api/promotions/delete/{id}:
 *   delete:
 *     summary: Delete promotion
 *     tags: [Promotion Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The promotion ID
 *     responses:
 *       200:
 *         description: Promotion deleted successfully
 */
router.delete('/delete/:id', auth, isAdmin, deletePromotion);

module.exports = router;