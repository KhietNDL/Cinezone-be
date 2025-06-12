const Promotion = require('../models/promotion.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { validate: uuidValidate } = require('uuid');
const NodeCache = require('node-cache');

// Define error codes for promotion operations
const ERROR_CODES = {
    PROMOTION_NOT_FOUND: 'PROMO_001',
    INVALID_UUID: 'PROMO_002',
    INVALID_DISCOUNT: 'PROMO_003',
    INVALID_DATE_RANGE: 'PROMO_004',
    INVALID_FILE: 'PROMO_005',
    SERVER_ERROR: 'PROMO_006',
    INVALID_INPUT: 'PROMO_007',
    DUPLICATE_TITLE: 'PROMO_008'
};

// Configure cache with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300 });

// Helper function to format promotion data
const formatPromotionData = (promotion) => ({
    Id: promotion.Id,
    Title: promotion.Title,
    StartTime: promotion.StartTime,
    EndTime: promotion.EndTime,
    DiscountValue: promotion.DiscountValue,
    Detail: promotion.Detail,
    Image: promotion.Image
});

// Helper function to clear promotion cache
const clearPromotionCache = () => {
    cache.del('all_promotions');
    cache.keys().forEach(key => {
        if (key.startsWith('promotion_')) {
            cache.del(key);
        }
    });
};

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/promotions';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for image upload
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
    }

    if (file.size > maxSize) {
        return cb(new Error('File size too large. Maximum size is 5MB.'), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).single('image');

// Validation middleware
const validatePromotionData = (req, res, next) => {
    const { title, startTime, endTime, discountValue } = req.body;

    if (!title || !startTime || !endTime || !discountValue) {
        return res.status(400).json({
            error: 'Missing required fields: title, startTime, endTime, discountValue',
            code: ERROR_CODES.INVALID_INPUT
        });
    }

    // Validate discount value
    const discount = parseFloat(discountValue);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
        return res.status(400).json({
            error: 'Discount value must be between 0 and 100',
            code: ERROR_CODES.INVALID_DISCOUNT
        });
    }

    // Validate date range
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
            error: 'Invalid date format',
            code: ERROR_CODES.INVALID_DATE_RANGE
        });
    }
    if (start >= end) {
        return res.status(400).json({
            error: 'End time must be after start time',
            code: ERROR_CODES.INVALID_DATE_RANGE
        });
    }

    next();
};

