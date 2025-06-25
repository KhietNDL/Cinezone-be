const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

// Hàm helper để format datetime cho MySQL
const formatDateTime = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " "); // Chuyển từ "2025-06-09T13:44:47.586Z" thành "2025-06-09 13:44:47"
};

class Promotion {
  static formatDateTimeString(date) {
    if (!date) return null;
    const d = new Date(date);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
  }

  static formatPromotionRow(row) {
    if (!row) return row;
    return {
      ...row,
      StartTime: Promotion.formatDateTimeString(row.StartTime),
      EndTime: Promotion.formatDateTimeString(row.EndTime),
      CreatedAt: Promotion.formatDateTimeString(row.CreatedAt),
      UpdatedAt: Promotion.formatDateTimeString(row.UpdatedAt),
      DeletedAt: Promotion.formatDateTimeString(row.DeletedAt),
    };
  }

  static async getAllPromotions(page = 1, limit = 0) {
    let sql = "SELECT * FROM Promotions WHERE IsDeleted = 0 ORDER BY CreatedAt DESC";
    let values = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      sql += " LIMIT ? OFFSET ?";
      values.push(limit, offset);
    }
    const [rows] = await db.promise().query(sql, values);
    // Lấy tổng số lượng
    const [countRows] = await db.promise().query("SELECT COUNT(*) as total FROM Promotions WHERE IsDeleted = 0");
    const total = countRows[0].total;
    return {
      promotions: rows.map(this.formatPromotionRow),
      pagination: {
        total,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        limit: limit > 0 ? limit : total
      }
    };
  }

  static async getPromotionById(id) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Promotions WHERE PromotionId = ? AND IsDeleted = 0",
        [id]
      );
    return this.formatPromotionRow(rows[0]);
  }

  static async findByTitle(title) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Promotions WHERE LOWER(Title) = LOWER(?) AND IsDeleted = 0",
        [title]
      );
    return rows[0];
  }

  static async createPromotion(data) {
    const id = uuidv4();
    const now = new Date();
    const {
      Title,
      StartTime,
      EndTime,
      DiscountValue,
      Detail,
      Image,
      CreatedBy,
      Status,
      Code
    } = data;
    const formattedStartTime = formatDateTime(new Date(StartTime));
    const formattedEndTime = formatDateTime(new Date(EndTime));
    const formattedCreatedAt = formatDateTime(now);
    await db.promise().query(
      `INSERT INTO Promotions (
          PromotionId, Title, StartTime, EndTime, DiscountValue, 
          Detail, Image, Status, Code, IsDeleted, CreatedAt, CreatedBy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        id,
        Title,
        formattedStartTime,
        formattedEndTime,
        DiscountValue,
        Detail,
        Image,
        Status,
        Code,
        formattedCreatedAt,
        CreatedBy,
      ]
    );
    return id;
  }

  static async updatePromotion(id, data) {
    const now = new Date();
    data.UpdatedAt = formatDateTime(now);
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'UpdatedBy' && key !== 'UpdatedAt') {
        let formattedValue = value;
        if ((key === 'StartTime' || key === 'EndTime') && value) {
          formattedValue = formatDateTime(new Date(value));
        }
        fields.push(`${key} = ?`);
        values.push(formattedValue);
      }
    }
    fields.push('UpdatedAt = ?', 'UpdatedBy = ?');
    values.push(data.UpdatedAt, data.UpdatedBy, id);
    const sql = `UPDATE Promotions SET ${fields.join(', ')} WHERE PromotionId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, values);
    return result.affectedRows > 0;
  }

  static async deletePromotion(id, DeletedBy) {
    const now = new Date();
    const formattedDeletedAt = formatDateTime(now);

    const [result] = await db
      .promise()
      .query(
        "UPDATE Promotions SET IsDeleted = 1, DeletedAt = ?, DeletedBy = ? WHERE PromotionId = ? AND IsDeleted = 0",
        [formattedDeletedAt, DeletedBy, id]
      );
    return result.affectedRows > 0;
  }

  static async searchPromotionsByTitle(title) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Promotions WHERE LOWER(Title) LIKE LOWER(?) AND IsDeleted = 0",
        [`%${title}%`]
      );
    return rows;
  }
}

module.exports = Promotion;
