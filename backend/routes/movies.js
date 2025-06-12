const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');

/**
 * @swagger
 * /api/movies/{movieId}/showtimes:
 *   get:
 *     summary: Get all versions, showtimes, and rooms for a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.get('/:movieId/showtimes', movieController.getMovieShowtimes);

/**
 * @swagger
 * /api/movies/vietnamese/{nameOfVietnamese}/showtimes:
 *   get:
 *     summary: Get showtimes for a movie by its Vietnamese name
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nameOfVietnamese
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie Vietnamese name
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.get('/vietnamese/:nameOfVietnamese/showtimes', movieController.getMovieShowtimesByVietnameseName);

/**
 * @swagger
 * /api/movies/english/{nameOfEnglish}/showtimes:
 *   get:
 *     summary: Get showtimes for a movie by its English name
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nameOfEnglish
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie English name
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.get('/english/:nameOfEnglish/showtimes', movieController.getMovieShowtimesByEnglishName);

module.exports = router;
