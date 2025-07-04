const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { auth } = require('../middlewares/auth.middleware');

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
 *     summary: Get all bookings with pagination and sorting
 *     tags: [Bookings]
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
 *         description: Number of bookings per page (0 = all)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [CreatedAt, BookingDate, TotalAmount, Status]
 *           default: CreatedAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (asc or desc)
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

/**
 * @swagger
 * /api/bookings/hold:
 *   post:
 *     summary: Hold a booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               showtimeId:
 *                 type: string
 *                 description: Showtime ID
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of seat IDs to hold
 *               promotionTitle:
 *                 type: string
 *                 description: Promotion ID (optional)
 *     responses:
 *       201:
 *         description: Booking held
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/hold', bookingController.holdBooking);

/**
 * @swagger
 * /api/bookings/confirm/{bookingId}:
 *   post:
 *     summary: Confirm a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to confirm
 *     responses:
 *       200:
 *         description: Booking confirmed
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/confirm/:bookingId', bookingController.confirmBooking);

/**
 * @swagger
 * /api/bookings/checkin/{bookingId}:
 *   post:
 *     summary: Check-in booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to check-in
 *     responses:
 *       200:
 *         description: Check-in successful
 *       400:
 *         description: Check-in failed (e.g., booking not found, already checked in)
 *       500:
 *         description: Internal server error
 */
router.post('/checkin/:bookingId', bookingController.checkinBooking);

/**
 * @swagger
 * /api/bookings/detail/{bookingId}:
 *   get:
 *     summary: Get booking detail (movie, showtime, seats, buyer info)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking detail
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get('/detail/:bookingId', bookingController.getBookingDetail);

/**
 * @swagger
 * /api/bookings/cancel/{bookingId}:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to cancel
 *     responses:
 *       200:
 *         description: Booking canceled
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.post('/cancel/:bookingId', bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/search/user:
 *   get:
 *     summary: Find bookings by user's Email, CCCD, or PhoneNumber
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: cccd
 *         schema:
 *           type: string
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookings found
 *       404:
 *         description: No bookings found
 *       500:
 *         description: Internal server error
 */
router.get('/search/user', bookingController.findBookingsByUserInfo);

module.exports = router;




