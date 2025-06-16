const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class SeatShowtime {
  static async getAll() {
    const sql = `SELECT * FROM SeatShowtime WHERE IsDeleted = 0`;
    const [rows] = await db.promise().query(sql);
    return rows;
  }

  static async getById(seatShowtimeId) {
    const sql = `SELECT * FROM SeatShowtime WHERE SeatShowtimeId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [seatShowtimeId]);
    return rows[0];
  }

  static async create(data) {
    const {
      SeatId,
      ShowtimeId,
      Status,
      CreatedBy
    } = data;
    const SeatShowtimeId = uuidv4();
    const CreatedAt = new Date();
    const IsDeleted = 0;
    const sql = `INSERT INTO SeatShowtime (SeatShowtimeId, SeatId, ShowtimeId, Status, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await db.promise().query(sql, [SeatShowtimeId, SeatId, ShowtimeId, Status, IsDeleted, CreatedAt, CreatedBy]);
    return SeatShowtimeId;
  }

  static async update(seatShowtimeId, data) {
    const {
      SeatId,
      ShowtimeId,
      Status,
      UpdatedBy
    } = data;
    const UpdatedAt = new Date();
    const sql = `UPDATE SeatShowtime SET SeatId=?, ShowtimeId=?, Status=?, UpdatedAt=?, UpdatedBy=? WHERE SeatShowtimeId=? AND IsDeleted=0`;
    const [result] = await db.promise().query(sql, [SeatId, ShowtimeId, Status, UpdatedAt, UpdatedBy, seatShowtimeId]);
    return result.affectedRows > 0;
  }

  static async delete(seatShowtimeId, deletedBy) {
    const DeletedAt = new Date();
    const sql = `UPDATE SeatShowtime SET IsDeleted=1, DeletedAt=?, DeletedBy=? WHERE SeatShowtimeId=? AND IsDeleted=0`;
    const [result] = await db.promise().query(sql, [DeletedAt, deletedBy, seatShowtimeId]);
    return result.affectedRows > 0;
  }
}

module.exports = SeatShowtime;
