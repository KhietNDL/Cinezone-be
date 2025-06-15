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

  static async createTicket(data) {
    const { BookingId, IssuedAt, TotalPrice, CreatedBy } = data;
    const TicketId = uuidv4();
    const CreatedAt = new Date();
    const IsDeleted = 0;
    const sql = `
      INSERT INTO Tickets (TicketId, BookingId, IssuedAt, TotalPrice, IsDeleted, CreatedAt, CreatedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      await db.promise().query(sql, [
        TicketId,
        BookingId,
        IssuedAt,
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
    const { BookingId, IssuedAt, TotalPrice, UpdatedBy } = data;
    const UpdatedAt = new Date();
    const sql = `UPDATE Tickets SET BookingId=?, IssuedAt=?, TotalPrice=?, UpdatedAt=?, UpdatedBy=? WHERE TicketId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, [BookingId, IssuedAt, TotalPrice, UpdatedAt, UpdatedBy, ticketId]);
    return result.affectedRows > 0;
  }

  static async deleteTicket(ticketId, deletedBy) {
    const DeletedAt = new Date();
    const sql = `UPDATE Tickets SET IsDeleted=1, DeletedAt=?, DeletedBy=? WHERE TicketId=? AND IsDeleted=0`;
    const [result] = await db.promise().query(sql, [DeletedAt, deletedBy, ticketId]);
    return result.affectedRows > 0;
  }
}

module.exports = Ticket;
