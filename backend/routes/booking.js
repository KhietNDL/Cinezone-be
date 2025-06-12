const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MemberId:
 *                 type: string
 *               ShowtimeId:
 *                 type: string
 *               BookingDate:
 *                 type: string
 *                 format: date-time
 *               TotalAmount:
 *                 type: number
 *               Status:
 *                 type: string
 *               PaymentId:
 *                 type: string
 *               PromotionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       500:
 *         description: Internal server error
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/{bookingId}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking retrieved
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get('/:bookingId', bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/member/{memberId}:
 *   get:
 *     summary: Get bookings by member ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookings retrieved
 *       404:
 *         description: No bookings found for this member
 *       500:
 *         description: Internal server error
 */
router.get('/member/:memberId', bookingController.getBookingsByMemberId);

/**
 * @swagger
 * /api/bookings/{bookingId}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MemberId:
 *                 type: string
 *               ShowtimeId:
 *                 type: string
 *               BookingDate:
 *                 type: string
 *                 format: date-time
 *               TotalAmount:
 *                 type: number
 *               Status:
 *                 type: string
 *               PaymentId:
 *                 type: string
 *               PromotionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.put('/:bookingId', bookingController.updateBooking);

/**
 * @swagger
 * /api/bookings/{bookingId}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Booking deleted
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:bookingId', bookingController.deleteBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Bookings retrieved
 *       500:
 *         description: Internal server error
 */
router.get('/', bookingController.getAllBookings);

/**
 * @swagger
 * /api/bookings/member/{memberId}/latest:
 *   get:
 *     summary: Get the latest booking by member ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Latest booking retrieved
 *       404:
 *         description: No bookings found for this member
 *       500:
 *         description: Internal server error
 */
router.get('/member/:memberId/latest', bookingController.getLatestBookingByMemberId);

module.exports = router;
