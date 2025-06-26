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

  static async createCinemaRoom(data) {
    const id = uuidv4();
    const now = new Date();
    const { Name, SeatQuantity, CreatedBy } = data;
    await db
      .promise()
      .query(
        "INSERT INTO CinemaRooms (CinemaRoomId, Name, SeatQuantity, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, 0, ?, ?)",
        [id, Name, SeatQuantity, now, CreatedBy]
      );
    return id;
  }

  static async updateCinemaRoom(id, data) {
    const now = new Date();
    const { Name, SeatQuantity, UpdatedBy } = data;
    const [result] = await db
      .promise()
      .query(
        "UPDATE CinemaRooms SET Name = ?, SeatQuantity = ?, UpdatedAt = ?, UpdatedBy = ? WHERE CinemaRoomId = ? AND IsDeleted = 0",
        [Name, SeatQuantity, now, UpdatedBy, id]
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
}

module.exports = CinemaRoom;
