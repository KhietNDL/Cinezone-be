const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Invalid auth header format');  
            return res.status(401).json({ 
                error: 'Please authenticate.' 
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        // Kiểm tra user có tồn tại không
        const user = await User.findById(decoded.id || decoded.userId);
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ 
                error: 'Please authenticate.' 
            });
        }

        // Kiểm tra user có bị khóa không
        if (user.IsDeleted) {
            console.log('User account is locked');
            return res.status(401).json({ 
                error: 'Account is locked' 
            });
        }
        
        // Thêm thông tin user vào request
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Invalid token' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired' 
            });
        }
        return res.status(401).json({ 
            error: 'Please authenticate.' 
        });
    }
};

const isAdmin = (req, res, next) => {
   
    if (req.user && (req.user.Role === 3 || req.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Admins only.' });
};

const isEmployee = (req, res, next) => {
    if (req.user && (req.user.Role === 2 || req.user.role === 'employee')) {
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Employees only.' });
};

const isAdminOrEmployee = (req, res, next) => {
  if (req.user && (req.user.Role === 2 || req.user.Role === 3)) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Admin or Employee only' });
}

module.exports = {
    auth,
    isAdmin,
    isEmployee,
    isAdminOrEmployee
};
