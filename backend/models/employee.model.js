const db = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class Employee {
  static async getAllEmployees(page = 1, limit = 0) {
    if (limit <= 0) {
      const [rows] = await db
        .promise()
        .query("SELECT * FROM Users WHERE Role = 2 AND IsDeleted = 0");
      return {
        employees: rows,
        pagination: {
          total: rows.length,
          currentPage: 1,
          totalPages: 1,
          limit: rows.length,
        },
      };
    } else {
      const offset = (page - 1) * limit;
      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Users WHERE Role = 2 AND IsDeleted = 0 LIMIT ? OFFSET ?",
          [limit, offset]
        );
      const [countResult] = await db
        .promise()
        .query("SELECT COUNT(*) as total FROM Users WHERE Role = 2 AND IsDeleted = 0");
      const totalEmployees = countResult[0].total;
      return {
        employees: rows,
        pagination: {
          total: totalEmployees,
          currentPage: page,
          totalPages: Math.ceil(totalEmployees / limit),
          limit,
        },
      };
    }
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
