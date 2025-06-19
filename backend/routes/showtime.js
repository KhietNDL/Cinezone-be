const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtime.controller');
const { auth, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Showtime Management
 *   description: API endpoints for managing showtimes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Showtime:
 *       type: object
 *       required:
 *         - MovieId
 *         - CinemaRoomId
 *         - Duration
 *         - Day
 *         - Time
 *       properties:
 *         MovieId:
 *           type: string
 *           format: uuid
 *           description: The movie's UUID
 *         CinemaRoomId:
 *           type: string
 *           format: uuid
 *           description: The cinema room's UUID
 *         Duration:
 *           type: integer
 *           description: Duration of the movie in minutes
 *         Day:
 *           type: string
 *           format: date
 *           description: The day of the showtime (YYYY-MM-DD)
 *         Time:
 *           type: string
 *           format: time
 *           description: The time of the showtime (HH:mm:ss)
 */

/**
 * @swagger
 * /api/showtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [Showtime Management]
 *     responses:
 *       200:
 *         description: List of all showtimes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Showtime'
 *       401:
 *         description: Unauthorized
 */
router.get('/', showtimeController.getAllShowtimes);

/**
 * @swagger
 * /api/showtimes/search:
 *   get:
 *     summary: Search showtimes by day and time
 *     tags: [Showtime Management]
 *     parameters:
 *       - in: query
 *         name: Day
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The day of the showtime (YYYY-MM-DD)
 *       - in: query
 *         name: Time
 *         schema:
 *           type: string
 *           format: time
 *         required: false
 *         description: The time of the showtime (HH:mm:ss)
 *     responses:
 *       200:
 *         description: List of matching showtimes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Showtime'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.get('/search', showtimeController.searchShowtimes);

/**
 * @swagger
 * /api/showtimes/{id}:
 *   get:
 *     summary: Get showtime by ID
 *     tags: [Showtime Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The showtime ID
 *     responses:
 *       200:
 *         description: Showtime details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Showtime'
 *       400:
 *         description: Invalid UUID
 *       404:
 *         description: Showtime not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', showtimeController.getShowtimeById);

/**
 * @swagger
 * /api/showtimes/create:
 *   post:
 *     summary: Create a new showtime
 *     tags: [Showtime Management]
 *     security:
 *       - bearerAuth: []
 *     description: Only admin can create showtime
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MovieId
 *               - CinemaRoomId
 *               - Duration
 *               - Day
 *               - Time
 *             properties:
 *               MovieId:
 *                 type: string
 *                 format: uuid
 *                 description: The movie's UUID
 *               CinemaRoomId:
 *                 type: string
 *                 format: uuid
 *                 description: The cinema room's UUID
 *               Duration:
 *                 type: integer
 *                 description: Duration of the movie in minutes
 *               Day:
 *                 type: string
 *                 format: date
 *                 description: The day of the showtime (YYYY-MM-DD)
 *               Time:
 *                 type: string
 *                 format: time
 *                 description: The time of the showtime (HH:mm:ss)
 *     responses:
 *       201:
 *         description: Showtime created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Showtime'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/create', auth, isAdmin, showtimeController.createShowtime);

/**
 * @swagger
 * /api/showtimes/update/{id}:
 *   put:
 *     summary: Update a showtime
 *     tags: [Showtime Management]
 *     security:
 *       - bearerAuth: []
 *     description: Only admin can update showtime
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The showtime ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Showtime'
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Showtime'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Showtime not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put('/update/:id', auth, isAdmin, showtimeController.updateShowtime);

/**
 * @swagger
 * /api/showtimes/delete/{id}:
 *   delete:
 *     summary: Delete a showtime
 *     tags: [Showtime Management]
 *     security:
 *       - bearerAuth: []
 *     description: Only admin can delete showtime
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The showtime ID
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid UUID
 *       404:
 *         description: Showtime not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/delete/:id', auth, isAdmin, showtimeController.deleteShowtime);

/**
 * @swagger
 * /api/showtimes/{showtimeId}/seats:
 *   get:
 *     summary: Get seat map and status for a showtime
 *     tags: [Showtime Management]
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The showtime ID
 *     responses:
 *       200:
 *         description: List of seats with status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   seatId:
 *                     type: string
 *                   seatNumber:
 *                     type: string
 *                   type:
 *                     type: string
 *                   price:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [available, taken, holding]
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Internal server error
 */
router.get('/:showtimeId/seats', showtimeController.getSeatsByShowtime);

module.exports = router;