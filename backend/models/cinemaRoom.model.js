const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class CinemaRoom {
  static async getAllCinemaRooms() {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM CinemaRooms WHERE IsDeleted = 0");
    return rows;
  }

  static async getCinemaRoomById(id) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM CinemaRooms WHERE CinemaRoomId = ? AND IsDeleted = 0",
        [id]
      );
    return rows[0];
  }

  static async getCinemaRoomsPaginated({ page = 1, limit = 10, sortBy = 'Name', sortOrder = 'ASC' }) {
    const offset = (page - 1) * limit;
    const validSortFields = ['Name', 'SeatQuantity', 'Type', 'CreatedAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'Name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const [rows] = await db.promise().query(
      `SELECT * FROM CinemaRooms WHERE IsDeleted = 0 ORDER BY ${orderField} ${order} LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await db.promise().query(
      "SELECT COUNT(*) as total FROM CinemaRooms WHERE IsDeleted = 0"
    );
    return { rooms: rows, total };
  }

  static async createCinemaRoom(data) {
    const id = uuidv4();
    const now = new Date();
    const { Name, SeatQuantity, Type, CreatedBy } = data;
    await db
      .promise()
      .query(
        "INSERT INTO CinemaRooms (CinemaRoomId, Name, SeatQuantity, Type, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, 0, ?, ?)",
        [id, Name, SeatQuantity, Type, now, CreatedBy]
      );
    return id;
  }

  static async updateCinemaRoom(id, data) {
    const now = new Date();
    const { Name, SeatQuantity, Type, UpdatedBy } = data;
    const [result] = await db
      .promise()
      .query(
        "UPDATE CinemaRooms SET Name = ?, SeatQuantity = ?, Type = ?, UpdatedAt = ?, UpdatedBy = ? WHERE CinemaRoomId = ? AND IsDeleted = 0",
        [Name, SeatQuantity, Type, now, UpdatedBy, id]
      );
    return result.affectedRows > 0;
  }

  static async deleteCinemaRoom(id, DeletedBy) {
    const now = new Date();
    const [result] = await db
      .promise()
      .query(
        "UPDATE CinemaRooms SET IsDeleted = 1, DeletedAt = ?, DeletedBy = ? WHERE CinemaRoomId = ? AND IsDeleted = 0",
        [now, DeletedBy, id]
      );
    return result.affectedRows > 0;
  }

  static async searchCinemaRoomsByName(name) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM CinemaRooms WHERE LOWER(Name) LIKE LOWER(?) AND IsDeleted = 0", [
        `%${name}%`,
      ]);
    return rows;
  }

  static async findByName(name) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM CinemaRooms WHERE Name = ? AND IsDeleted = 0", [name]);
    return rows[0];
  }

  static async checkRoomInUse(id) {
    const [rows] = await db
      .promise()
      .query(
        `SELECT 1 FROM Showtimes 
         WHERE CinemaRoomId = ? 
           AND IsDeleted = 0
           AND ADDTIME(CONCAT(Day, ' ', Time), SEC_TO_TIME(Duration*60)) > NOW()
         LIMIT 1`,
        [id]
      );
    return rows.length > 0;
  }
}

module.exports = CinemaRoom;
