const { body, validationResult } = require('express-validator');
const UserManagement = require('../models/user.management.model');


const createUserValidator = [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    // ... các rule khác
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const updateUserValidator = [
    // Các rule cho update (có thể optional)
    body('email').optional().isEmail().withMessage('Email is invalid'),
    // ...
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    createUserValidator,
    updateUserValidator
};
