const express = require('express');
const router = express.Router();
const controller = require('../controllers/comboProduct.controller');
const { auth } = require('../middlewares/auth.middleware');
/**
 * @swagger
 * tags:
 *   - name: ComboProduct
 *     description: ComboProduct management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ComboProduct:
 *       type: object
 *       properties:
 *         ComboProductId:
 *           type: string
 *         ComboId:
 *           type: string
 *         ProductId:
 *           type: string
 *         Quantity:
 *           type: integer
 *       required:
 *         - ComboId
 *         - ProductId
 *         - Quantity
 */
/**
 * @swagger
 * /api/combo-products:
 *   get:
 *     summary: Get all ComboProducts
 *     tags: [ComboProduct]
 *     responses:
 *       200:
 *         description: A list of ComboProducts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ComboProduct'
 */
router.get('/', controller.getAll);
/**
 * @swagger
 * /api/combo-products/{id}:
 *   get:
 *     summary: Get a ComboProduct by ID
 *     tags: [ComboProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ComboProduct ID
 *     responses:
 *       200:
 *         description: A single ComboProduct
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComboProduct'
 */
router.get('/:id', controller.getById);
/**
 * @swagger
 * /api/combo-products/create:
 *   post:
 *     summary: Create a new ComboProduct
 *     tags: [ComboProduct]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ComboId:
 *                 type: string
 *               ProductId:
 *                 type: string
 *               Quantity:
 *                 type: integer
 *             required:
 *               - ComboId
 *               - ProductId
 *               - Quantity
 *     responses:
 *       201:
 *         description: The created ComboProduct
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComboProduct'
 */
router.post('/create', auth, controller.create);
/**
 * @swagger
 * /api/combo-products/{id}:
 *   put:
 *     summary: Update a ComboProduct by ID
 *     tags: [ComboProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ComboProduct ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Quantity:
 *                 type: integer
 *             required:
 *               - Quantity
 *     responses:
 *       200:
 *         description: The updated ComboProduct
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComboProduct'
 */
router.put('/:id', auth, controller.update);
/**
 * @swagger
 * /api/combo-products/{id}:
 *   delete:
 *     summary: Delete a ComboProduct by ID
 *     tags: [ComboProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ComboProduct ID
 *     responses:
 *       204:
 *         description: Successfully deleted the ComboProduct
 */
router.delete('/:id', auth, controller.delete);

module.exports = router;