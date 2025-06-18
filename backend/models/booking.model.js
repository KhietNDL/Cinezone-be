const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Booking {
  static async getBookingById(bookingId) {
    const sql = `SELECT * FROM Bookings WHERE BookingId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [bookingId]);
    return rows[0];
  }

  static async getBookingsByMemberId(memberId) {
    const sql = `SELECT * FROM Bookings WHERE MemberId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [memberId]);
    return rows;
  }

  static async getAllBookings() {
    const sql = `SELECT * FROM Bookings WHERE IsDeleted = 0`;
    const [rows] = await db.promise().query(sql);
    return rows;
  }

  static async createBooking(data) {
    const {
      MemberId,
      ShowtimeId,
      BookingDate,
      TotalAmount,
      Status,
      PromotionId,
      CreatedBy
    } = data;
    const BookingId = uuidv4();
    const CreatedAt = new Date();
    const IsDeleted = 0;
    const sql = `
      INSERT INTO Bookings (BookingId, MemberId, ShowtimeId, BookingDate, TotalAmount, Status, PromotionId, IsDeleted, CreatedAt, CreatedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.promise().query(sql, [
      BookingId,
      MemberId,
      ShowtimeId,
      BookingDate,
      TotalAmount,
      Status,
      PromotionId,
      IsDeleted,
      CreatedAt,
      CreatedBy
    ]);
    return BookingId;
  }

  static async updateBooking(bookingId, data) {
    const {
      MemberId,
      ShowtimeId,
      BookingDate,
      TotalAmount,
      Status,
      PromotionId,
      UpdatedBy
    } = data;
    const UpdatedAt = new Date();
    const sql = `
        UPDATE Bookings SET MemberId=?, ShowtimeId=?, BookingDate=?, TotalAmount=?, Status=?, PromotionId=?, UpdatedAt=?, UpdatedBy=?
      WHERE BookingId=? AND IsDeleted=0
    `;
    const [result] = await db.promise().query(sql, [
      MemberId,
      ShowtimeId,
      BookingDate,
      TotalAmount,
      Status,
      PromotionId,
      UpdatedAt,
      UpdatedBy,
      bookingId
    ]);
    return result.affectedRows > 0;
  }

  static async deleteBooking(bookingId, deletedBy) {
    const DeletedAt = new Date();
    const sql = `UPDATE Bookings SET IsDeleted=1, DeletedAt=?, DeletedBy=? WHERE BookingId=? AND IsDeleted=0`;
    const [result] = await db.promise().query(sql, [DeletedAt, deletedBy, bookingId]);
    return result.affectedRows > 0;
  }

  static async getLatestBookingByMemberId(memberId) {
    const sql = `SELECT * FROM Bookings WHERE MemberId = ? AND IsDeleted = 0 ORDER BY CreatedAt DESC LIMIT 1`;
    const [rows] = await db.promise().query(sql, [memberId]);
    return rows[0];
  }
}

module.exports = Booking;
