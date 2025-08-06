const db = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class Employee {
  static async getAllEmployees(page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc', status = null) {
    const allowedSortFields = ['FullName', 'DateOfBirth', 'Email', 'PhoneNumber', 'CreatedAt', 'isDeleted'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FullName';
    sortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let whereClause = 'WHERE Role = 2';
    let countWhereClause = 'WHERE Role = 2';
    
    // Add status filter if provided
    if (status) {
      switch (status.toLowerCase()) {
        case 'active':
          whereClause += ' AND IsDeleted = 0';
          countWhereClause += ' AND IsDeleted = 0';
          break;
        case 'inactive':
          whereClause += ' AND IsDeleted = 1';
          countWhereClause += ' AND IsDeleted = 1';
          break;
        case 'new':
          whereClause += ' AND IsDeleted = 0 AND CreatedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
          countWhereClause += ' AND IsDeleted = 0 AND CreatedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
          break;
      }
    }

    let employeesQuery = `SELECT * FROM Users ${whereClause} ORDER BY ${sortBy} ${sortOrder}`;
    let employeesParams = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      employeesQuery += " LIMIT ? OFFSET ?";
      employeesParams = [limit, offset];
    }
    const [employees] = await db.promise().query(employeesQuery, employeesParams);

    let totalEmployees = employees.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query(`SELECT COUNT(*) as total FROM Users ${countWhereClause}`);
      totalEmployees = countResult[0].total;
    }

    return {
      employees,
      pagination: {
        total: totalEmployees,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalEmployees / limit) : 1,
        limit: limit > 0 ? limit : employees.length,
      },
    };
  }
  static async getEmployeesbyName(name) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE FullName LIKE ? AND Role = 2",
        [`%${name}%`]
      );
    return rows;
  }
  static async getEmployeeById(userId) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE UserId = ? AND Role = 2",
        [userId]
      );
    return rows[0];
  }
  static async getEmployeeByEmail(email) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE Email = ? AND Role = 2",
        [email]
      );
    return rows[0];
  }
  static async createEmployee(employeeData) {
    const UserId = uuidv4();
    const {
      fullName,
      dateOfBirth,
      password,
      sex,
      cccd,
      email,
      phoneNumber,
      address
    } = employeeData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = createdAt || new Date();
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO Users (UserId, FullName, DateOfBirth, Password, Sex, CCCD, Email, PhoneNumber, Address, Role, IsDeleted, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 0, ?)",
        [
          UserId,
          fullName,
          dateOfBirth,
          hashedPassword,
          sex,
          cccd,
          email,
          phoneNumber,
          address,
          createdAt
        ]
      );
    return UserId;
  }
  static async deleteEmployee(userId) {
    const [result] = await db
      .promise()
      .query("UPDATE Users SET IsDeleted = 1 WHERE UserId = ? AND Role = 2", [
        userId,
      ]);
    return result.affectedRows > 0;
  }
  static async updateEmployee(userId, employeeData) {
    if (!userId || !employeeData || Object.keys(employeeData).length === 0) return false;

    const updateKeys = Object.keys(employeeData);
    const updateValues = Object.values(employeeData);

    const setClauses = updateKeys.map((key) => `\`${key}\` = ?`).join(", ");
    const query = `UPDATE Users SET ${setClauses}, UpdatedAt = NOW() WHERE UserId = ? AND IsDeleted = 0`;
    const values = [...updateValues, userId];

    const [result] = await db.promise().query(query, values);
    return result.affectedRows > 0;
  }
  static async findEmployeesByInfo({ email, cccd, phone, name }, page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc') {
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
    if (where.length === 0) return { employees: [], pagination: { total: 0, currentPage: page, totalPages: 0, limit: 0 } };

    let employeesQuery = `SELECT * FROM Users WHERE (${where.join(" OR ")}) AND Role = 2 ORDER BY ${sortBy} ${sortOrder}`;
    if (limit > 0) {
      const offset = (page - 1) * limit;
      employeesQuery += " LIMIT ? OFFSET ?";
      params.push(limit, offset);
    }
    const [employees] = await db.promise().query(employeesQuery, params);

    let totalEmployees = employees.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query(
        `SELECT COUNT(*) as total FROM Users WHERE (${where.join(" OR ")}) AND Role = 2`,
        params.slice(0, where.length)
      );
      totalEmployees = countResult[0].total;
    }

    return {
      employees,
      pagination: {
        total: totalEmployees,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalEmployees / limit) : 1,
        limit: limit > 0 ? limit : employees.length,
      },
    };
  }
  static async unbanEmployee(userId) {
    const [result] = await db
      .promise()
      .query(
        "UPDATE Users SET IsDeleted = 0, UpdatedAt = NOW() WHERE UserId = ? AND Role = 2 AND IsDeleted = 1",
        [userId]
      );
    return result.affectedRows > 0;
  }
}

module.exports = Employee;
