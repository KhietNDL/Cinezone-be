const { body, validationResult } = require('express-validator');

const movieValidationRules = [
  body('NameOfVietnamese')
    .notEmpty().withMessage('Vietnamese movie name is required')
    .isLength({ max: 255 }).withMessage('Vietnamese movie name cannot exceed 255 characters'),
  
  body('NameOfEnglish')
    .notEmpty().withMessage('English movie name is required')
    .isLength({ max: 255 }).withMessage('English movie name cannot exceed 255 characters'),
  
  body('FromDate')
    .notEmpty().withMessage('Start date is required')
    .isDate().withMessage('Start date must be in yyyy-mm-dd format'),
  
  body('ToDate')
    .notEmpty().withMessage('End date is required')
    .isDate().withMessage('End date must be in yyyy-mm-dd format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.FromDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('RunningTime')
    .notEmpty().withMessage('Running time is required')
    .isInt({ min: 1 }).withMessage('Running time must be a positive integer'),
  
  body('ProductionCompany')
    .isLength({ max: 255 }).withMessage('Production company name cannot exceed 255 characters'),
  
  body('Director')
    .isLength({ max: 255 }).withMessage('Director name cannot exceed 255 characters'),
  
  body('Version')
    .isLength({ max: 50 }).withMessage('Version cannot exceed 50 characters'),
  
  body('TrailerUrl')
    .optional()
    .isURL().withMessage('Trailer URL is invalid'),
  
  body('PosterImage')
    .optional()
    .isURL().withMessage('Poster image URL is invalid')
];

// Middleware to validate data
const validateMovie = async (req, res, next) => {
  try {
    const isUpdate = req.method === 'PUT';
    
    // If update, only validate the fields being sent
    const rules = isUpdate 
      ? movieValidationRules.filter(rule => {
          const field = rule.builder.fields[0];
          return req.body[field] !== undefined;
        })
      : movieValidationRules;
      
    await Promise.all(rules.map(rule => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  } catch (error) {
    console.error("Validation error:", error);
    return res.status(500).json({ error: "Validation failed" });
  }
};

const validatePatchMovie = async (req, res, next) => {
  try {
    const rulesToApply = movieValidationRules.filter(rule => {
      const field = rule.builder.fields[0];
      return req.body[field] !== undefined && req.body[field] !== "";
    });
    
    await Promise.all(rulesToApply.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  } catch (error) {
    console.error("Validation error:", error);
    return res.status(500).json({ error: "Validation failed" });
  }
};

module.exports = {
  validateMovie,
  validatePatchMovie
};