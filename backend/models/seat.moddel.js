const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Seat {
  static async getAllSeats() {
    const sql = `SELECT * FROM Seats WHERE IsDeleted = 0`;
    const [rows] = await db.promise().query(sql);
    return rows;
  }

  static async getSeatsByCinemaRoomId(cinemaRoomId) {
    const sql = `SELECT * FROM Seats WHERE CinemaRoomId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [cinemaRoomId]);
    return rows;
  }

  static async getSeatById(seatId) {
    const sql = `SELECT * FROM Seats WHERE SeatId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [seatId]);
    return rows[0];
  }

  static async createSeat(data) {
    const { CinemaRoomId, SeatNumber, Type, Status, Price, CreatedBy } = data;
    const SeatId = uuidv4();
    const CreatedAt = new Date();
    const IsDeleted = 0;
    const sql = `INSERT INTO Seats (SeatId, CinemaRoomId, SeatNumber, Type, Status, Price, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.promise().query(sql, [SeatId, CinemaRoomId, SeatNumber, Type, Status, Price, IsDeleted, CreatedAt, CreatedBy]);
    return SeatId;
  }

  static async updateSeat(seatId, data) {
    const { CinemaRoomId, SeatNumber, Type, Status, Price, UpdatedBy } = data;
    const UpdatedAt = new Date();
    const sql = `UPDATE Seats SET CinemaRoomId = ?, SeatNumber = ?, Type = ?, Status = ?, Price = ?, UpdatedAt = ?, UpdatedBy = ? WHERE SeatId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, [CinemaRoomId, SeatNumber, Type, Status, Price, UpdatedAt, UpdatedBy, seatId]);
    return result.affectedRows > 0;
  }

  static async deleteSeat(seatId, deletedBy) {
    const DeletedAt = new Date();
    const sql = `UPDATE Seats SET IsDeleted = 1, DeletedAt = ?, DeletedBy = ? WHERE SeatId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, [DeletedAt, deletedBy, seatId]);
    return result.affectedRows > 0;
  }

  static async getSeatsByShowtimeId(showtimeId) {
    const sql = `
      SELECT 
        s.SeatId, s.SeatNumber, s.Type, s.Price, s.CinemaRoomId
      FROM Seats s
      JOIN seat_showtime ss ON s.SeatId = ss.SeatId
      JOIN Showtimes st ON ss.ShowtimeId = st.ShowtimeId
      WHERE st.ShowtimeId = ?
    `;
    try {
      const [rows] = await db.promise().query(sql, [showtimeId]);
      return rows;
    } catch (error) {
      throw new Error("Error getting seats by showtime ID: " + error.message);
    }
  }
}

module.exports = Seat;
