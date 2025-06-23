const express = require("express");
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user.controller');
const {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
  updateProfile,
  getUserById,
} = require("../controllers/user.controller");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyOtpValidation,
  resetPasswordValidation,
  updateProfileValidation,
} = require("../middlewares/user.validator");
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const passport = require("../middlewares/passport");
const jwt = require("jsonwebtoken");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // check type file
    if (file.fieldname === 'avatar_url') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Avatart must be an image file'));
      }
    } else {
      cb(null, true);
    }
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - dateOfBirth
 *               - sex
 *               - phoneNumber
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: User's email address (must be lowercase, no whitespace)
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *                 description: User's password (8-128 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character, no whitespace)
 *               fullName:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 100
 *                 description: User's full name (6-100 chars, no numbers or special characters, no leading/trailing spaces)
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth (YYYY-MM-DD, not in the future)
 *               sex:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 description: 1 for male, 2 for female, 3 for other
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number (exactly 10 digits)
 *               cccd:
 *                 type: string
 *                 description: Citizen ID (exactly 12 digits, optional)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post("/register", registerValidation, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user with email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: User's email address (must be lowercase, no whitespace)
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *                 description: User's password (8-128 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character, no whitespace)
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid mail or password
 *       500:
 *         description: Server error
 */
router.post("/login", loginValidation, login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Reset code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetCode
 *             properties:
 *               resetCode:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 description: 6-digit reset code received via email
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *       400:
 *         description: Validation error or invalid/expired reset code
 *       500:
 *         description: Server error
 */
router.post("/verify-otp", verifyOtpValidation, verifyOtp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with new password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *                 description: New password (must contain uppercase, lowercase, number, special character)
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *       400:
 *         description: Validation error or please verify OTP first
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/reset-password", resetPasswordValidation, resetPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Please authenticate.
 *       500:
 *         description: Server error
 */
router.post("/logout", auth, logout);

/**
 * @swagger
 * /api/auth/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Get Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID (UUID format)
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     phoneNumber:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     sex:
 *                       type: integer
 *                       enum: [1, 2, 3]
 *                     cccd:
 *                       type: string
 *                     address:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/user/:id", auth, getUserById);

/**
 * @swagger
 * /api/auth/profile/{id}:
 *   put:
 *     summary: Update user profile by ID
 *     tags: [Edit Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID (UUID format)
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
 *                 minLength: 6
 *                 maxLength: 100
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               phoneNumber:
 *                 type: string
 *               sex:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *               cccd:
 *                 type: string
 *               address:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: User's avatar image file
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid updates or invalid UUID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/profile/:id", 
  auth, 
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  updateProfileValidation, 
  UserController.updateProfile
);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Login with Google OAuth2
 *     description: Redirect to Google for authentication, then return token.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth2
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     description: Process callback from Google, return token and user.
 *     tags: [Authentication]
 *     responses:
 *       200:
    *         description: Login successful, return token and user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                       format: email
 *                     fullName:
 *                       type: string
 *       401:
 *         description: Login failed
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
    failureMessage: true
  }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        error: req.authInfo?.message || 'Đăng nhập Google thất bại'
      });
    }

    const token = jwt.sign(
      { id: req.user.UserId, email: req.user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user: req.user });
  }
);

module.exports = router;

  }
);

module.exports = router;
