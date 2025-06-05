const db = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class Employee {
  static async getAllEmployees() {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Users WHERE Role = 2 AND IsDeleted = 0");
    return rows;
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
      FullName,
      DateOfBirth,
      Password,
      Sex,
      CCCD,
      Email,
      PhoneNumber,
      Address,
    } = employeeData;
    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash(Password, 10);
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO Users (UserId, FullName, DateOfBirth, Password, Sex, CCCD, Email, PhoneNumber, Address, Role, IsDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 0)",
        [
          UserId,
          FullName,
          DateOfBirth,
          hashedPassword,
          Sex,
          CCCD,
          Email,
          PhoneNumber,
          Address,
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
    // Lấy thông tin employee hiện tại
    const [rows] = await db.promise().query(
      "SELECT * FROM Users WHERE UserId = ? AND Role = 2",
      [userId]
    );
    const current = rows[0];
    if (!current) return false;

    // Chỉ cập nhật trường được truyền vào, còn lại giữ nguyên
    function keepOld(newVal, oldVal) {
      return newVal === undefined || newVal === null || newVal === ""
        ? oldVal
        : newVal;
    }
    const FullName = keepOld(employeeData.FullName, current.FullName);
    const DateOfBirth = keepOld(employeeData.DateOfBirth, current.DateOfBirth);
    const Sex = keepOld(employeeData.Sex, current.Sex);
    const CCCD = keepOld(employeeData.CCCD, current.CCCD);
    const Email = keepOld(employeeData.Email, current.Email);
    const PhoneNumber = keepOld(employeeData.PhoneNumber, current.PhoneNumber);
    const Address = keepOld(employeeData.Address, current.Address);
    // Password: chỉ hash lại nếu có truyền mới và khác rỗng, không thì giữ nguyên
    let hashedPassword = current.Password;
    if (employeeData.Password && employeeData.Password !== "") {
      hashedPassword = await bcrypt.hash(employeeData.Password, 10);
    }
    const [result] = await db.promise().query(
      "UPDATE Users SET FullName = ?, DateOfBirth = ?, Password = ?, Sex = ?, CCCD = ?, Email = ?, PhoneNumber = ?, Address = ? WHERE UserId = ? AND Role = 2",
      [
        FullName,
        DateOfBirth,
        hashedPassword,
        Sex,
        CCCD,
        Email,
        PhoneNumber,
        Address,
        userId,
      ]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Employee;
