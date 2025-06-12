const express = require('express');
const router = express.Router();
const bookingSeatController = require('../controllers/bookingseat.controller');
const { auth, isAdmin } = require('../middlewares/auth.middleware');

// Thêm ghế vào booking
/**
 * @swagger
 * /api/bookingseats:
 *   post:
 *     summary: Create a new booking seat
 *     tags: [BookingSeats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BookingId:
 *                 type: string
 *               SeatId:
 *                 type: string
 *               Status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking seat created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', auth, bookingSeatController.createBookingSeat);
// Lấy tất cả ghế của một booking
/**
 * @swagger
 * /api/bookingseats/booking/{bookingId}:
 *   get:
 *     summary: Get all seats by booking ID
 *     tags: [BookingSeats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the booking
 *     responses:
 *       200:
 *         description: A list of seats for the booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get('/booking/:bookingId', auth, bookingSeatController.getSeatsByBookingId);
// Lấy tất cả booking của một ghế
/**
 * @swagger
 * /api/bookingseats/seat/{seatId}:
 *   get:
 *     summary: Get all bookings by seat ID
 *     tags: [BookingSeats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the seat
 *     responses:
 *       200:
 *         description: A list of bookings for the seat
 *       404:
 *         description: Seat not found
 *       500:
 *         description: Internal server error
 */
router.get('/seat/:seatId', auth, bookingSeatController.getBookingsBySeatId);
// Xóa ghế khỏi booking
/**
 * @swagger
 * /api/bookingseats/{bookingSeatId}:
 *   delete:
 *     summary: Delete a booking seat by ID
 *     tags: [BookingSeats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingSeatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the booking seat to delete
 *     responses:
 *       200:
 *         description: Booking seat deleted successfully
 *       404:
 *         description: Booking seat not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:bookingSeatId', auth, bookingSeatController.deleteBookingSeat);

module.exports = router;
