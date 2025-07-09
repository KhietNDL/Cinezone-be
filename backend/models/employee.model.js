const db = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class Employee {
  static async getAllEmployees(page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc') {
    const allowedSortFields = ['FullName', 'DateOfBirth', 'Email', 'PhoneNumber', 'CreatedAt'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FullName';
    sortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let employeesQuery = `SELECT * FROM Users WHERE Role = 2 AND IsDeleted = 0 ORDER BY ${sortBy} ${sortOrder}`;
    let employeesParams = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      employeesQuery += " LIMIT ? OFFSET ?";
      employeesParams = [limit, offset];
    }
    const [employees] = await db.promise().query(employeesQuery, employeesParams);

    let totalEmployees = employees.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query("SELECT COUNT(*) as total FROM Users WHERE Role = 2 AND IsDeleted = 0");
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
        "SELECT * FROM Users WHERE FullName LIKE ? AND Role = 2 AND IsDeleted = 0",
        [`%${name}%`]
      );
    return rows;
  }
  static async getEmployeeById(userId) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE UserId = ? AND Role = 2 AND IsDeleted = 0",
        [userId]
      );
    return rows[0];
  }
  static async getEmployeeByEmail(email) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE Email = ? AND Role = 2 AND IsDeleted = 0",
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
      address,
    } = employeeData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO Users (UserId, FullName, DateOfBirth, Password, Sex, CCCD, Email, PhoneNumber, Address, Role, IsDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 0)",
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
}

module.exports = Employee;
