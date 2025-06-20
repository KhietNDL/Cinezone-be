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
 * /api/showtimes/movie/{movieId}/day:
 *   get:
 *     summary: Get day by movieId
 *     tags: [Showtime Management]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The movie's UUID
 *     responses:
 *       200:
 *         description: List of showtimes for the movie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movieId:
 *                   type: string
 *                 showtimes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       showtimeId:
 *                         type: string
 *                       day:
 *                         type: string
 *                       time:
 *                         type: string
 *                       roomName:
 *                         type: string
 *       400:
 *         description: Invalid UUID
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 */
router.get('/movie/:movieId/day', showtimeController.getShowtimesByMovieId);

/**
 * @swagger
 * /api/showtimes/movie-name/{movieName}/showtimes:
 *   get:
 *     summary: Get showtimes by movie name
 *     tags: [Showtime Management]
 *     parameters:
 *       - in: path
 *         name: movieName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the movie
 *     responses:
 *       200:
 *         description: List of showtimes for the movie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movieName:
 *                   type: string
 *                 showtimes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: string
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 */
router.get('/movie-name/:movieName/showtimes', showtimeController.getShowtimesByMovieName);
/**
 * @swagger
 * /api/showtimes/time/{movieName}/day:
 *   get:
 *     summary: Get showtimes by movie name and day
 *     tags: [Showtime Management]
 *     parameters:
 *       - in: path
 *         name: movieName
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie's name (Vietnamese or English)
 *       - in: query
 *         name: day
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The day of the showtime (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of showtimes for the movie on the given day, grouped by version
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movieName:
 *                   type: string
 *                 day:
 *                   type: string
 *                 versions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       version:
 *                         type: string
 *                       showtimes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             showtimeId:
 *                               type: string
 *                             time:
 *                               type: string
 *                             roomName:
 *                               type: string
 */
router.get('/time/:movieName/day', showtimeController.getShowtimesByMovieNameAndDay);
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