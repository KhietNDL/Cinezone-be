const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  getEmployeesbyName,
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  deleteEmployee,
  updateEmployee,
  findEmployeesByInfo,
  unbanEmployee,
} = require("../controllers/employee.controller");
const { auth, isAdminOrEmployee, isAdmin } = require("../middlewares/auth.middleware");
const { validateEmployee } = require("../middlewares/employee.validator");
const multer = require("multer");
const upload = multer();

// Route to get all employees
/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: Get all employees with pagination and sorting
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
 *         description: Number of employees per page (0 = all)
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, new]
 *         description: Filter employees by status (active = IsDeleted 0, inactive = IsDeleted 1, new = IsDeleted 0 và CreatedAt trong 30 ngày gần nhất)
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", auth, isAdminOrEmployee, getAllEmployees);

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

router.get("/searchByName", auth, isAdminOrEmployee, getEmployeesbyName);

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

router.get("/:userId", auth, isAdminOrEmployee, getEmployeeById);

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
router.get("/email/:email", auth, isAdminOrEmployee, getEmployeeByEmail);

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
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create",
  auth,
  isAdminOrEmployee,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  validateEmployee,
  createEmployee
);

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
router.delete("/delete/:userId", auth, isAdminOrEmployee, deleteEmployee);

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
 *               fullName:
 *                 type: string
 *                 default: ""
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 default: ""
 *               password:
 *                 type: string
 *                 default: ""
 *               sex:
 *                 type: integer
 *                 default: null
 *               cccd:
 *                 type: string
 *                 default: ""
 *               email:
 *                 type: string
 *                 default: ""
 *               phoneNumber:
 *                 type: string
 *                 default: ""
 *               address:
 *                 type: string
 *                 default: ""
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 default: ""
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/update/:userId",
  auth,
  isAdminOrEmployee,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  validateEmployee,
  updateEmployee
);

/**
 * @swagger
 * /api/employee/search/info:
 *   get:
 *     summary: Search employees by email, CCCD, phone, or name (partial match, pagination, sorting)
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Partial or full email to search
 *       - in: query
 *         name: cccd
 *         schema:
 *           type: string
 *         description: Partial or full CCCD to search
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Partial or full phone number to search
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial or full name to search
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
 *         description: Number of employees per page (0 = all)
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
 *         description: Employees found
 *       500:
 *         description: Internal server error
 */
router.get('/search/info', auth, isAdminOrEmployee, findEmployeesByInfo);

/**
 * @swagger
 * /api/employee/unban/{userId}:
 *   post:
 *     summary: Unban (restore) a soft-deleted employee
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the employee to unban
 *     responses:
 *       200:
 *         description: Employee unbanned successfully
 *       404:
 *         description: Employee not found or not banned
 *       500:
 *         description: Internal server error
 */
router.post('/unban/:userId', auth, isAdmin, unbanEmployee);

module.exports = router;
