const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { auth } = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer();
/** 
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */
/** * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of products per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [ProductName, Price, Quantity, CreatedAt]
 *           default: ProductName
 *         required: false
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         required: false
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Internal server error
 */
router.get('/', productController.getAllProducts);
/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products by name with pagination and sorting
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product name to search (partial match)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [ProductName, Price, Quantity, CreatedAt]
 *           default: ProductName
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Products found
 *       400:
 *         description: Missing or invalid product name
 *       500:
 *         description: Internal server error
 */
router.get('/search', productController.searchProductsByName);
/** 
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:productId', productController.getProductById);
/** 
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ProductName:
 *                 type: string
 *               Description:
 *                 type: string
 *               Unit:
 *                 type: string
 *               Price:
 *                 type: number
 *               Quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/create', auth, upload.fields([{ name: 'image', maxCount: 1 }]), productController.createProduct);
/** 
 * @swagger
 * /api/products/{productId}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ProductName:
 *                 type: string
 *               Description:
 *                 type: string
 *               Unit:
 *                 type: string
 *               Price:
 *                 type: number
 *               Quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:productId', auth, upload.fields([{ name: 'image', maxCount: 1 }]), productController.updateProduct);
/** 
 * @swagger
 * /api/products/{productId}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:productId', auth, productController.deleteProduct);
/** 
 * @swagger
 * /api/products/combo-children/{productId}:
 *   get:
 *     summary: Get children products of a combo by combo ProductId
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Children products of combo
 *       404:
 *         description: Combo product not found or not a combo
 *       500:
 *         description: Internal server error
 */
router.get('/combo-children/:productId', productController.getComboChildren);


module.exports = router;