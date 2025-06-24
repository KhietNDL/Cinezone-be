const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeesbyName, getEmployeeById, getEmployeeByEmail, createEmployee, deleteEmployee, updateEmployee } = require('../controllers/employee.controller');
const { auth, isAdminOrEmployee } = require('../middlewares/auth.middleware');
const { validateEmployee } = require('../middlewares/employee.validator');

// Route to get all employees
/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: Get all employees with pagination
 *     tags: [Employee Management]
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
 *         description: Number of employees per page (0 = all employees)
 *     responses:
 *       200:
 *         description: Successfully retrieved all employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       UserId:
 *                         type: string
 *                       FullName:
 *                         type: string
 *                       DateOfBirth:
 *                         type: string
 *                       Sex:
 *                         type: integer
 *                       Email:
 *                         type: string
 *                       CCCD:
 *                         type: string
 *                       Address:
 *                         type: string
 *                       PhoneNumber:
 *                         type: string
 *                       CreatedAt:
 *                         type: string
 *                       avatar_url:
 *                         type: string
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
 *       500:
 *         description: Internal server error
 */
router.get('/', auth, isAdminOrEmployee, getAllEmployees);

// Route to get employees by name
/**
 * @swagger
 * /api/employee/searchByName:
 *   get:
 *     summary: Search employees by name
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the employee to search for
 *     responses:
 *       200:
 *         description: Successfully retrieved employees matching the search criteria
 *       500:
 *         description: Internal server error
 */

router.get('/searchByName', auth, isAdminOrEmployee, getEmployeesbyName);

// Route to get employee by ID
/**
 * @swagger
 * /api/employee/{userId}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the employee to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved employee details
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

router.get('/:userId', auth, isAdminOrEmployee, getEmployeeById);

// Route to get employee by email
/**
 * @swagger
 * /api/employee/email/{email}:
 *   get:
 *     summary: Get employee by email
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the employee to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved employee details
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.get('/email/:email', auth, isAdminOrEmployee, getEmployeeByEmail);

// Export the router to create a new employee
/**
 * @swagger
 * /api/employee/create:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *               Password:
 *                 type: string
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *               PhoneNumber:
 *                 type: string
 *               Sex:
 *                 type: integer
 *               Email:
 *                 type: string
 *               CCCD:
 *                 type: string
 *               Address:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               avatar_url:
 *                 type: string
 *                 description: "URL of the avatar image (optional, usually auto-generated after upload)"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/create', auth, isAdminOrEmployee, validateEmployee, createEmployee);

// Route to delete an employee
/**
 * @swagger
 * /api/employee/delete/{userId}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the employee to delete
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found or already deleted
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:userId', auth, isAdminOrEmployee, deleteEmployee);

// Route to update an employee
/**
 * @swagger
 * /api/employee/update/{userId}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               CCCD:
 *                 type: string
 *                 default: ""
 *               Email:
 *                 type: string
 *                 default: ""
 *               PhoneNumber:
 *                 type: string
 *                 default: ""
 *               Address:
 *                 type: string
 *                 default: ""
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 default: ""
 *               avatar_url:
 *                 type: string
 *                 default: ""
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:userId', auth, isAdminOrEmployee, validateEmployee, updateEmployee);

module.exports = router;
