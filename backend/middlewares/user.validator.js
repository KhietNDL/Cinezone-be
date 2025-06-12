const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

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

const registerValidation = [
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/)
        .withMessage('Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character')
        .custom((val) => !/\s/.test(val)).withMessage('Password must not contain whitespace'),
    body('fullName')
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 6, max: 100 }).withMessage('Full name must be 6-100 characters')
        .custom((val) => val.trim() === val).withMessage('Full name must not have leading or trailing spaces')
        .matches(/^[A-Za-zÀ-ỹ\s]+$/).withMessage('Full name must not contain numbers or special characters'),
    body('dateOfBirth')
        .notEmpty().withMessage('Date of birth is required')
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
        .custom((val) => new Date(val) <= new Date()).withMessage('Date of birth cannot be in the future'),
    body('sex')
        .isInt({ min: 1, max: 3 })
        .withMessage('Sex must be 1 (male), 2 (female), or 3 (other)')
        .notEmpty().withMessage('Sex is required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .isLength({ max: 255 }).withMessage('Email must be at most 255 characters')
        .custom((val) => val === val.toLowerCase()).withMessage('Email must be lowercase')
        .custom((val) => !/\s/.test(val)).withMessage('Email must not contain whitespace'),
    body('phoneNumber')
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('cccd')
        .optional()
        .matches(/^\d{12}$/).withMessage('CCCD must be exactly 12 digits'),
    validate
];

const forgotPasswordValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .notEmpty()
        .withMessage('Email is required'),
    validate
];

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

const updateProfileValidation = [
    body('fullName')
        .optional()
        .isLength({ min: 6, max: 100 }).withMessage('Full name must be 6-100 characters')
        .custom((val) => val === undefined || val.trim() === val).withMessage('Full name must not have leading or trailing spaces')
        .matches(/^[A-Za-zÀ-ỹ\s]+$/).withMessage('Full name must not contain numbers or special characters'),
    body('password')
        .optional()
        .isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/)
        .withMessage('Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character')
        .custom((val) => val === undefined || !/\s/.test(val)).withMessage('Password must not contain whitespace'),
    body('dateOfBirth')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
        .custom((val) => val === undefined || new Date(val) <= new Date()).withMessage('Date of birth cannot be in the future'),
    body('phoneNumber')
        .optional()
        .matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('sex')
        .optional()
        .isInt({ min: 1, max: 3 }).withMessage('Sex must be a number between 1 and 3'),
    body('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: 255 }).withMessage('Email must be at most 255 characters')
        .custom((val) => val === undefined || val === val.toLowerCase()).withMessage('Email must be lowercase')
        .custom((val) => val === undefined || !/\s/.test(val)).withMessage('Email must not contain whitespace'),
    body('cccd')
        .optional()
        .matches(/^\d{12}$/).withMessage('CCCD must be exactly 12 digits'),
    body('address')
        .optional()
        .isString().withMessage('Address must be a string'),
];

module.exports = {
    loginValidation,
    registerValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    updateProfileValidation
}; 