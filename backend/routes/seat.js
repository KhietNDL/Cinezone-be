const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seat.controller');

/**
 * @swagger
 * /api/seats:
 *   get:
 *     summary: Get all seats
 *     tags: [Seats]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get('/', seatController.getAllSeats);

/**
 * @swagger
 * /api/seats/cinema-room/{cinemaRoomId}:
 *   get:
 *     summary: Get seats by cinema room ID
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: cinemaRoomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cinema room ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get('/cinema-room/:cinemaRoomId', seatController.getSeatsByCinemaRoomId);

/**
 * @swagger
 * /api/seats/{seatId}:
 *   get:
 *     summary: Get seat by ID
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seat ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get('/:seatId', seatController.getSeatById);

/**
 * @swagger
 * /api/seats:
 *   post:
 *     summary: Create a new seat
 *     tags: [Seats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumber:
 *                 type: string
 *               row:
 *                 type: string
 *               cinemaRoomId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', seatController.createSeat);

/**
 * @swagger
 * /api/seats/{seatId}:
 *   put:
 *     summary: Update a seat
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumber:
 *                 type: string
 *               row:
 *                 type: string
 *               cinemaRoomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.put('/:seatId', seatController.updateSeat);

/**
 * @swagger
 * /api/seats/{seatId}:
 *   delete:
 *     summary: Delete a seat
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: seatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seat ID
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:seatId', seatController.deleteSeat);

/**
 * @swagger
 * /api/seats/showtime/{showtimeId}:
 *   get:
 *     summary: Get all seats for a showtime
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get('/showtime/:showtimeId', seatController.getSeatsByShowtimeId);

module.exports = router;