// Get all promotions
const getAllPromotions = async (_, res) => {
    try {
        // Check cache first
        const cachedPromotions = cache.get('all_promotions');
        if (cachedPromotions) {
            return res.json({
                message: 'Promotions retrieved successfully (cached)',
                promotions: cachedPromotions
            });
        }

        const promotions = await Promotion.getAllPromotions();
        const formattedPromotions = promotions.map(formatPromotionData);

        // Cache the results
        cache.set('all_promotions', formattedPromotions);

        res.json({
            message: 'Promotions retrieved successfully',
            promotions: formattedPromotions
        });
    } catch (error) {
        console.error('Get all promotions error:', error);
        res.status(500).json({
            error: 'Internal server error while retrieving promotions',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

// Get promotion by ID
const getPromotionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID format
        if (!uuidValidate(id)) {
            return res.status(400).json({
                error: 'Invalid UUID format',
                code: ERROR_CODES.INVALID_UUID
            });
        }

        // Check cache first
        const cacheKey = `promotion_${id}`;
        const cachedPromotion = cache.get(cacheKey);
        if (cachedPromotion) {
            return res.json({
                message: 'Promotion retrieved successfully (cached)',
                promotion: cachedPromotion
            });
        }

        const promotion = await Promotion.getPromotionById(id);
        if (!promotion) {
            return res.status(404).json({
                error: 'Promotion not found',
                code: ERROR_CODES.PROMOTION_NOT_FOUND
            });
        }

        const formattedPromotion = formatPromotionData(promotion);
        cache.set(cacheKey, formattedPromotion);

        res.json({
            message: 'Promotion retrieved successfully',
            promotion: formattedPromotion
        });
    } catch (error) {
        console.error('Get promotion by ID error:', error);
        res.status(500).json({
            error: 'Internal server error while retrieving promotion',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

// Create new promotion
const createPromotion = async (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(400).json({
                error: err.message,
                code: ERROR_CODES.INVALID_FILE
            });
        }

        try {
            const {
                title,
                startTime,
                endTime,
                discountValue,
                detail
            } = req.body;

            // Validate promotion data
            validatePromotionData(req, res, async () => {
                // Check for duplicate title
                const existingPromotion = await Promotion.findByTitle(title);
                if (existingPromotion) {
                    return res.status(400).json({
                        error: 'A promotion with this title already exists',
                        code: ERROR_CODES.DUPLICATE_TITLE
                    });
                }

                const imagePath = req.file ? `/uploads/promotions/${req.file.filename}` : null;
                const CreatedBy = req.user.UserId;

                const id = await Promotion.createPromotion({
                    Title: title,
                    StartTime: startTime,
                    EndTime: endTime,
                    DiscountValue: discountValue,
                    Detail: detail,
                    Image: imagePath,
                    CreatedBy
                });

                const newPromotion = await Promotion.getPromotionById(id);
                const formattedPromotion = formatPromotionData(newPromotion);

                // Clear cache
                clearPromotionCache();

                res.status(201).json({
                    message: 'Promotion created successfully',
                    promotion: formattedPromotion
                });
            });
        } catch (error) {
            console.error('Create promotion error:', error);
            // Clean up uploaded file if exists
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({
                error: 'Internal server error while creating promotion',
                code: ERROR_CODES.SERVER_ERROR
            });
        }
    });
};

// Update promotion
const updatePromotion = async (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(400).json({
                error: err.message,
                code: ERROR_CODES.INVALID_FILE
            });
        }

        try {
            const { id } = req.params;

            // Validate UUID format
            if (!uuidValidate(id)) {
                return res.status(400).json({
                    error: 'Invalid UUID format',
                    code: ERROR_CODES.INVALID_UUID
                });
            }

            const promotion = await Promotion.getPromotionById(id);
            if (!promotion) {
                return res.status(404).json({
                    error: 'Promotion not found',
                    code: ERROR_CODES.PROMOTION_NOT_FOUND
                });
            }

            // Validate promotion data
            validatePromotionData(req, res, async () => {
                const {
                    title,
                    startTime,
                    endTime,
                    discountValue,
                    detail
                } = req.body;

                // Check for duplicate title (excluding current promotion)
                if (title !== promotion.Title) {
                    const existingPromotion = await Promotion.findByTitle(title);
                    if (existingPromotion) {
                        return res.status(400).json({
                            error: 'A promotion with this title already exists',
                            code: ERROR_CODES.DUPLICATE_TITLE
                        });
                    }
                }

                // Delete old image if new image is uploaded
                if (req.file && promotion.Image) {
                    const oldImagePath = path.join(__dirname, '..', promotion.Image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                const imagePath = req.file ? `/uploads/promotions/${req.file.filename}` : promotion.Image;
                const UpdatedBy = req.user.UserId;

                const success = await Promotion.updatePromotion(id, {
                    Title: title,
                    StartTime: startTime,
                    EndTime: endTime,
                    DiscountValue: discountValue,
                    Detail: detail,
                    Image: imagePath,
                    UpdatedBy
                });

                if (!success) {
                    return res.status(404).json({
                        error: 'Promotion not found or not updated',
                        code: ERROR_CODES.PROMOTION_NOT_FOUND
                    });
                }

                const updatedPromotion = await Promotion.getPromotionById(id);
                const formattedPromotion = formatPromotionData(updatedPromotion);

                // Clear cache
                clearPromotionCache();

                res.json({
                    message: 'Promotion updated successfully',
                    promotion: formattedPromotion
                });
            });
        } catch (error) {
            console.error('Update promotion error:', error);
            // Clean up uploaded file if exists
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({
                error: 'Internal server error while updating promotion',
                code: ERROR_CODES.SERVER_ERROR
            });
        }
    });
};

// Delete promotion
const deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID format
        if (!uuidValidate(id)) {
            return res.status(400).json({
                error: 'Invalid UUID format',
                code: ERROR_CODES.INVALID_UUID
            });
        }

        // Check if promotion exists
        const promotion = await Promotion.getPromotionById(id);
        if (!promotion) {
            return res.status(404).json({
                error: 'Promotion not found',
                code: ERROR_CODES.PROMOTION_NOT_FOUND
            });
        }

        // Delete associated image if exists
        if (promotion.Image) {
            const imagePath = path.join(__dirname, '..', promotion.Image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        const DeletedBy = req.user.UserId;
        const success = await Promotion.deletePromotion(id, DeletedBy);

        if (!success) {
            return res.status(404).json({
                error: 'Promotion not found or already deleted',
                code: ERROR_CODES.PROMOTION_NOT_FOUND
            });
        }

        // Clear cache
        clearPromotionCache();

        res.json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        console.error('Delete promotion error:', error);
        res.status(500).json({
            error: 'Internal server error while deleting promotion',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

// Search promotions by title
const searchPromotionsByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        // Validate search query
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                error: 'Valid title query parameter is required',
                code: ERROR_CODES.INVALID_INPUT
            });
        }

        const promotions = await Promotion.searchPromotionsByTitle(title.trim());
        if (!promotions || promotions.length === 0) {
            return res.status(404).json({
                error: 'No promotions found',
                code: ERROR_CODES.PROMOTION_NOT_FOUND
            });
        }

        const formattedPromotions = promotions.map(formatPromotionData);

        res.json({
            message: 'Promotions found',
            promotions: formattedPromotions
        });
    } catch (error) {
        console.error('Search promotions error:', error);
        res.status(500).json({
            error: 'Internal server error while searching promotions',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

module.exports = {
    getAllPromotions,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion,
    searchPromotionsByTitle,
    validatePromotionData
};
