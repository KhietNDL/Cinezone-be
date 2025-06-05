const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Register new user
const register = async (req, res) => {
    try {
        const { 
            password, 
            fullName, 
            dateOfBirth, 
            sex, 
            email, 
            cccd, 
            address,
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
            cccd,
            address,
            phoneNumber
        });

        // Get the created user
        const user = await User.findById(userId);

        // Generate token
        const token = jwt.sign(
            { userId: user.UserId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove sensitive data from response
        const { Password, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
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

        // Check password using bcrypt
        const isMatch = await bcrypt.compare(password, user.Password);
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
        const { Password, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
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

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetCode}. This code will expire in 15 minutes.`
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



module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
};