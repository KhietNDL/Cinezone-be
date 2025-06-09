const db = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class UserManagement {
  static async getAllUsers() {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Users WHERE Role = 1 AND IsDeleted = 0");
    return rows;
  }

  static async getUsersbyName(name) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE FullName LIKE ? AND Role = 1 AND IsDeleted = 0",
        [`%${name}%`]
      );
    return rows;
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
      FullName,
      DateOfBirth,
      Password,
      Sex,
      Email,
      PhoneNumber,
      Address,
      CCCD,
      avatar_url
    } = userData;

    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash(Password, 10);
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO Users (UserId, FullName, DateOfBirth, Password, Sex, Email, PhoneNumber, Address, CCCD, avatar_url, Role, IsDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)",
        [
          UserId,
          FullName,
          DateOfBirth,
          hashedPassword,
          Sex,
          Email,
          PhoneNumber,
          Address,
          CCCD,
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
    // Lấy thông tin user hiện tại
    const [rows] = await db.promise().query(
      "SELECT * FROM Users WHERE UserId = ? AND Role = 1",
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

    const FullName = keepOld(userData.FullName, current.FullName);
    const DateOfBirth = keepOld(userData.DateOfBirth, current.DateOfBirth);
    const Sex = keepOld(userData.Sex, current.Sex);
    const Email = keepOld(userData.Email, current.Email);
    const PhoneNumber = keepOld(userData.PhoneNumber, current.PhoneNumber);
    const Address = keepOld(userData.Address, current.Address);
    const CCCD = keepOld(userData.CCCD, current.CCCD);
    const avatar_url = keepOld(userData.avatar_url, current.avatar_url);

    // Password: chỉ hash lại nếu có truyền mới và khác rỗng, không thì giữ nguyên
    let hashedPassword = current.Password;
    if (userData.Password && userData.Password !== "") {
      hashedPassword = await bcrypt.hash(userData.Password, 10);
    }

    const [result] = await db.promise().query(
      "UPDATE Users SET FullName = ?, DateOfBirth = ?, Password = ?, Sex = ?, Email = ?, PhoneNumber = ?, Address = ?, CCCD = ?, avatar_url = ? WHERE UserId = ? AND Role = 1",
      [
        FullName,
        DateOfBirth,
        hashedPassword,
        Sex,
        Email,
        PhoneNumber,
        Address,
        CCCD,
        avatar_url,
        userId,
      ]
    );
    return result.affectedRows > 0;
  }
}

module.exports = UserManagement;
