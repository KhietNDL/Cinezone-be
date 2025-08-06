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
 *     summary: Get revenue of this quarter with month details
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year to filter (default is current year)
 *     responses:
 *       200:
 *         description: Revenue of this quarter with month details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentYear:
 *                   type: integer
 *                   example: 2025
 *                 currentQuarter:
 *                   type: integer
 *                   example: 3
 *                 label:
 *                   type: string
 *                   example: "Q3"
 *                 startDate:
 *                   type: string
 *                   example: "2025-07-01"
 *                 endDate:
 *                   type: string
 *                   example: "2025-09-30"
 *                 monthRange:
 *                   type: string
 *                   example: "7-9"
 *                 months:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: integer
 *                         example: 7
 *                       monthName:
 *                         type: string
 *                         example: "July"
 *                       monthNameVN:
 *                         type: string
 *                         example: "Tháng 7"
 *                       total:
 *                         type: number
 *                         example: 25000000
 *                       bookingCount:
 *                         type: integer
 *                         example: 120
 *                 totalRevenue:
 *                   type: number
 *                   example: 75000000
 *                 totalBookings:
 *                   type: integer
 *                   example: 350
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

/**
 * @swagger
 * /api/analytics/user/age-groups-employees:
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
router.get('/user/age-groups-employees', analyticsController.getEmployeesAgeGroups);

/**
 * @swagger
 * /api/analytics/users/ranks:
 *   get:
 *     summary: Get users by membership rank based on accumulated points
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Users grouped by membership rank
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 250
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: string
 *                         example: "Bronze"
 *                       name:
 *                         type: string
 *                         example: "Đồng"
 *                       nameEN:
 *                         type: string
 *                         example: "Bronze"
 *                       minPoints:
 *                         type: integer
 *                         example: 0
 *                       maxPoints:
 *                         type: integer
 *                         example: 999
 *                       count:
 *                         type: integer
 *                         example: 150
 *       500:
 *         description: Internal server error
 */
router.get('/users/ranks', analyticsController.getUsersByMembershipRank);

/**
 * @swagger
 * /api/analytics/movies/genres:
 *   get:
 *     summary: Get movie genre distribution statistics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Movie genre statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   example: 150
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       genre:
 *                         type: string
 *                         example: "Action"
 *                       count:
 *                         type: integer
 *                         example: 45
 *                       percentage:
 *                         type: integer
 *                         example: 30
 *                 allGenres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       genre:
 *                         type: string
 *                         example: "Science Fiction"
 *                       count:
 *                         type: integer
 *                         example: 12
 *       500:
 *         description: Internal server error
 */
router.get('/movies/genres', analyticsController.getMovieGenreStats);

/**
 * @swagger
 * /api/analytics/employees/tenure:
 *   get:
 *     summary: Employee working time statistics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Employee working time statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEmployees:
 *                   type: integer
 *                   example: 25
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       group:
 *                         type: string
 *                         example: "1-2 năm"
 *                       nameEN:
 *                         type: string
 *                         example: "1-2 years"
 *                       total:
 *                         type: integer
 *                         example: 8
 *                       percentage:
 *                         type: integer
 *                         example: 32
 *                       order:
 *                         type: integer
 *                         example: 4
 *       500:
 *         description: Internal server error
 */
router.get('/employees/tenure', analyticsController.getEmployeeTenureStats);

/**
 * @swagger
 * /api/analytics/top-movies-by-tickets:
 *   get:
 *     summary: Get top movies by tickets
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *         description: Limit number of top movies (max 20, default 10)
 *       - in: query
 *         name: day
 *         schema:
 *           type: integer
 *         description: Filter by day (1-31)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g. 2024)
 *     responses:
 *       200:
 *         description: Top movies by tickets
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
 *                       movieId:
 *                         type: string
 *                         example: "603d2f2f2f2f2f2f2f2f2f2"
 *                       title:
 *                         type: string
 *                         example: "Avengers: Endgame"
 *                       ticketsSold:
 *                         type: integer
 *                         example: 150
 *       500:
 *         description: Internal server error
 */
router.get('/top-movies-by-tickets', analyticsController.getTopMoviesByTickets);

/**
 * @swagger
 * /api/analytics/top-genres-by-tickets:
 *   get:
 *     summary: Get top genres by tickets
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *         description: Limit number of top genres (max 20, default 5)
 *       - in: query
 *         name: day
 *         schema:
 *           type: integer
 *         description: Filter by day (1-31)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g. 2024)
 *     responses:
 *       200:
 *         description: Top genres by tickets
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
 *                       genre:
 *                         type: string
 *                         example: "Action"
 *                       ticketsSold:
 *                         type: integer
 *                         example: 300
 *       500:
 *         description: Internal server error
 */
router.get('/top-genres-by-tickets', analyticsController.getTopGenresByTickets);

module.exports = router;