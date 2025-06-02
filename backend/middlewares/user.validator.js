const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Login validation rules
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .notEmpty()
        .withMessage('Email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),
    validate
];

// Register validation rules
const registerValidation = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),
    body('fullName')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters')
        .notEmpty()
        .withMessage('Full name is required'),
    body('dateOfBirth')
        .isDate()
        .withMessage('Please enter a valid date of birth')
        .notEmpty()
        .withMessage('Date of birth is required'),
    body('sex')
        .isInt({ min: 0, max: 2 })
        .withMessage('Sex must be 0 (male), 1 (female), or 2 (other)')
        .notEmpty()
        .withMessage('Sex is required'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .notEmpty()
        .withMessage('Email is required'),
    body('phoneNumber')
        .matches(/^[0-9]{10,15}$/)
        .withMessage('Please enter a valid phone number (10-15 digits)')
        .notEmpty()
        .withMessage('Phone number is required'),
    validate
];

// Forgot password validation rules
const forgotPasswordValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .notEmpty()
        .withMessage('Email is required'),
    validate
];

// Reset password validation rules
const resetPasswordValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .notEmpty()
        .withMessage('Email is required'),
    body('resetCode')
        .isLength({ min: 6, max: 6 })
        .withMessage('Reset code must be exactly 6 digits')
        .isNumeric()
        .withMessage('Reset code must contain only numbers')
        .notEmpty()
        .withMessage('Reset code is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .notEmpty()
        .withMessage('New password is required'),
    validate
];

module.exports = {
    loginValidation,
    registerValidation,
    forgotPasswordValidation,
    resetPasswordValidation
}; 