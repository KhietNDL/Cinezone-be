const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderProduct.controller');
const { auth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: OrderProduct
 *     description: OrderProduct management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderProduct:
 *       type: object
 *       properties:
 *         MemberId:
 *           type: string
 *         TotalAmount:
 *           type: number
 *         Status:
 *           type: integer
 *         Notes:
 *           type: string
 *       required:
 *         - MemberId
 *         - TotalAmount
 *         - Status
 */

/**
 * @swagger
 * /api/order-products:
 *   get:
 *     summary: Get all order products
 *     tags: [OrderProduct]
 *     responses:
 *       200:
 *         description: List of order products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderProduct'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/order-products/{id}:
 *   get:
 *     summary: Get order product by ID
 *     tags: [OrderProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order product detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderProduct'
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/order-products/create:
 *   post:
 *     summary: Create a new order product
 *     tags: [OrderProduct]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderProduct'
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/create', auth, controller.create);

/**
 * @swagger
 * /api/order-products/{id}:
 *   put:
 *     summary: Update an order product
 *     tags: [OrderProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderProduct'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put('/:id', auth, controller.update);

/**
 * @swagger
 * /api/order-products/{id}:
 *   delete:
 *     summary: Delete an order product
 *     tags: [OrderProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/:id', auth, controller.delete);
/**
 * @swagger
 * /api/order-products/hold:
 *   post:
 *     summary: Hold an order product
 *     tags: [OrderProduct]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MemberId:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ProductId:
 *                       type: string
 *                     Quantity:
 *                       type: integer
 *               Notes:
 *                 type: string
 *             required:
 *               - MemberId
 *               - products
 *     responses:
 *       201:
 *         description: Order product held successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/hold', controller.holdOrder);
/**
 * @swagger
 * /api/order-products/confirm/{id}:
 *   post:
 *     summary: Confirm an order product
 *     tags: [OrderProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order product confirmed successfully
 */
router.post('/confirm/:id', auth, controller.confirmOrder);
/**
 * @swagger
 * /api/order-products/checkin/{id}:
 *   post:
 *     summary: Check in an order product
 *     tags: [OrderProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order product checked in successfully
 */
router.post('/checkin/:id', auth, controller.checkinOrder);
/**
 * @swagger
 * /api/order-products/cancel/{id}:
 *   post:
 *     summary: Cancel an order product
 *     tags: [OrderProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order product cancelled successfully
 */
router.post('/cancel/:id', auth, controller.cancelOrder);

module.exports = router;