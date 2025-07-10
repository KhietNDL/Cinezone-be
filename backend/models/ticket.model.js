const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { normalizeDate } = require("../middlewares/showtime.validator");

class Ticket {
  static async getAllTickets() {
    const sql = `SELECT * FROM Tickets WHERE IsDeleted = 0`;
    const [rows] = await db.promise().query(sql);
    return rows;
  }

  static async getTicketById(ticketId) {
    const sql = `SELECT * FROM Tickets WHERE TicketId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [ticketId]);
    return rows[0];
  }

  static async getTicketsByBookingId(bookingId) {
    const sql = `SELECT * FROM Tickets WHERE BookingId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [bookingId]);
    return rows;
  }

  static async createTicket(data, connection) {
    const { BookingId, SeatId, TotalPrice, CreatedBy } = data;
    const TicketId = uuidv4();
    const CreatedAt = new Date();
    const IsDeleted = 0;
    const sql = `
      INSERT INTO Tickets (TicketId, BookingId, SeatId, TotalPrice, IsDeleted, CreatedAt, CreatedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await connection.query(sql, [
        TicketId,
        BookingId,
        SeatId,
        TotalPrice,
        IsDeleted,
        CreatedAt,
        CreatedBy
      ]);
      return TicketId;
    } catch (error) {
      throw new Error("Error creating ticket: " + error.message);
    }
  }

  static async updateTicket(ticketId, data) {
    const { BookingId, SeatId, TotalPrice, UpdatedBy } = data;
    const UpdatedAt = new Date();
    const sql = `UPDATE Tickets SET BookingId=?, SeatId=?, TotalPrice=?, UpdatedAt=?, UpdatedBy=? WHERE TicketId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, [BookingId, SeatId, TotalPrice, UpdatedAt, UpdatedBy, ticketId]);
    return result.affectedRows > 0;
  }

  static async deleteTicket(ticketId) {
    const DeletedAt = new Date();
    const sql = `UPDATE Tickets SET IsDeleted=1, DeletedAt=? WHERE TicketId=? AND IsDeleted=0`;
    const [result] = await db.promise().query(sql, [DeletedAt, ticketId]);
    return result.affectedRows > 0;
  }

  static async countTicketsByDate({ type = 'day', year, month }) {
    let groupBy, dateCondition = '', params = [];
    
    if (type === 'day') {
      groupBy = 'DATE(b.BookingDate)';
      dateCondition = 'YEAR(b.BookingDate) = ? AND MONTH(b.BookingDate) = ?';
      params = [year, month];
    } else if (type === 'month') {
      groupBy = 'YEAR(b.BookingDate), MONTH(b.BookingDate)';
      dateCondition = 'YEAR(b.BookingDate) = ?';
      params = [year];
    } else if (type === 'year') {
      groupBy = 'YEAR(b.BookingDate)';
      dateCondition = '1=1';
      params = [];
    } else {
      throw new Error('Invalid type');
    }

    const sql = `
      SELECT ${groupBy} as period, COUNT(t.TicketId) as total
      FROM Tickets t
      JOIN Bookings b ON t.BookingId = b.BookingId
      WHERE t.IsDeleted = 0 AND b.Status IN (2,3) AND ${dateCondition}
      GROUP BY ${groupBy}
      ORDER BY period ASC
    `;
    const [rows] = await db.promise().query(sql, params);

    // Chỉ normalize khi thống kê theo ngày
    if (type === 'day') {
      return rows.map(row => ({
        ...row,
        period: normalizeDate(row.period)
      }));
    }
    return rows;
  }
}

module.exports = Ticket;
