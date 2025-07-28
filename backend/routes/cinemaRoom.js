const express = require('express');
const router = express.Router();
const {
    getAllCinemaRooms,
    getCinemaRoomById,
    createCinemaRoom,
    updateCinemaRoom,
    deleteCinemaRoom
} = require('../controllers/cinemaRoom.controller');
const { auth, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Cinema Room Management
 *   description: API endpoints for managing cinema rooms (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CinemaRoom:
 *       type: object
 *       required:
 *         - Name
 *         - SeatQuantity
 *         - Type
 *       properties:
 *         CinemaRoomId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the cinema room
 *         Name:
 *           type: string
 *           description: The name of the cinema room
 *         SeatQuantity:
 *           type: integer
 *           description: Total number of seats in the room
 *         Type:
 *           type: string
 *           description: Type of the cinema room (2D, 3D, IMAX, etc.)
 */

/**
 * @swagger
 * /api/cinema-rooms:
 *   get:
 *     summary: Get all cinema rooms (with pagination, sort)
 *     description: Retrieve a list of all cinema rooms in the system
 *     tags: [Cinema Room Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page (default 10)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (Name, SeatQuantity, Type, CreatedAt)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (ASC or DESC)
 *     responses:
 *       200:
 *         description: List of all cinema rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rooms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CinemaRoom'
 *                 total:
 *                   type: integer
 *                   description: Total number of cinema rooms
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', auth, isAdmin, getAllCinemaRooms);

/**
 * @swagger
 * /api/cinema-rooms/search:
 *   get:
 *     summary: Search cinema rooms by name with pagination and sorting
 *     description: Search for cinema rooms by name (admin only)
 *     tags: [Cinema Room Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name (or part of name) of the cinema room
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page (default 10)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [Name, SeatQuantity, Type, CreatedAt]
 *           default: Name
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Sort order (ASC or DESC)
 *     responses:
 *       200:
 *         description: List of matching cinema rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rooms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CinemaRoom'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       400:
 *         description: Missing name query parameter
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/search', auth, isAdmin, (req, res, next) => { console.log('Hit /search route'); next(); }, require('../controllers/cinemaRoom.controller').searchCinemaRoomsByName);

/**
 * @swagger
 * /api/cinema-rooms/{id}:
 *   get:
 *     summary: Get cinema room by ID
 *     description: Retrieve detailed information about a specific cinema room
 *     tags: [Cinema Room Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The cinema room ID (UUID format)
 *     responses:
 *       200:
 *         description: Cinema room details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CinemaRoom'
 *       404:
 *         description: Cinema room not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/:id', auth, isAdmin, (req, res, next) => { console.log('Hit /:id route with id:', req.params.id); next(); }, getCinemaRoomById);

/**
 * @swagger
 * /api/cinema-rooms/create:
 *   post:
 *     summary: Create new cinema room with automatic seat generation
 *     description: Add a new cinema room to the system and automatically generate seats based on the specified quantity. Seats are created in a grid pattern (A-J rows, 1-12 columns) with automatic type assignment (A-C=Normal, D-I=VIP, J=Couple).
 *     tags: [Cinema Room Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - SeatQuantity
 *               - Type
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Name of the cinema room
 *               SeatQuantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 description: Total number of seats (max 120 - grid capacity 10 rows × 12 columns)
 *               Type:
 *                 type: string
 *                 description: Type of the cinema room (e.g. 2D, 3D, VIP, etc.)
 *     responses:
 *       201:
 *         description: Cinema room and seats created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 room:
 *                   $ref: '#/components/schemas/CinemaRoom'
 *                 seatsGenerated:
 *                   type: integer
 *                   description: Number of seats automatically generated
 *       400:
 *         description: Bad request (invalid input, duplicate name, or seat quantity exceeds limit)
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/create', auth, isAdmin, createCinemaRoom);

/**
 * @swagger
 * /api/cinema-rooms/update/{id}:
 *   put:
 *     summary: Update cinema room
 *     description: Modify information of an existing cinema room
 *     tags: [Cinema Room Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The cinema room ID (UUID format)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: New name for the cinema room
 *               SeatQuantity:
 *                 type: integer
 *                 description: Updated total number of seats
 *               Type:
 *                 type: string
 *                 description: Updated type of the cinema room
 *     responses:
 *       200:
 *         description: Cinema room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CinemaRoom'
 *       404:
 *         description: Cinema room not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put('/update/:id', auth, isAdmin, updateCinemaRoom);

/**
 * @swagger
 * /api/cinema-rooms/delete/{id}:
 *   delete:
 *     summary: Delete cinema room
 *     description: Remove a cinema room from the system
 *     tags: [Cinema Room Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The cinema room ID (UUID format)
 *     responses:
 *       200:
 *         description: Cinema room deleted successfully
 *       404:
 *         description: Cinema room not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/delete/:id', auth, isAdmin, deleteCinemaRoom);

module.exports = router;
