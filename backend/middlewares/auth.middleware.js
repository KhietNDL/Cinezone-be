const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error();
        }

        

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

const isAdmin = (req, res, next) => {
   
    if (req.user && (req.user.Role === 3 || req.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Admins only.' });
};

module.exports = {
    isAuthenticated: auth,
    isAdmin
};
