const express = require('express');
const router = express.Router();
const controller = require('../controllers/seatshowtime.controller');
const { auth, isAdminOrEmployee } = require('../middlewares/auth.middleware');

// Lấy tất cả
/**
 * @swagger
 * /api/seatshowtimes:
 *   get:
 *     summary: Get all seat showtimes
 *     tags: [SeatShowtimes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of seat showtimes
 *       500:
 *         description: Internal server error
 */
router.get('/', auth, isAdminOrEmployee, controller.getAllSeatShowtimes);
// Lấy theo id
/**
 * @swagger
 * /api/seatshowtimes/{seatShowtimeId}:
 *   get:
 *     summary: Get a seat showtime by ID
 *     tags: [SeatShowtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seatShowtimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the seat showtime
 *     responses:
 *       200:
 *         description: Seat showtime retrieved successfully
 *       404:
 *         description: Seat showtime not found
 *       500:
 *         description: Internal server error
 */
router.get('/:seatShowtimeId', auth, isAdminOrEmployee, controller.getSeatShowtimeById);
// Tạo mới
/**
 * @swagger
 * /api/seatshowtimes:
 *   post:
 *     summary: Create a new seat showtime
 *     tags: [SeatShowtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SeatId:
 *                 type: string
 *               ShowtimeId:
 *                 type: string
 *               Status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seat showtime created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', auth, isAdminOrEmployee, controller.createSeatShowtime);
// Cập nhật
/**
 * @swagger
 * /api/seatshowtimes/{seatShowtimeId}:
 *   put:
 *     summary: Update a seat showtime
 *     tags: [SeatShowtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seatShowtimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the seat showtime to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SeatId:
 *                 type: string
 *               ShowtimeId:
 *                 type: string
 *               Status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seat showtime updated successfully
 *       404:
 *         description: Seat showtime not found
 *       500:
 *         description: Internal server error
 */
router.put('/:seatShowtimeId', auth, isAdminOrEmployee, controller.updateSeatShowtime);
// Xóa mềm
/**
 * @swagger
 * /api/seatshowtimes/{seatShowtimeId}:
 *   delete:
 *     summary: Delete a seat showtime
 *     tags: [SeatShowtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seatShowtimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the seat showtime to delete
 *     responses:
 *       200:
 *         description: Seat showtime deleted successfully
 *       404:
 *         description: Seat showtime not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:seatShowtimeId', auth, isAdminOrEmployee, controller.deleteSeatShowtime);

module.exports = router;
