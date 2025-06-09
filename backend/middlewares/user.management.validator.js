const { body, validationResult } = require('express-validator');
const UserManagement = require('../models/user.management.model');

// Validation rules
const userValidationRules = () => {
    return [
        // Password validation
        body('Password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
            .not().contains(' ').withMessage('Password cannot contain spaces'),

        // Full Name validation
        body('FullName')
            .notEmpty().withMessage('Full name is required')
            .isLength({ min: 6, max: 100 }).withMessage('Full name must be between 6 and 100 characters')
            .matches(/^[a-zA-ZÀ-ỹ\s]*$/).withMessage('Full name cannot contain numbers or special characters')
            .trim()
            .customSanitizer(value => {
                // Remove extra spaces between words
                return value.replace(/\s+/g, ' ');
            }),

        // Date of Birth validation
        body('DateOfBirth')
            .notEmpty().withMessage('Date of birth is required')
            .isISO8601().withMessage('Date of birth must be in YYYY-MM-DD format')
            .custom((value) => {
                const birthDate = new Date(value);
                const today = new Date();
                if (birthDate > today) {
                    throw new Error('Date of birth cannot be in the future');
                }
                return true;
            }),

        // Email validation
        body('Email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email format')
            .isLength({ max: 255 }).withMessage('Email cannot exceed 255 characters')
            .normalizeEmail() // Convert to lowercase
            .custom(async (value) => {
                const existingUser = await UserManagement.getUserByEmail(value);
                if (existingUser) {
                    throw new Error('Email already exists in the system');
                }
                return true;
            })
            .not().contains(' ').withMessage('Email cannot contain spaces'),

        // Phone Number validation
        body('PhoneNumber')
            .notEmpty().withMessage('Phone number is required')
            .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),

        // avatar_url validation
        body('avatar_url')
            .optional()
            .isURL().withMessage('Avatar URL must be a valid URL')
            .isLength({ max: 2000 }).withMessage('Avatar URL is too long'),

        // Address validation
        body('Address')
            .notEmpty().withMessage('Address is required')
            .isLength({ max: 255 }).withMessage('Address cannot exceed 255 characters'),

        // CCCD validation
        body('CCCD')
            .notEmpty().withMessage('Citizen ID is required')
            .matches(/^[0-9]{12}$/).withMessage('Citizen ID must be 12 digits'),
    ];
};

// Middleware to validate user data
const validateUser = async (req, res, next) => {
    try {
        // Run validation rules
        await Promise.all(userValidationRules().map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: errors.array() 
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error during validation',
            error: error.message 
        });
    }
};

module.exports = {
    validateUser
};
