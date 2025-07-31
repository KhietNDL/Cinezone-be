const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { formatDateTime, formatDateTimeString } = require("../utils/date");

// Helper để chuẩn hóa ngày tháng khi trả dữ liệu promotion ra ngoài
function normalizePromotionDates(promotion) {
  if (!promotion) return promotion;
  return {
    ...promotion,
    StartTime: formatDateTimeString(promotion.StartTime),
    EndTime: formatDateTimeString(promotion.EndTime),
    CreatedAt: formatDateTimeString(promotion.CreatedAt),
    UpdatedAt: formatDateTimeString(promotion.UpdatedAt),
    DeletedAt: formatDateTimeString(promotion.DeletedAt),
  };
}

class Promotion {
  static formatPromotionRow(row) {
    if (!row) return row;
    return {
      ...row,
      StartTime: formatDateTimeString(row.StartTime),
      EndTime: formatDateTimeString(row.EndTime),
      CreatedAt: formatDateTimeString(row.CreatedAt),
      UpdatedAt: formatDateTimeString(row.UpdatedAt),
      DeletedAt: formatDateTimeString(row.DeletedAt),
    };
  }

  static async getAllPromotions(page = 1, limit = 0) {
    let sql =
      "SELECT p.*, u.FullName as CreatedByName FROM Promotions p LEFT JOIN Users u ON p.CreatedBy = u.UserId WHERE p.IsDeleted = 0 ORDER BY p.CreatedAt DESC";
    let values = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      sql += " LIMIT ? OFFSET ?";
      values.push(limit, offset);
    }
    const [rows] = await db.promise().query(sql, values);
    // Lấy tổng số lượng
    const [countRows] = await db
      .promise()
      .query("SELECT COUNT(*) as total FROM Promotions WHERE IsDeleted = 0");
    const total = countRows[0].total;
    return {
      promotions: rows.map(this.formatPromotionRow),
      pagination: {
        total,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        limit: limit > 0 ? limit : total,
      },
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
      Code,
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
      if (value !== undefined && key !== "UpdatedBy" && key !== "UpdatedAt") {
        let formattedValue = value;
        if ((key === "StartTime" || key === "EndTime") && value) {
          formattedValue = formatDateTime(new Date(value));
        }
        fields.push(`${key} = ?`);
        values.push(formattedValue);
      }
    }
    fields.push("UpdatedAt = ?", "UpdatedBy = ?");
    values.push(data.UpdatedAt, data.UpdatedBy, id);
    const sql = `UPDATE Promotions SET ${fields.join(
      ", "
    )} WHERE PromotionId = ? AND IsDeleted = 0`;
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

  static async searchPromotionsByCode(code, page = 1, limit = 10, sortBy = "CreatedAt", sortOrder = "desc") {
    const allowedSortFields = ["CreatedAt", "StartTime", "EndTime", "DiscountValue", "Title"];
    if (!allowedSortFields.includes(sortBy)) sortBy = "CreatedAt";
    sortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    let sql = `SELECT * FROM Promotions WHERE LOWER(Code) LIKE LOWER(?) AND IsDeleted = 0 ORDER BY ${sortBy} ${sortOrder}`;
    let params = [`%${code}%`];
    let total = 0;

    if (limit > 0) {
      const [countRows] = await db
        .promise()
        .query("SELECT COUNT(*) as total FROM Promotions WHERE LOWER(Code) LIKE LOWER(?) AND IsDeleted = 0", [`%${code}%`]);
      total = countRows[0].total;
      const offset = (page - 1) * limit;
      sql += " LIMIT ? OFFSET ?";
      params.push(limit, offset);
    }

    const [rows] = await db.promise().query(sql, params);
    return {
      promotions: rows.map(this.formatPromotionRow),
      pagination: {
        total,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        limit: limit > 0 ? limit : rows.length,
      },
    };
  }
}

module.exports = Promotion;
