const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async findByEmail(email) {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findByUsername(username) {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    static async create(userData) {
        const { 
            username, 
            password, 
            full_name, 
            dob, 
            sex, 
            email, 
            identity_card, 
            phone_number, 
            address 
        } = userData;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.promise().query(
            `INSERT INTO users (
                username, password, full_name, dob, sex, 
                email, identity_card, phone_number, address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                username, hashedPassword, full_name, dob, sex,
                email, identity_card, phone_number, address
            ]
        );

        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE user_id = ?', [id]);
        return rows[0];
    }

    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;
