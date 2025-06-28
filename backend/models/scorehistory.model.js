const db = require("../config/database");
const { v4: uuidv4 } = require('uuid');

class ScoreHistory {
  // Lấy tất cả lịch sử điểm
  static async getAllScoreHistory(page = 1, limit = 0) {
    if (limit <= 0) {
      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM ScoreHistory WHERE IsDeleted = 0 ORDER BY CreatedAt DESC"
        );
      return {
        scoreHistory: rows,
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
          "SELECT * FROM ScoreHistory WHERE IsDeleted = 0 ORDER BY CreatedAt DESC LIMIT ? OFFSET ?",
          [limit, offset]
        );
      const [countResult] = await db
        .promise()
        .query("SELECT COUNT(*) as total FROM ScoreHistory WHERE IsDeleted = 0");
      const total = countResult[0].total;
      return {
        scoreHistory: rows,
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          limit,
        },
      };
    }
  }

  static async createScoreHistory({ MemberId, RelatedBookingId, ScoreValue, ChangeType, ChangeDate, CreatedBy }) {
    const ScoreHistoryId = uuidv4();
    const changeDate = ChangeDate || new Date();
    const createdAt = new Date();
    const isDeleted = 0;
    const createdBy = CreatedBy || MemberId;
    const sql = `INSERT INTO ScoreHistory (ScoreHistoryId, MemberId, ChangeDate, ChangeType, ScoreValue, RelatedBookingId, IsDeleted, CreatedAt, CreatedBy)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.promise().query(sql, [
      ScoreHistoryId,
      MemberId,
      changeDate,
      ChangeType,
      ScoreValue,
      RelatedBookingId,
      isDeleted,
      createdAt,
      createdBy
    ]);
    return ScoreHistoryId;
  }

  static async updateScoreHistory(id, { ChangeType, ScoreValue, ChangeDate, UpdatedBy }) {
    const updatedAt = new Date();
    const sql = `UPDATE ScoreHistory SET ChangeType=?, ScoreValue=?, ChangeDate=?, UpdatedAt=?, UpdatedBy=? WHERE ScoreHistoryId=? AND IsDeleted=0`;
    const [result] = await db.promise().query(sql, [
      ChangeType,
      ScoreValue,
      ChangeDate,
      updatedAt,
      UpdatedBy,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async deleteScoreHistory(id, DeletedBy) {
    const deletedAt = new Date();
    const sql = `UPDATE ScoreHistory SET IsDeleted=1, DeletedAt=?, DeletedBy=? WHERE ScoreHistoryId=? AND IsDeleted=0`;
    const [result] = await db.promise().query(sql, [
      deletedAt,
      DeletedBy,
      id
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = ScoreHistory; 