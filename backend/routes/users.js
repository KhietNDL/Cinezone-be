const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {
    getAllUsers,
    getUsersbyName,
    getUserById,
    getUserByEmail,
    getUserByCCCD,
    getUserByPhoneNumber,
    createUser,
    deleteUser,
    updateUser
} = require("../controllers/user.management.controller");
const { createUserValidator, updateUserValidator } = require('../middlewares/user.management.validator');
const { auth, isAdmin, isAdminOrEmployee} = require("../middlewares/auth.middleware");
const { exchangeScore } = require("../controllers/user.controller");

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
router.get('/email/:email', auth, isAdminOrEmployee, getUserByEmail);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               password:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               phoneNumber:
 *                 type: string
 *               sex:
 *                 type: integer
 *               email:
 *                 type: string
 *               cccd:
 *                 type: string
 *               address:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  '/create',
  auth,
  isAdmin,
  upload.single('avatar'), // hoặc upload.none() nếu không upload file
  createUserValidator,
  createUser
);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               password:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               phoneNumber:
 *                 type: string
 *               sex:
 *                 type: integer
 *               email:
 *                 type: string
 *               cccd:
 *                 type: string
 *               address:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/update/:userId',
  auth,
  isAdmin,
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  updateUser
);

/**
 * @swagger
 * /api/user/cccd/{cccd}:
 *   get:
 *     summary: Get user by CCCD
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cccd
 *         required: true
 *         schema:
 *           type: string
 *         description: CCCD of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/cccd/:cccd', auth, isAdminOrEmployee, getUserByCCCD);

/**
 * @swagger
 * /api/user/phone/{phoneNumber}:
 *   get:
 *     summary: Get user by phone number
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Phone number of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/phone/:phoneNumber', auth, isAdminOrEmployee, getUserByPhoneNumber);

/**
 * @swagger
 * /api/user/{userId}/exchange-score:
 *   post:
 *     summary: Exchange score for money
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to exchange score
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pointsToExchange:
 *                 type: integer
 *                 description: Number of points to exchange
 *     responses:
 *       200:
 *         description: Score exchanged successfully
 *       400:
 *         description: Invalid request or insufficient score
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/:userId/exchange-score', auth, exchangeScore);

module.exports = router;
