const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class BookingSeat {
  static async createBookingSeat(data) {
    const { BookingId, SeatId } = data;
    const BookingSeatId = uuidv4();
    const sql = `INSERT INTO BookingSeats (BookingSeatId, BookingId, SeatId, Status, IsDeleted) VALUES (?, ?, ?, ?, 0)`;
    await db.promise().query(sql, [BookingSeatId, BookingId, SeatId, Status]);
    return BookingSeatId;
  }

  static async getSeatsByBookingId(bookingId) {
    const sql = `
      SELECT s.* FROM BookingSeats bs
      JOIN Seats s ON bs.SeatId = s.SeatId
      WHERE bs.BookingId = ? AND bs.IsDeleted = 0
    `;
    const [rows] = await db.promise().query(sql, [bookingId]);
    return rows;
  }

  static async getBookingsBySeatId(seatId) {
    const sql = `
      SELECT b.* FROM BookingSeats bs
      JOIN Bookings b ON bs.BookingId = b.BookingId
      WHERE bs.SeatId = ? AND bs.IsDeleted = 0
    `;
    const [rows] = await db.promise().query(sql, [seatId]);
    return rows;
  }

  static async deleteBookingSeat(bookingSeatId) {
    const sql = `UPDATE BookingSeats SET IsDeleted = 1 WHERE BookingSeatId = ?`;
    const [result] = await db.promise().query(sql, [bookingSeatId]);
    return result.affectedRows > 0;
  }
}

module.exports = BookingSeat;
