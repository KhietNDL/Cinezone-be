const express = require('express');
const router = express.Router();
const { auth, isAdmin, isAdminOrEmployee } = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');

/**
 * @swagger
 * /api/payment/methods:
 *   get:
 *     summary: Get all payment methods
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payment methods
 *       500:
 *         description: Server error
 */
router.get('/methods', paymentController.getPaymentMethods);

/**
 * @swagger
 * /api/payment/offline:
 *   post:
 *     summary: Process offline payment (cash)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               amount:
 *                 type: number
 *               reference:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       500:
 *         description: Server error
 */
router.post('/offline', auth, isAdminOrEmployee, paymentController.processOfflinePayment);

/**
 * @swagger
 * /api/payment/momo:
 *   post:
 *     summary: Initiate a MoMo payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - amount
 *               - returnUrl
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking
 *               amount:
 *                 type: string
 *                 description: Payment amount
 *                 example: "50000"
 *               returnUrl:
 *                 type: string
 *                 description: URL to redirect after payment
 *                 example: "http://cinezone.info"
 *               userId:
 *                 type: string
 *                 description: ID of the user making payment
 *     responses:
 *       200:
 *         description: Payment URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Momo payment initialized"
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                     payUrl:
 *                       type: string
 *                       description: URL to redirect user for payment
 *                     orderId:
 *                       type: string
 *       500:
 *         description: Server error
 */
router.post('/momo', auth, paymentController.initMomoPayment);

/**
 * @swagger
 * /api/payment/momo-callback:
 *   post:
 *     summary: Handle MoMo payment callback
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: string
 *               orderId:
 *                 type: string
 *               requestId:
 *                 type: string
 *               orderInfo:
 *                 type: string
 *               orderType:
 *                 type: string
 *               transId:
 *                 type: string
 *               resultCode:
 *                 type: string
 *               message:
 *                 type: string
 *               payType:
 *                 type: string
 *               responseTime:
 *                 type: string
 *               extraData:
 *                 type: string
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Callback processed successfully
 */
router.post('/momo-callback', paymentController.handleMomoCallback);

/**
 * @swagger
 * /api/payment/{paymentId}/status:
 *   get:
 *     summary: Get payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Payment status
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get('/:paymentId/status', paymentController.getPaymentStatus);

module.exports = router;