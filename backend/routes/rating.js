const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { auth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     tags:
 *       - Rating
 *     summary: Create a new rating for a movie
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - rating
 *             properties:
 *               movieId:
 *                 type: string
 *                 description: The UUID of the movie to rate
 *                 example: "uuid-movie"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating score from 1 to 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Optional comment for the rating
 *                 example: "Great movie!"
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Invalid input or rating conditions not met
 *       401:
 *         description: Unauthorized (not logged in)
 *       500:
 *         description: Server error
 */
router.post('/', auth, ratingController.createRating);

/**
 * @swagger
 * /api/ratings/movie/{movieId}:
 *   get:
 *     tags:
 *       - Rating
 *     summary: Get all ratings for a specific movie
 *     parameters:
 *       - name: movieId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the movie
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of ratings per page
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [newest, oldest, rating_high, rating_low]
 *           default: newest
 *         description: Sort order for ratings
 *     responses:
 *       200:
 *         description: List of ratings and pagination info
 *       500:
 *         description: Server error
 */
router.get('/movie/:movieId', ratingController.getRatingsByMovie);

/**
 * @swagger
 * /api/ratings/{ratingId}:
 *   put:
 *     tags:
 *       - Rating
 *     summary: Update a rating
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ratingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the rating to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Updated rating score
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Updated comment (optional)
 *                 example: "Good movie"
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (not the owner)
 *       500:
 *         description: Server error
 *   delete:
 *     tags:
 *       - Rating
 *     summary: Delete a rating
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ratingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the rating to delete
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (not the owner)
 *       500:
 *         description: Server error
 */
router.put('/:ratingId', auth, ratingController.updateRating);
router.delete('/:ratingId', auth, ratingController.deleteRating);

/**
 * @swagger
 * /api/ratings/summary/{movieId}:
 *   get:
 *     tags:
 *       - Rating
 *     summary: Get rating summary for a movie
 *     parameters:
 *       - name: movieId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the movie
 *     responses:
 *       200:
 *         description: Rating summary for the movie
 *       500:
 *         description: Server error
 */
router.get('/summary/:movieId', ratingController.getMovieRatingSummary);



module.exports = router; 