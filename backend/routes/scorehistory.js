const express = require('express');
const router = express.Router();
const { getAllScoreHistory } = require('../controllers/scorehistory.controller');

/**
 * @swagger
 * /api/scorehistory:
 *   get:
 *     summary: Get all score history with flexible pagination
 *     tags: [ScoreHistory]
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
 *         description: Number of records per page (0 = all)
 *     responses:
 *       200:
 *         description: List of score history with pagination info
 *       500:
 *         description: Server error
 */
router.get('/', getAllScoreHistory);

/**
 * @swagger
 * /api/scorehistory/create:
 *   post:
 *     summary: Create score history for a booking
 *     tags: [ScoreHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MemberId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *               ChangeType:
 *                 type: string
 *                 default: add
 *               ChangeDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Score history created
 *       404:
 *         description: Booking not found for this user
 *       500:
 *         description: Server error
 */
router.post('/create', require('../controllers/scorehistory.controller').createScoreHistory);

/**
 * @swagger
 * /api/scorehistory/{id}:
 *   put:
 *     summary: Update score history by id
 *     tags: [ScoreHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ScoreHistoryId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ChangeType:
 *                 type: string
 *               ScoreValue:
 *                 type: number
 *               ChangeDate:
 *                 type: string
 *                 format: date-time
 *               UpdatedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Score history updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete score history by id
 *     tags: [ScoreHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ScoreHistoryId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DeletedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Score history deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put('/:id', require('../controllers/scorehistory.controller').updateScoreHistory);
router.delete('/:id', require('../controllers/scorehistory.controller').deleteScoreHistory);

module.exports = router; 