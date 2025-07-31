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
 * /api/analytics/revenue/today:
 *   get:
 *     summary: Get revenue of today
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Revenue of today
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 1250000
 *                 bookingCount:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2025-07-31"
 *                     dayOfWeek:
 *                       type: integer
 *                       example: 4
 *                     dayName:
 *                       type: string
 *                       example: "Thursday"
 *                     dayNameVN:
 *                       type: string
 *                       example: "Thứ Năm"
 *                     total:
 *                       type: number
 *                       example: 1250000
 *                     bookingCount:
 *                       type: integer
 *                       example: 5
 *                     timeRange:
 *                       type: string
 *                       example: "08:30:00 - 17:45:22"
 *       500:
 *         description: Internal server error
 */
router.get('/revenue/today', analyticsController.getRevenueThisDay);

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

module.exports = router;