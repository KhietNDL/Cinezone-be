const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

// Hàm helper để format datetime cho MySQL
const formatDateTime = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " "); // Chuyển từ "2025-06-09T13:44:47.586Z" thành "2025-06-09 13:44:47"
};

class Promotion {
  static async getAllPromotions() {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Promotions WHERE IsDeleted = 0");
    return rows;
  }

  static async getPromotionById(id) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Promotions WHERE PromotionId = ? AND IsDeleted = 0",
        [id]
      );
    return rows[0];
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
    } = data;

    // Format datetime cho MySQL
    const formattedStartTime = formatDateTime(new Date(StartTime));
    const formattedEndTime = formatDateTime(new Date(EndTime));
    const formattedCreatedAt = formatDateTime(now);

    await db.promise().query(
      `INSERT INTO Promotions (
          PromotionId, Title, StartTime, EndTime, DiscountValue, 
          Detail, Image, IsDeleted, CreatedAt, CreatedBy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        id,
        Title,
        formattedStartTime,
        formattedEndTime,
        DiscountValue,
        Detail,
        Image,
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
