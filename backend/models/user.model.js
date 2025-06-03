const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
    static async findByEmail(email) {
        const [rows] = await db.promise().query('SELECT * FROM Users WHERE Email = ? AND IsDeleted = 0', [email]);
        return rows[0];
    }

    static async findByUsername(username) {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    static async create(userData) {
        const { 
            password, 
            fullName, 
            dateOfBirth, 
            sex, 
            email, 
            cccd, 
            address,
            phoneNumber
        } = userData;

        const userId = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const now = new Date();

        const [result] = await db.promise().query(
            `INSERT INTO Users (
                UserId, Password, FullName, DateOfBirth, Sex, 
                Email, CCCD, Address, Role, IsEmailVerified,
                ScoreBalance, IsDeleted, CreatedAt, UpdatedAt,
                PhoneNumber
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, hashedPassword, fullName, dateOfBirth, sex,
                email, cccd, address, 0, false, // Role = 0 (user), IsEmailVerified = false
                0, false, now, now, // ScoreBalance = 0, IsDeleted = false
                phoneNumber
            ]
        );

        return userId;
    }

    static async findById(id) {
        const [rows] = await db.promise().query('SELECT * FROM Users WHERE UserId = ? AND IsDeleted = 0', [id]);
        return rows[0];
    }

    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static async updateResetCode(email, resetCode) {
        const [result] = await db.promise().query(
            'UPDATE Users SET reset_code = ?, reset_code_expires = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE Email = ? AND IsDeleted = 0',
            [resetCode, email]
        );
        return result.affectedRows > 0;
    }

    static async verifyResetCode(email, resetCode) {
        const [rows] = await db.promise().query(
            'SELECT * FROM Users WHERE Email = ? AND reset_code = ? AND reset_code_expires > NOW() AND IsDeleted = 0',
            [email, resetCode]
        );
        return rows[0];
    }

    static async updatePassword(userId, newPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        const [result] = await db.promise().query(
            'UPDATE Users SET Password = ?, reset_code = NULL, reset_code_expires = NULL, UpdatedAt = NOW() WHERE UserId = ? AND IsDeleted = 0',
            [hashedPassword, userId]
        );
        return result.affectedRows > 0;
    }
    
}

module.exports = User;
