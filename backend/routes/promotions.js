const express = require('express');
const router = express.Router();
const {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  searchPromotionsByTitle
} = require('../controllers/promotion.controller');
const { auth, isAdmin } = require('../middlewares/auth.middleware');

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
router.get('/', auth, isAdmin, getAllPromotions);

/**
 * @swagger
 * /api/promotions/search:
 *   get:
 *     summary: Search promotions by title
 *     tags: [Promotion Management]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Title (or part of title) of the promotion
 *     responses:
 *       200:
 *         description: List of matching promotions
 */
router.get('/search', auth, isAdmin, searchPromotionsByTitle);

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
router.get('/:id', auth, isAdmin, getPromotionById);

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
 *     responses:
 *       201:
 *         description: Promotion created successfully
 */
router.post('/', auth, isAdmin, createPromotion);

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
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 */
router.put('/:id', auth, isAdmin, updatePromotion);

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
router.delete('/:id', auth, isAdmin, deletePromotion);

module.exports = router;