const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

class User {
  static async findByEmail(email) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Users WHERE Email = ? AND IsDeleted = 0", [email]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Users WHERE Username = ? AND IsDeleted = 0", [username]);
    return rows[0];
  }

  static async create(userData) {
    try {
      const {
        password,
        fullName,
        dateOfBirth,
        sex,
        email,
        phoneNumber,
        cccd,
        membershipTypeId // truyền vào hoặc lấy mặc định
      } = userData;

      const userId = uuidv4();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const now = new Date();
      let finalMembershipTypeId = membershipTypeId;
      // Nếu không truyền membershipTypeId thì tự lấy UUID của hạng Bronze
      if (!finalMembershipTypeId) {
        const [rows] = await db.promise().query(
          "SELECT MembershipTypeId FROM MembershipType WHERE Name = 'Bronze' AND IsDeleted = 0 LIMIT 1"
        );
        if (rows.length > 0) {
          finalMembershipTypeId = rows[0].MembershipTypeId;
        } else {
          throw new Error("Cannot find 'Bronze' tier in MembershipType");
        }
      }

      const [result] = await db.promise().query(
        `INSERT INTO Users (
          UserId, Password, FullName, DateOfBirth, Sex, 
          Email, CreatedAt, PhoneNumber, Role, IsEmailVerified, IsDeleted, CCCD, MembershipTypeId, TotalAccumulatedPoints, MembershipStartDate, MembershipEndDate, MembershipStatus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          hashedPassword,
          fullName,
          dateOfBirth,
          sex,
          email,
          now,
          phoneNumber,
          1,
          false,
          0,
          cccd,
          finalMembershipTypeId,
          0, // TotalAccumulatedPoints
          now, // MembershipStartDate
          null, // MembershipEndDate
          'active' // MembershipStatus
        ]
      );

      if (result.affectedRows === 0) {
        throw new Error("Failed to insert user into database");
      }

      return userId;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async findById(id) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Users WHERE UserId = ? AND IsDeleted = 0", [id]);
    return rows[0];
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async updateResetCode(email, resetCode) {
    const [result] = await db
      .promise()
      .query(
        "UPDATE Users SET reset_code = ?, reset_code_expires = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE Email = ? AND IsDeleted = 0",
        [resetCode, email]
      );
    return result.affectedRows > 0;
  }

  static async verifyResetCode(email, resetCode) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE Email = ? AND reset_code = ? AND reset_code_expires > NOW() AND IsDeleted = 0",
        [email, resetCode]
      );
    return rows[0];
  }

  static async updatePassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const [result] = await db
      .promise()
      .query(
        "UPDATE Users SET Password = ?, reset_code = NULL, reset_code_expires = NULL, UpdatedAt = NOW() WHERE UserId = ? AND IsDeleted = 0",
        [hashedPassword, userId]
      );
    return result.affectedRows > 0;
  }

  static async update(userId, updates) {
    try {
      const updateKeys = Object.keys(updates);
      const updateValues = Object.values(updates);

      if (updateKeys.length === 0) {
        return false; // Không có gì để cập nhật
      }

      const setClauses = updateKeys.map((key) => `\`${key}\` = ?`).join(", ");
      const query = `UPDATE Users SET ${setClauses}, UpdatedAt = NOW() WHERE UserId = ? AND IsDeleted = 0`;
      const values = [...updateValues, userId];

      const [result] = await db.promise().query(query, values);

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async findByGoogleId(googleId) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Users WHERE GoogleId = ? AND IsDeleted = 0", [
        googleId,
      ]);
    return rows[0];
  }

  static async createGoogleUser(userData) {
    try {
      const { googleId, fullName, email, refreshToken, accessToken } = userData;
      const userId = uuidv4();
      const now = new Date();

      const [result] = await db.promise().query(
        `INSERT INTO Users (
          UserId, GoogleId, FullName, Email, CreatedAt, Role, IsEmailVerified, IsDeleted, RefreshToken, AccessToken
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, googleId, fullName, email, now, 1, true, 0, refreshToken, accessToken]
      );

      if (result.affectedRows === 0) {
        throw new Error("Failed to insert Google user into database");
      }

      return userId;
    } catch (error) {
      console.error("Error creating Google user:", error);
      throw error;
    }
  }

  static async findByResetCode(resetCode) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Users WHERE reset_code = ? AND reset_code_expires > NOW() AND IsDeleted = 0",
        [resetCode]
      );
    return rows[0];
  }

  static async updateScoreAndAccumulated(userId, addScore) {
    // Cộng điểm vào cả ScoreBalance và TotalAccumulatedPoints
    const [user] = await db.promise().query("SELECT ScoreBalance, TotalAccumulatedPoints FROM Users WHERE UserId = ?", [userId]);
    if (!user[0]) return false;
    const newScore = (user[0].ScoreBalance || 0) + addScore;
    const newAccum = (user[0].TotalAccumulatedPoints || 0) + addScore;
    const [result] = await db.promise().query(
      "UPDATE Users SET ScoreBalance = ?, TotalAccumulatedPoints = ? WHERE UserId = ?",
      [newScore, newAccum, userId]
    );
    return result.affectedRows > 0;
  }

  static async upgradeMembership(userId, newMembershipTypeId, startDate, endDate) {
    // Nâng hạng thành viên
    const [result] = await db.promise().query(
      `UPDATE Users SET MembershipTypeId = ?, MembershipStartDate = ?, MembershipEndDate = ?, MembershipStatus = 'active', UpdatedAt = NOW() WHERE UserId = ? AND IsDeleted = 0`,
      [newMembershipTypeId, startDate, endDate, userId]
    );
    return result.affectedRows > 0;
  }

  static async getMembershipInfo(userId) {
    // Lấy thông tin membership của user (JOIN MembershipType)
    const [rows] = await db.promise().query(
      `SELECT u.UserId, u.FullName, u.Email, u.ScoreBalance, u.TotalAccumulatedPoints, u.MembershipTypeId, u.MembershipStartDate, u.MembershipEndDate, u.MembershipStatus,
        m.Name as MembershipName, m.MinPoint, m.DiscountTicket, m.PointMultiplier
      FROM Users u
      LEFT JOIN MembershipType m ON u.MembershipTypeId = m.MembershipTypeId
      WHERE u.UserId = ? AND u.IsDeleted = 0`,
      [userId]
    );
    return rows[0];
  }

  static async updateScoreBalance(userId, newScoreBalance) {
    try {
      const [result] = await db.promise().query(
        "UPDATE Users SET ScoreBalance = ? WHERE UserId = ?",
        [newScoreBalance, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating score balance:", error);
      throw error;
    }
  }
}

module.exports = User;
