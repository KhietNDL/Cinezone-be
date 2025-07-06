const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderProductDetail.controller');
const { auth } = require('../middlewares/auth.middleware');
/**
 * @swagger
 * tags:
 *   - name: OrderProductDetail
 *     description: OrderProductDetail management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderProductDetail:
 *       type: object
 *       properties:
 *         OrderProductDetailId:
 *           type: string
 *         OrderProductId:
 *           type: string
 *         ProductId:
 *           type: string
 *         Quantity:
 *           type: integer
 *         TotalPrice:
 *           type: number
 *         Notes:
 *           type: string
 *       required:
 *         - OrderProductId
 *         - ProductId
 *         - Quantity
 */

/**
 * @swagger
 * /api/order-product-details:
 *   get:
 *     summary: Get all order product details
 *     tags: [OrderProductDetail]
 *     responses:
 *       200:
 *         description: List of order product details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderProductDetail'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/order-product-details/{id}:
 *   get:
 *     summary: Get order product detail by ID
 *     tags: [OrderProductDetail]
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
 *               $ref: '#/components/schemas/OrderProductDetail'
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/order-product-details/create:
 *   post:
 *     summary: Create a new order product detail
 *     tags: [OrderProductDetail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderProductDetail'
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/create', auth, controller.create);

/**
 * @swagger
 * /api/order-product-details/{id}:
 *   put:
 *     summary: Update an order product detail
 *     tags: [OrderProductDetail]
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
 *             $ref: '#/components/schemas/OrderProductDetail'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put('/:id', auth, controller.update);

/**
 * @swagger
 * /api/order-product-details/{id}:
 *   delete:
 *     summary: Delete an order product detail
 *     tags: [OrderProductDetail]
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

module.exports = router;