const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

// Register new user
const register = async (req, res) => {
    try {
        const { 
            password, 
            fullName, 
            dateOfBirth, 
            sex, 
            email, 
            phoneNumber
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User with this email already exists' 
            });
        }

        // Create new user
        const userId = await User.create({
            password,
            fullName,
            dateOfBirth,
            sex,
            email,
            phoneNumber
        });

        // Get the created user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(500).json({ error: 'Failed to create user' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.UserId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove sensitive data and unnecessary fields from response
        const { 
            Password, CCCD, Address, ScoreBalance, IsDeleted, 
            CreatedAt, UpdatedAt, DeletedAt, DeletedBy,
            reset_code, reset_code_expires, Role, IsEmailVerified,
            ...userData 
        } = user;

        res.status(201).json({
            message: 'User registered successfully',
            user: userData,
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        // Find user by email
        const user = await User.findByEmail(email);
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is active
        if (user.IsDeleted) {
            return res.status(401).json({ error: 'Account is locked' });
        }

        // Check password
        const isMatch = await User.comparePassword(password, user.Password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.UserId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove sensitive data from response
        const { Password, CCCD, Address, ScoreBalance, IsDeleted, 
            CreatedAt, UpdatedAt, DeletedAt, DeletedBy,
            reset_code, reset_code_expires,Role,IsEmailVerified,            
            ...userData 
        } = user;

        res.json({
            message: 'Login successful',
            user: userData,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Update user with reset code
        await User.updateResetCode(email, resetCode);

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // HTML email template
        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Password Reset Code</title>
        <style>
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background: #181829;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 480px;
                margin: 40px auto;
                background: #232347;
                border-radius: 18px;
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                padding: 32px 24px 24px 24px;
                color: #fff;
            }
            .logo {
                display: flex;
                justify-content: center;
                margin-bottom: 24px;
            }
            .logo img {
                width: 90px;
                height: auto;
            }
            .header {
                text-align: center;
                font-size: 1.6rem;
                font-weight: bold;
                margin-bottom: 12px;
                color: #a18aff;
                letter-spacing: 1px;
            }
            .content {
                text-align: center;
                margin-bottom: 24px;
            }
            .code {
                font-size: 2.2rem;
                font-weight: bold;
                color: #a18aff;
                letter-spacing: 8px;
                background: #fff;
                color: #232347;
                border-radius: 8px;
                padding: 18px 0;
                margin: 24px 0;
                box-shadow: 0 2px 8px rgba(161, 138, 255, 0.15);
            }
            .footer {
                text-align: center;
                font-size: 0.95rem;
                color: #bdbdbd;
                margin-top: 32px;
            }
            .warning {
                color: #ff6b6b;
                font-size: 1rem;
                margin-top: 18px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s" alt="CineZone Logo" />
            </div>
            <div class="header">Password Reset Code</div>
            <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password. Please use the following code to reset your password:</p>
                <div class="code">${resetCode}</div>
                <p>This code will expire in 15 minutes.</p>
                <p class="warning">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>&copy; 2024 CineZone. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            html: htmlContent,
            text: `Your password reset code is: ${resetCode}. This code will expire in 15 minutes.` // Fallback text version
        });

        res.json({ message: 'Reset code sent to your email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        // Verify reset code
        const user = await User.verifyResetCode(email, resetCode);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset code' });
        }

        // Update password
        await User.updatePassword(user.UserId, newPassword);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        // Clear any auth-related cookies if you're using them
        res.clearCookie('token');
        
        // Send success response
        res.status(200).json({ 
            message: 'Logout successful' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id; // Get ID from URL parameters

        // Validate UUID format
        if (!uuidValidate(userId)) {
            return res.status(400).json({ error: 'Invalid UUID format' });
        }

        const updates = req.body;
        const allowedUpdates = ['fullName', 'password', 'dateOfBirth', 'phoneNumber', 'sex', 'email', 'cccd', 'address', 'avatar_url'];
        
        // Filter out empty or undefined values
        const filteredUpdates = {};
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined && updates[key] !== null && updates[key] !== '') {
                filteredUpdates[key] = updates[key];
            }
        });

        // Check if there are any updates to make
        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ error: 'No valid updates provided' });
        }

        // Validate that all update fields are allowed
        const updatesKeys = Object.keys(filteredUpdates);
        const isValidOperation = updatesKeys.every((key) => allowedUpdates.includes(key));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates!' });
        }

        // Check if user exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Handle password hashing if password is being updated
        if (filteredUpdates.password) {
            const salt = await bcrypt.genSalt(10);
            filteredUpdates.password = await bcrypt.hash(filteredUpdates.password, salt);
        }

        // Call model to update user
        const success = await User.update(userId, filteredUpdates);

        if (!success) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the updated user to return in response
        const updatedUser = await User.findById(userId);
        // Remove sensitive data from response
        const { 
            Password, CCCD, Address, ScoreBalance, IsDeleted, 
            CreatedAt, UpdatedAt, DeletedAt, DeletedBy,
            reset_code, reset_code_expires,Role,IsEmailVerified,            
            ...userData 
        } = updatedUser;

        res.json({ 
            message: 'Profile updated successfully',
            user: userData
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data or error message
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID format
        if (!uuidValidate(id)) {
            return res.status(400).json({ 
                error: 'Invalid user ID format' 
            });
        }

        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        // Remove sensitive data from response
        const { 
            Password, CCCD, Address, ScoreBalance, IsDeleted, 
            CreatedAt, UpdatedAt, DeletedAt, DeletedBy,
            reset_code, reset_code_expires, Role, IsEmailVerified,
            ...userData 
        } = user;

        res.json({
            message: 'User retrieved successfully',
            user: userData
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    getUserById
}; 
