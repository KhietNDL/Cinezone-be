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
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();
      
      const id = uuidv4();
      const now = new Date();
      const { Name, SeatQuantity, Type, CreatedBy } = data;
      
      // Validate seat quantity (max 120 seats: 10 rows × 12 columns)
      if (SeatQuantity > 120) {
        throw new Error('Seat quantity cannot exceed 120 seats (10 rows × 12 columns)');
      }
      
      // Create cinema room
      await connection.query(
        "INSERT INTO CinemaRooms (CinemaRoomId, Name, SeatQuantity, Type, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, 0, ?, ?)",
        [id, Name, SeatQuantity, Type, now, CreatedBy]
      );

      // Auto-generate seats based on seat quantity
      await this.generateSeatsForRoom(connection, id, SeatQuantity, CreatedBy);
      
      await connection.commit();
      return id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async generateSeatsForRoom(connection, cinemaRoomId, seatQuantity, createdBy) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const maxCols = 12;
    const now = new Date();
    
    let seatsCreated = 0;
    
    // Create seats column by column (A1, B1, C1... then A2, B2, C2...)
    for (let col = 1; col <= maxCols && seatsCreated < seatQuantity; col++) {
      for (let rowIndex = 0; rowIndex < rows.length && seatsCreated < seatQuantity; rowIndex++) {
        const row = rows[rowIndex];
        
        // Special handling for row J (Couple seats)
        if (rowIndex === 9) { // J = Couple
          // Chỉ tạo ghế couple cho cột lẻ (1, 3, 5, 7, 9, 11)
          // Mỗi ghế couple sẽ chiếm 2 vị trí
          if (col % 2 === 1) { // Cột lẻ
            const seatNumber = `${row}${col}-${col + 1}`; // J1-2, J3-4, J5-6...
            const seatId = uuidv4();
            await connection.query(
              `INSERT INTO Seats (SeatId, CinemaRoomId, SeatNumber, Type, Price, IsDeleted, CreatedAt, CreatedBy) 
               VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
              [seatId, cinemaRoomId, seatNumber, 'Couple', 250000, now, createdBy]
            );
            seatsCreated++;
          }
          continue;
        } else {
          // Normal và VIP seats
          const seatNumber = `${row}${col}`;
          
          // Determine seat type based on row
          let seatType, price;
          if (rowIndex <= 2) { // A, B, C = Normal
            seatType = 'Normal';
            price = 90000;
          } else { // D, E, F, G, H, I = VIP
            seatType = 'VIP';
            price = 150000;
          }
          
          const seatId = uuidv4();
          await connection.query(
            `INSERT INTO Seats (SeatId, CinemaRoomId, SeatNumber, Type, Price, IsDeleted, CreatedAt, CreatedBy) 
             VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
            [seatId, cinemaRoomId, seatNumber, seatType, price, now, createdBy]
          );
          
          seatsCreated++;
        }
      }
    }
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
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();
      
      const now = new Date();
      
      // 1. Xóa mềm tất cả ghế trong phòng này
      await connection.query(
        `DELETE FROM Seats WHERE CinemaRoomId = ? AND IsDeleted = 0`,
        [id]
      );
      
      // 2. Xóa mềm phòng chiếu
      const [result] = await connection.query(
        "UPDATE CinemaRooms SET IsDeleted = 1, DeletedAt = ?, DeletedBy = ? WHERE CinemaRoomId = ? AND IsDeleted = 0",
        [now, DeletedBy, id]
      );
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async searchCinemaRoomsByName(name, page = 1, limit = 10, sortBy = "Name", sortOrder = "ASC") {
    const validSortFields = ['Name', 'SeatQuantity', 'Type', 'CreatedAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'Name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let sql = `SELECT * FROM CinemaRooms WHERE LOWER(Name) LIKE LOWER(?) AND IsDeleted = 0 ORDER BY ${orderField} ${order}`;
    let params = [`%${name}%`];
    let total = 0;

    if (limit > 0) {
      const [[countRow]] = await db.promise().query(
        "SELECT COUNT(*) as total FROM CinemaRooms WHERE LOWER(Name) LIKE LOWER(?) AND IsDeleted = 0",
        [`%${name}%`]
      );
      total = countRow.total;
      const offset = (page - 1) * limit;
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limit), Number(offset));
    }

    const [rows] = await db.promise().query(sql, params);
    return {
      rooms: rows,
      pagination: {
        total,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        limit: limit > 0 ? limit : rows.length,
      },
    };
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
