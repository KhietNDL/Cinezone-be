const express = require('express');
const router = express.Router();
const { getAllUsers, getUsersbyName, getUserById, getUserByEmail, createUser, deleteUser, updateUser } = require('../controllers/user.management.controller');
const { auth, isAdmin } = require('../middlewares/auth.middleware');
const { validateUser } = require('../middlewares/user.management.validator');

// Route to get all users
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *       500:
 *         description: Internal server error
 */
router.get('/', auth, isAdmin, getAllUsers);

// Route to get users by name
/**
 * @swagger
 * /api/user/searchByName:
 *   get:
 *     summary: Search users by name
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the user to search for
 *     responses:
 *       200:
 *         description: Successfully retrieved users matching the search criteria
 *       500:
 *         description: Internal server error
 */
router.get('/searchByName', auth, isAdmin, getUsersbyName);

// Route to get user by ID
/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', auth, isAdmin, getUserById);

// Route to get user by email
/**
 * @swagger
 * /api/user/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/email/:email', auth, isAdmin, getUserByEmail);

// Route to create a new user
/**
 * @swagger
 * /api/user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *               Password:
 *                 type: string
 *               Sex:
 *                 type: integer
 *               Email:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *               Address:
 *                 type: string
 *               CCCD:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/create', auth, isAdmin, validateUser, createUser);

// Route to delete a user
/**
 * @swagger
 * /api/user/delete/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found or already deleted
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:userId', auth, isAdmin, deleteUser);

// Route to update a user
/**
 * @swagger
 * /api/user/update/{userId}:
 *   put:
 *     summary: Update a user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *                 default: ""
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *                 default: ""
 *               Password:
 *                 type: string
 *                 default: ""
 *               Sex:
 *                 type: integer
 *                 default: null
 *               Email:
 *                 type: string
 *                 default: ""
 *               PhoneNumber:
 *                 type: string
 *                 default: ""
 *               avatar_url:
 *                 type: string
 *                 default: ""
 *               Address:
 *                 type: string
 *                 default: ""
 *               CCCD:
 *                 type: string
 *                 default: ""
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:userId', auth, isAdmin, validateUser, updateUser);

module.exports = router;
