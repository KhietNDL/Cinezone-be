const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

/**
 * @swagger
 * /api/analytics/revenue/month:
 *   get:
 *     summary: Get revenue by month
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year to filter (default is current year)
 *     responses:
 *       200:
 *         description: Revenue by month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 8771.11
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: Tháng 3
 *                       total:
 *                         type: number
 *                         example: 8771.11
 *       500:
 *         description: Internal server error
 */
router.get('/revenue/month', analyticsController.getRevenueByMonth);

/**
 * @swagger
 * /api/analytics/revenue/quarter:
 *   get:
 *     summary: Get revenue by quarter
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year to filter (default is current year)
 *     responses:
 *       200:
 *         description: Revenue by quarter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                       total:
 *                         type: number
 *       500:
 *         description: Internal server error
 */
router.get('/revenue/quarter', analyticsController.getRevenueByQuarter);

/**
 * @swagger
 * /api/analytics/revenue/this-month:
 *   get:
 *     summary: Get revenue of this month
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Revenue of this month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get('/revenue/this-month', analyticsController.getRevenueThisMonth);

/**
 * @swagger
 * /api/analytics/revenue/this-week:
 *   get:
 *     summary: Get revenue of this week
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Revenue of this week
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get('/revenue/this-week', analyticsController.getRevenueThisWeek);

/**
 * @swagger
 * /api/analytics/revenue/this-quarter:
 *   get:
 *     summary: Get revenue of this quarter
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Revenue of this quarter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get('/revenue/this-quarter', analyticsController.getRevenueThisQuarter);

/**
 * @swagger
 * /api/analytics/user/age-groups:
 *   get:
 *     summary: Get ticket buyer age groups
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Age group statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ageGroup:
 *                         type: string
 *                         example: 18-24
 *                       total:
 *                         type: integer
 *                         example: 123
 *       500:
 *         description: Internal server error
 */
router.get('/user/age-groups', analyticsController.getUserAgeGroups);

/**
 * @swagger
 * /api/analytics/tickets/stats:
 *   get:
 *     summary: Get ticket statistics by day, month, or year
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *         required: true
 *         description: Statistic type (day, month, year)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Year for statistics
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *         description: Month for statistics (required if type=day)
 *     responses:
 *       200:
 *         description: Statistic result list
 *       400:
 *         description: Missing parameters
 *       500:
 *         description: Internal server error
 */
router.get('/tickets/stats', analyticsController.getTicketStats);

module.exports = router;