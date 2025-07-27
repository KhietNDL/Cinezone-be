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
    const { CinemaRoomId, SeatNumber, Type, Price, CreatedBy } = data;
    const SeatId = uuidv4();
    const CreatedAt = new Date();
    const IsDeleted = 0;
    
    // Kiểm tra xem SeatNumber đã tồn tại trong phòng chưa
    const [existingSeat] = await db.promise().query(
      `SELECT SeatId FROM Seats WHERE CinemaRoomId = ? AND SeatNumber = ? AND IsDeleted = 0`,
      [CinemaRoomId, SeatNumber]
    );
    
    if (existingSeat.length > 0) {
      throw new Error(`Seat ${SeatNumber} already exists in this cinema room`);
    }
    
    const sql = `INSERT INTO Seats (SeatId, CinemaRoomId, SeatNumber, Type, Price, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.promise().query(sql, [SeatId, CinemaRoomId, SeatNumber, Type, Price, IsDeleted, CreatedAt, CreatedBy]);
    
    // Cập nhật SeatQuantity trong CinemaRooms khi thêm ghế mới thành công
    await db.promise().query(
      `UPDATE CinemaRooms SET SeatQuantity = SeatQuantity + 1 WHERE CinemaRoomId = ?`,
      [CinemaRoomId]
    );
    
    return SeatId;
  }

  static async updateSeat(seatId, data) {
    const { CinemaRoomId, SeatNumber, Type, Price, UpdatedBy } = data;
    const UpdatedAt = new Date();
    const sql = `UPDATE Seats SET CinemaRoomId = ?, SeatNumber = ?, Type = ?, Price = ?, UpdatedAt = ?, UpdatedBy = ? WHERE SeatId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, [CinemaRoomId, SeatNumber, Type, Price, UpdatedAt, UpdatedBy, seatId]);
    return result.affectedRows > 0;
  }

  static async deleteSeat(seatId, deletedBy) {
    const DeletedAt = new Date();
    // Lấy CinemaRoomId trước khi xóa
    const [rows] = await db.promise().query(
      `SELECT CinemaRoomId FROM Seats WHERE SeatId = ? AND IsDeleted = 0`,
      [seatId]
    );
    if (!rows[0]) return false;
    const CinemaRoomId = rows[0].CinemaRoomId;

    const sql = `UPDATE Seats SET IsDeleted = 1, DeletedAt = ?, DeletedBy = ? WHERE SeatId = ? AND IsDeleted = 0`;
    const [result] = await db.promise().query(sql, [DeletedAt, deletedBy, seatId]);
    // Giảm số lượng ghế trong CinemaRooms
    await db.promise().query(
      `UPDATE CinemaRooms SET SeatQuantity = SeatQuantity - 1 WHERE CinemaRoomId = ?`,
      [CinemaRoomId]
    );
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
