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
const userController = require('../controllers/user.controller');

// Route to get all users
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users with pagination and sorting
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of users per page (0 = all)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [FullName, DateOfBirth, Email, PhoneNumber, CreatedAt]
 *           default: FullName
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', auth, isAdmin, getAllUsers);

// Route to get users by name
/**
 * @swagger
 * /api/user/searchByName:
 *   get:
 *     summary: Search users by name (supports partial match, pagination, and sorting)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Partial or full name of the user to search for
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
 *         description: Number of users per page (0 = all)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [FullName, DateOfBirth, Email, PhoneNumber, CreatedAt]
 *           default: FullName
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order (asc or desc)
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
 *     summary: Search users by email (supports partial match, pagination, and sorting)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Partial or full email of the user to search for
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
 *         description: Number of users per page (0 = all)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [FullName, DateOfBirth, Email, PhoneNumber, CreatedAt]
 *           default: FullName
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: Successfully retrieved users matching the search criteria
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
  upload.single('avatar'),
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
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *                 description: (Optional) Related booking ID for this exchange
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

/**
 * @swagger
 * /api/user/{userId}/membership:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Get membership info of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (UUID)
 *     responses:
 *       200:
 *         description: Membership info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 membership:
 *                   type: object
 *                   properties:
 *                     UserId: { type: string }
 *                     FullName: { type: string }
 *                     Email: { type: string }
 *                     ScoreBalance: { type: integer }
 *                     TotalAccumulatedPoints: { type: integer }
 *                     MembershipTypeId: { type: string }
 *                     MembershipStartDate: { type: string }
 *                     MembershipEndDate: { type: string }
 *                     MembershipStatus: { type: string }
 *                     MembershipName: { type: string }
 *                     MinPoint: { type: integer }
 *                     DiscountTicket: { type: number }
 *                     PointMultiplier: { type: number }
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:userId/membership', userController.getMembershipInfo);

module.exports = router;
