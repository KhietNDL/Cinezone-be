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
 *                 description: ID of the booking (only transmitted when paying for the booking)
 *               orderProductId:
 *                 type: string
 *                 description: Order product ID (only transmitted when paying for order product)
 *               amount:
 *                 type: number
 *                 description: Total payment amount (equal to total booking + orderProduct if both are available)
 *                 example: 150000
 *               reference:
 *                 type: string
 *                 description: Payment note (optional)
 *           examples:
 *             Booking only:
 *               summary: Booking payment
 *               value:
 *                 bookingId: "abc123"
 *                 amount: 0
 *                 reference: "Pay at the counter"
 *             OrderProduct only:
 *               summary: Payment for order product
 *               value:
 *                 orderProductId: "xyz789"
 *                 amount: 0
 *                 reference: "Pay at the counter"
 *             Both:
 *               summary: Pay for both booking and product order
 *               value:
 *                 bookingId: "abc123"
 *                 orderProductId: "xyz789"
 *                 amount: 0
 *                 reference: "Pay at the counter"
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       400:
 *         description: Invalid input or amount mismatch
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Booking or order product not found
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
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking (optional)
 *               orderProductId:
 *                 type: string
 *                 description: ID of the order product (optional)
 *               amount:
 *                 type: number
 *                 description: Total payment amount (must equal booking + orderProduct if both are provided)
 *                 example: 150000
 *               returnUrl:
 *                 type: string
 *                 description: URL to redirect after payment
 *                 example: "http://cinezone.info"
 *           examples:
 *             Booking only:
 *               summary: Pay for booking only
 *               value:
 *                 bookingId: "abc123"
 *                 amount: 100000
 *                 returnUrl: "http://cinezone.info"
 *             OrderProduct only:
 *               summary: Pay for order product only
 *               value:
 *                 orderProductId: "xyz789"
 *                 amount: 50000
 *                 returnUrl: "http://cinezone.info"
 *             Both:
 *               summary: Pay for both booking and order product
 *               value:
 *                 bookingId: "abc123"
 *                 orderProductId: "xyz789"
 *                 amount: 150000
 *                 returnUrl: "http://cinezone.info"
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
 *       400:
 *         description: Invalid input or amount mismatch
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Booking or order product not found
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
 * /api/payment/zalopay:
 *   post:
 *     summary: Initiate a ZaloPay payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking (optional)
 *               orderProductId:
 *                 type: string
 *                 description: ID of the order product (optional)
 *               amount:
 *                 type: number
 *                 description: Total payment amount (must equal booking + orderProduct if both are provided)
 *                 example: 150000
 *               returnUrl:
 *                 type: string
 *                 description: URL to redirect after payment
 *                 example: "http://cinezone.info"
 *           examples:
 *             Booking only:
 *               summary: Pay for booking only
 *               value:
 *                 bookingId: "abc123"
 *                 amount: 100000
 *                 returnUrl: "http://cinezone.info"
 *             OrderProduct only:
 *               summary: Pay for order product only
 *               value:
 *                 orderProductId: "xyz789"
 *                 amount: 50000
 *                 returnUrl: "http://cinezone.info"
 *             Both:
 *               summary: Pay for both booking and order product
 *               value:
 *                 bookingId: "abc123"
 *                 orderProductId: "xyz789"
 *                 amount: 150000
 *                 returnUrl: "http://cinezone.info"
 *     responses:
 *       200:
 *         description: ZaloPay payment initialized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid input or amount mismatch
 *       404:
 *         description: Booking or order product not found
 *       500:
 *         description: Server error
 */
router.post('/zalopay', paymentController.initZaloPayPayment);

/**
 * @swagger
 * /api/payment/zalopay/callback:
 *   post:
 *     summary: Handle ZaloPay payment callback
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appid:
 *                 type: string
 *               apptransid:
 *                 type: string
 *               pmcid:
 *                 type: string
 *               bankcode:
 *                 type: string
 *               amount:
 *                 type: string
 *               discountamount:
 *                 type: string
 *               status:
 *                 type: string
 *               checksum:
 *                 type: string
 *     responses:
 *       200:
 *         description: Callback processed successfully
 *       400:
 *         description: Invalid checksum
 *       500:
 *         description: Server error
 */
router.post('/zalopay/callback', paymentController.zaloPayCallback);

/**
 * @swagger
 * /api/payment/stripe:
 *   post:
 *     summary: Create a Stripe PaymentIntent for test (Visa, MasterCard, JCB, UnionPay)
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
 *               amount:
 *                 type: number
 *                 description: Amount in VND
 *                 example: 100000
 *               bookingId:
 *                 type: string
 *                 description: Booking ID (optional)
 *               orderProductId:
 *                 type: string
 *                 description: Order product ID (optional)
 *               cardType:
 *                 type: string
 *                 enum: [visa, mastercard, jcb, unionpay]
 *                 description: Card type for test (only for FE to display, Stripe accepts all with 'card')
 *                 example: visa
 *           examples:
 *             Booking only:
 *               summary: Pay for booking only
 *               value:
 *                 bookingId: "abc123"
 *                 amount: 100000
 *                 cardType: "visa"
 *             OrderProduct only:
 *               summary: Pay for order product only
 *               value:
 *                 orderProductId: "xyz789"
 *                 amount: 50000
 *                 cardType: "mastercard"
 *             Both:
 *               summary: Pay for both booking and order product
 *               value:
 *                 bookingId: "abc123"
 *                 orderProductId: "xyz789"
 *                 amount: 150000
 *                 cardType: "jcb"
 *     responses:
 *       200:
 *         description: Stripe test PaymentIntent created
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
 *                   example: "Stripe test PaymentIntent created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                     clientSecret:
 *                       type: string
 *                     paymentIntentId:
 *                       type: string
 *                     cardType:
 *                       type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/stripe', auth, paymentController.createStripeTestPaymentIntent);

/**
 * @swagger
 * /api/payment/confirm/{paymentId}:
 *   post:
 *     summary: Confirm a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to confirm
 *     responses:
 *       200:
 *         description: Payment confirmed
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
 *                   example: "Payment confirmed"
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.post('/confirm/:paymentId', auth, paymentController.confirmPayment);

module.exports = router;