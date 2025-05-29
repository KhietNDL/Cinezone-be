const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register new user
const register = async (req, res) => {
    try {
        const { 
            username, 
            password, 
            full_name, 
            dob, 
            sex, 
            email, 
            identity_card, 
            phone_number, 
        } = req.body;

        // Check if user already exists
        const existingUserByEmail = email ? await User.findByEmail(email) : null;
        const existingUserByUsername = await User.findByUsername(username);

        if (existingUserByEmail || existingUserByUsername) {
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }

        // Create new user
        const userId = await User.create({
            username,
            password,
            full_name,
            dob,
            sex,
            email,
            identity_card,
            phone_number,
        });

        // Get the created user
        const user = await User.findById(userId);

        // Generate token
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(401).json({ error: 'Account is locked' });
        }

        // Check password
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login
}; 