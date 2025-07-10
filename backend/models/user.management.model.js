const db = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class UserManagement {
  static async getAllUsers(page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc') {
    const allowedSortFields = ['FullName', 'DateOfBirth', 'Email', 'PhoneNumber', 'CreatedAt'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FullName';
    sortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let usersQuery = `SELECT * FROM Users WHERE Role = 1 AND IsDeleted = 0 ORDER BY ${sortBy} ${sortOrder}`;
    let usersParams = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      usersQuery += " LIMIT ? OFFSET ?";
      usersParams = [limit, offset];
    }
    const [users] = await db.promise().query(usersQuery, usersParams);

    let totalUsers = users.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query("SELECT COUNT(*) as total FROM Users WHERE Role = 1 AND IsDeleted = 0");
      totalUsers = countResult[0].total;
    }

    return {
      users,
      pagination: {
        total: totalUsers,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalUsers / limit) : 1,
        limit: limit > 0 ? limit : users.length,
      },
    };
  }

  static async getUsersbyName(name, page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc') {
    const allowedSortFields = ['FullName', 'DateOfBirth', 'Email', 'PhoneNumber', 'CreatedAt'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FullName';
    sortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let usersQuery = `SELECT * FROM Users WHERE FullName LIKE ? AND Role = 1 AND IsDeleted = 0 ORDER BY ${sortBy} ${sortOrder}`;
    let usersParams = [`%${name}%`];
    
    if (limit > 0) {
      const offset = (page - 1) * limit;
      usersQuery += " LIMIT ? OFFSET ?";
      usersParams.push(limit, offset);
    }
    
    const [users] = await db.promise().query(usersQuery, usersParams);

    let totalUsers = users.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query(
        "SELECT COUNT(*) as total FROM Users WHERE FullName LIKE ? AND Role = 1 AND IsDeleted = 0",
        [`%${name}%`]
      );
      totalUsers = countResult[0].total;
    }

    return {
      users,
      pagination: {
        total: totalUsers,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalUsers / limit) : 1,
        limit: limit > 0 ? limit : users.length,
      },
    };
  }

  static async getUserById(userId) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE UserId = ? AND Role = 1 AND IsDeleted = 0",
        [userId]
      );
    return rows[0];
  }

  static async getUserByEmail(email) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE Email = ? AND Role = 1 AND IsDeleted = 0",
        [email]
      );
    return rows[0];
  }

  static async createUser(userData) {
    const UserId = uuidv4();
    const {
      fullName,
      dateOfBirth,
      password,
      sex,
      email,
      phoneNumber,
      address,
      cccd,
      avatar_url
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO Users (UserId, FullName, DateOfBirth, Password, Sex, Email, PhoneNumber, Address, CCCD, avatar_url, Role, IsDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)",
        [
          UserId,
          fullName,
          dateOfBirth,
          hashedPassword,
          sex,
          email,
          phoneNumber,
          address,
          cccd,
          avatar_url
        ]
      );
    return UserId;
  }

  static async deleteUser(userId) {
    const [result] = await db
      .promise()
      .query("UPDATE Users SET IsDeleted = 1 WHERE UserId = ? AND Role = 1", [
        userId,
      ]);
    return result.affectedRows > 0;
  }

  static async updateUser(userId, userData) {
    if (!userId || !userData || Object.keys(userData).length === 0) return false;

    // Nếu có password mới thì hash lại
    if (userData.password) {
      userData.Password = await bcrypt.hash(userData.password, 10);
      delete userData.password;
    }
    // Chuyển các trường camelCase sang đúng tên cột DB nếu cần
    if (userData.fullName) { userData.FullName = userData.fullName; delete userData.fullName; }
    if (userData.dateOfBirth) { userData.DateOfBirth = userData.dateOfBirth; delete userData.dateOfBirth; }
    if (userData.sex) { userData.Sex = userData.sex; delete userData.sex; }
    if (userData.email) { userData.Email = userData.email; delete userData.email; }
    if (userData.phoneNumber) { userData.PhoneNumber = userData.phoneNumber; delete userData.phoneNumber; }
    if (userData.address) { userData.Address = userData.address; delete userData.address; }
    if (userData.cccd) { userData.CCCD = userData.cccd; delete userData.cccd; }
    if (userData.avatar_url) { userData.avatar_url = userData.avatar_url; }

    const updateKeys = Object.keys(userData);
    const updateValues = Object.values(userData);

    if (updateKeys.length === 0) return false;

    const setClauses = updateKeys.map((key) => `\`${key}\` = ?`).join(", ");
    const query = `UPDATE Users SET ${setClauses}, UpdatedAt = NOW() WHERE UserId = ? AND Role = 1 AND IsDeleted = 0`;
    const values = [...updateValues, userId];

    const [result] = await db.promise().query(query, values);
    return result.affectedRows > 0;
  }

  static async getUserByCCCD(cccd) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE CCCD = ? AND Role = 1 AND IsDeleted = 0",
        [cccd]
      );
    return rows[0];
  }

  static async getUserByPhoneNumber(phoneNumber) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE PhoneNumber = ? AND Role = 1 AND IsDeleted = 0",
        [phoneNumber]
      );
    return rows[0];
  }
}

module.exports = UserManagement;
