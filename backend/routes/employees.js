const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeesbyName, getEmployeeById, getEmployeeByEmail, createEmployee, deleteEmployee, updateEmployee } = require('../controllers/employee.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');
const { validateEmployee } = require('../middlewares/employee.validator');

// Route to get all employees
/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all employees
 *       500:
 *         description: Internal server error
 */
router.get('/', isAuthenticated, isAdmin, getAllEmployees);

// Route to get employees by name
/**
 * @swagger
 * /api/employee/searchByName:
 *   get:
 *     summary: Search employees by name
 *     tags: [Employees]
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

router.get('/searchByName', isAuthenticated, isAdmin, getEmployeesbyName);

// Route to get employee by ID
/**
 * @swagger
 * /api/employee/{userId}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
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

router.get('/:userId', isAuthenticated, isAdmin, getEmployeeById);

// Route to get employee by email
/**
 * @swagger
 * /api/employee/email/{email}:
 *   get:
 *     summary: Get employee by email
 *     tags: [Employees]
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
router.get('/email/:email', isAuthenticated, isAdmin, getEmployeeByEmail);

// Export the router to create a new employee
/**
 * @swagger
 * /api/employee/create:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
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
 *               CCCD:
 *                 type: string
 *               Email:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               Address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/create', isAuthenticated, isAdmin, validateEmployee, createEmployee);

// Route to delete an employee
/**
 * @swagger
 * /api/employee/delete/{userId}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
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
router.delete('/delete/:userId', isAuthenticated, isAdmin, deleteEmployee);

// Route to update an employee
/**
 * @swagger
 * /api/employee/update/{userId}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
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
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
er.put('/update/:userId', authisA isenticatedAdmin, validateEmployee, updateEmployee);

module.exports = router;
    