const db = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class UserManagement {
  static async getAllUsers(page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc') {
    const allowedSortFields = ['FullName', 'DateOfBirth', 'Email', 'PhoneNumber', 'CreatedAt'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FullName';
    sortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let usersQuery = `SELECT * FROM Users WHERE Role = 1 ORDER BY ${sortBy} ${sortOrder}`;
    let usersParams = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      usersQuery += " LIMIT ? OFFSET ?";
      usersParams = [limit, offset];
    }
    const [users] = await db.promise().query(usersQuery, usersParams);

    let totalUsers = users.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query("SELECT COUNT(*) as total FROM Users WHERE Role = 1");
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

  static async getUserByEmail(email, page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc') {
    const allowedSortFields = ['FullName', 'DateOfBirth', 'Email', 'PhoneNumber', 'CreatedAt'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FullName';
    sortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let usersQuery = `SELECT * FROM Users WHERE LOWER(Email) LIKE LOWER(?) AND Role = 1 AND IsDeleted = 0 ORDER BY ${sortBy} ${sortOrder}`;
    let usersParams = [`%${email}%`];

    if (limit > 0) {
      const offset = (page - 1) * limit;
      usersQuery += " LIMIT ? OFFSET ?";
      usersParams.push(limit, offset);
    }

    const [users] = await db.promise().query(usersQuery, usersParams);

    let totalUsers = users.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query(
        "SELECT COUNT(*) as total FROM Users WHERE LOWER(Email) LIKE LOWER(?) AND Role = 1 AND IsDeleted = 0",
        [`%${email}%`]
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

    const updateKeys = Object.keys(userData);
    const updateValues = Object.values(userData);

    const setClauses = updateKeys.map((key) => `\`${key}\` = ?`).join(", ");
    const query = `UPDATE Users SET ${setClauses}, UpdatedAt = NOW() WHERE UserId = ? AND IsDeleted = 0`;
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

  static async findUsersByInfo({ email, cccd, phone, name }, page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc') {
    const allowedSortFields = ['FullName', 'DateOfBirth', 'Email', 'PhoneNumber', 'CreatedAt'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FullName';
    sortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let where = [];
    let params = [];
    if (email) {
      where.push("LOWER(Email) LIKE LOWER(?)");
      params.push(`%${email}%`);
    }
    if (cccd) {
      where.push("CCCD LIKE ?");
      params.push(`%${cccd}%`);
    }
    if (phone) {
      where.push("PhoneNumber LIKE ?");
      params.push(`%${phone}%`);
    }
    if (name) {
      where.push("FullName LIKE ?");
      params.push(`%${name}%`);
    }
    if (where.length === 0) return { users: [], pagination: { total: 0, currentPage: page, totalPages: 0, limit: 0 } };

    let usersQuery = `SELECT * FROM Users WHERE (${where.join(" OR ")}) AND Role = 1 ORDER BY ${sortBy} ${sortOrder}`;
    if (limit > 0) {
      const offset = (page - 1) * limit;
      usersQuery += " LIMIT ? OFFSET ?";
      params.push(limit, offset);
    }
    const [users] = await db.promise().query(usersQuery, params);

    let totalUsers = users.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query(
        `SELECT COUNT(*) as total FROM Users WHERE (${where.join(" OR ")}) AND Role = 1`,
        params.slice(0, where.length)
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

  static async unbanUser(userId) {
    const [result] = await db
      .promise()
      .query(
        "UPDATE Users SET IsDeleted = 0, UpdatedAt = NOW() WHERE UserId = ? AND Role = 1 AND IsDeleted = 1",
        [userId]
      );
    return result.affectedRows > 0;
  }
}

module.exports = UserManagement;
