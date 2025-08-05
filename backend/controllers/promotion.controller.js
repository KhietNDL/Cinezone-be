const Promotion = require('../models/promotion.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { validate: uuidValidate } = require('uuid');
const NodeCache = require('node-cache');
const bucket = require('../config/firebase');

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
    Image: promotion.Image,
    Status: promotion.Status,
    Code: promotion.Code
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
const getAllPromotions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 0;
        const status = req.query.status; // Add status filter
        const result = await Promotion.getAllPromotions(page, limit, status);
        res.status(200).json({
            status: 'success',
            data: result.promotions,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Multer config for memory storage (for Firebase upload)
const uploadMemory = multer({ storage: multer.memoryStorage() });
module.exports.upload = uploadMemory;

// Create new promotion
const createPromotion = async (req, res) => {
    try {
        const { title, startTime, endTime, discountValue, detail, status, code } = req.body;
        let imageUrl = null;
        if (req.files && req.files.image && req.files.image[0]) {
            const imageFile = req.files.image[0];
            const fileName = `promotions/${Date.now()}-${imageFile.originalname.replace(/\s+/g, '_')}`;
            const blob = bucket.file(fileName);
            const stream = blob.createWriteStream({ metadata: { contentType: imageFile.mimetype } });
            await new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('finish', resolve);
                stream.end(imageFile.buffer);
            });
            const [url] = await blob.getSignedUrl({ action: 'read', expires: '03-01-2500' });
            imageUrl = url;
        }
        const CreatedBy = req.user.UserId;
        const id = await Promotion.createPromotion({
            Title: title,
            StartTime: startTime,
            EndTime: endTime,
            DiscountValue: discountValue,
            Detail: detail,
            Image: imageUrl,
            CreatedBy,
            Status: status || null,
            Code: code || null
        });
        const newPromotion = await Promotion.getPromotionById(id);
        res.status(201).json({ status: 'success', data: newPromotion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Firebase file by URL
const deleteFirebaseFileByUrl = async (fileUrl) => {
    if (!fileUrl) return;
    try {
        // Find path file in URL (e.g: promotions/...) 
        const match = fileUrl.match(/promotions\/[^?]+/);
        if (match && match[0]) {
            await bucket.file(match[0]).delete();
            console.log("Deleted old file from Firebase:", match[0]);
        }
    } catch (err) {
        console.log("Failed to delete old file from Firebase:", err.message);
    }
};

// Update promotion
const updatePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startTime, endTime, discountValue, detail, status, code } = req.body;
        const existingPromotion = await Promotion.getPromotionById(id);
        if (!existingPromotion) return res.status(404).json({ error: 'Promotion not found' });
        const updateData = {
            Title: title !== undefined && title !== '' ? title : existingPromotion.Title,
            StartTime: startTime !== undefined && startTime !== '' ? startTime : existingPromotion.StartTime,
            EndTime: endTime !== undefined && endTime !== '' ? endTime : existingPromotion.EndTime,
            DiscountValue: discountValue !== undefined && discountValue !== '' ? discountValue : existingPromotion.DiscountValue,
            Detail: detail !== undefined && detail !== '' ? detail : existingPromotion.Detail,
            Status: status !== undefined && status !== '' ? status : existingPromotion.Status,
            Code: code !== undefined && code !== '' ? code : existingPromotion.Code,
            UpdatedBy: req.user.UserId
        };
        if (req.files && req.files.image && req.files.image[0]) {
            if (existingPromotion.Image) {
                await deleteFirebaseFileByUrl(existingPromotion.Image);
            }
            const imageFile = req.files.image[0];
            const fileName = `promotions/${Date.now()}-${imageFile.originalname.replace(/\s+/g, '_')}`;
            const blob = bucket.file(fileName);
            const stream = blob.createWriteStream({ metadata: { contentType: imageFile.mimetype } });
            await new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('finish', resolve);
                stream.end(imageFile.buffer);
            });
            const [url] = await blob.getSignedUrl({ action: 'read', expires: '03-01-2500' });
            updateData.Image = url;
        }
        const success = await Promotion.updatePromotion(id, updateData);
        if (!success) return res.status(404).json({ error: 'Promotion not found' });
        const updatedPromotion = await Promotion.getPromotionById(id);
        res.status(200).json({ status: 'success', data: updatedPromotion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

// Search promotions by code
const searchPromotionsByCode = async (req, res) => {
    try {
        const { code, page = 1, limit = 10, sortBy = "CreatedAt", sortOrder = "desc" } = req.query;
        const result = await Promotion.searchPromotionsByCode(code, parseInt(page), parseInt(limit), sortBy, sortOrder);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPromotions,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion,
    searchPromotionsByCode,
    validatePromotionData
};
