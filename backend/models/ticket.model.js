const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

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
}

module.exports = Ticket;