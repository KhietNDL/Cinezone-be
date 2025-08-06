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
      const { Name, Row, Col, SeatQuantity, Type, CreatedBy } = data;
      
      // Validate row and column limits
      if (Row < 5 || Row > 20) {
        throw new Error('Number of rows must be between 5 and 20');
      }
      if (Col < 8 || Col > 20) {
        throw new Error('Number of columns must be between 8 and 20');
      }
      
      const maxPossibleSeats = Row * Col;
      if (maxPossibleSeats > 300) {
        throw new Error('Total seats cannot exceed 300 seats');
      }
      
      // Validate SeatQuantity
      if (!SeatQuantity || !Number.isInteger(SeatQuantity) || SeatQuantity <= 0) {
        throw new Error('SeatQuantity must be a positive integer');
      }
      
      const minRequiredSeats = Math.ceil(maxPossibleSeats * 0.9); // 90% của Row×Col
      if (SeatQuantity < minRequiredSeats) {
        throw new Error(`SeatQuantity must be at least 90% of total capacity (${minRequiredSeats} seats)`);
      }
      
      if (SeatQuantity > maxPossibleSeats) {
        throw new Error(`SeatQuantity cannot exceed maximum capacity (${maxPossibleSeats} seats)`);
      }
      
      // Create cinema room
      await connection.query(
        "INSERT INTO CinemaRooms (CinemaRoomId, Name, SeatQuantity, `Row`, `Col`, Type, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)",
        [id, Name, SeatQuantity, Row, Col, Type, now, CreatedBy]
      );

      // Auto-generate seats theo SeatQuantity
      await this.generateSeatsForRoom(connection, id, Row, Col, SeatQuantity, CreatedBy);
      
      await connection.commit();
      return id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async generateSeatsForRoom(connection, cinemaRoomId, numRows, numCols, targetSeats, createdBy) {
    const rows = [];
    // Generate row letters A, B, C, ..., T
    for (let i = 0; i < numRows; i++) {
      rows.push(String.fromCharCode(65 + i)); // A=65, B=66, ...
    }
    
    const now = new Date();
    let seatsCreated = 0;
    
    // Tạo ghế theo thứ tự từ trái sang phải, từ trên xuống dưới
    for (let col = 1; col <= numCols && seatsCreated < targetSeats; col++) {
      for (let rowIndex = 0; rowIndex < rows.length && seatsCreated < targetSeats; rowIndex++) {
        const row = rows[rowIndex];
        
        // Special handling for last row (Couple seats)
        if (rowIndex === rows.length - 1) { // Last row = Couple
          // Chỉ tạo ghế couple cho cột lẻ (1, 3, 5, 7, 9...) VÀ phải có đủ 2 cột
          if (col % 2 === 1 && (col + 1) <= numCols && seatsCreated < targetSeats) {
            const seatNumber = `${row}${col}-${col + 1}`; // T1-2, T3-4, T5-6...
            const seatId = uuidv4();
            await connection.query(
              `INSERT INTO Seats (SeatId, CinemaRoomId, SeatNumber, Type, Price, IsDeleted, CreatedAt, CreatedBy) 
               VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
              [seatId, cinemaRoomId, seatNumber, 'Couple', 250000, now, createdBy]
            );
            seatsCreated++;
          }
          // Với cột chẵn hoặc cột cuối lẻ: không tạo ghế couple, chỉ skip
          continue;
        } else {
          // Normal và VIP seats - TẠO ĐẦY ĐỦ TẤT CẢ CỘT
          const seatNumber = `${row}${col}`;
          
          // Determine seat type based on row
          let seatType, price;
          if (rowIndex <= 2) { // First 3 rows = Normal
            seatType = 'Normal';
            price = 90000;
          } else { // Middle rows = VIP
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
    
    return seatsCreated; // Trả về số ghế thực tế đã tạo
  }

  static async updateCinemaRoom(id, data) {
    const now = new Date();
    const { Name, Row, Col, SeatQuantity, Type, UpdatedBy } = data;
    
    // Validate row and column limits if provided
    if (Row && (Row < 5 || Row > 20)) {
      throw new Error('Number of rows must be between 5 and 20');
    }
    if (Col && (Col < 8 || Col > 20)) {
      throw new Error('Number of columns must be between 8 and 20');
    }
    if (Row && Col && Row * Col > 300) {
      throw new Error('Total seats cannot exceed 300 seats');
    }
    
    // Validate SeatQuantity if provided
    if (Row && Col && SeatQuantity) {
      const maxPossibleSeats = Row * Col;
      const minRequiredSeats = Math.ceil(maxPossibleSeats * 0.9);
      
      if (SeatQuantity < minRequiredSeats) {
        throw new Error(`SeatQuantity must be at least 90% of total capacity (${minRequiredSeats} seats)`);
      }
      if (SeatQuantity > maxPossibleSeats) {
        throw new Error(`SeatQuantity cannot exceed maximum capacity (${maxPossibleSeats} seats)`);
      }
    }
    
    const [result] = await db
      .promise()
      .query(
        "UPDATE CinemaRooms SET Name = ?, `Row` = ?, `Col` = ?, SeatQuantity = ?, Type = ?, UpdatedAt = ?, UpdatedBy = ? WHERE CinemaRoomId = ? AND IsDeleted = 0",
        [Name, Row, Col, SeatQuantity, Type, now, UpdatedBy, id]
      );

    // Nếu có thay đổi cấu trúc phòng thì xóa cứng ghế cũ và tạo lại ghế mới
    if (Row && Col && SeatQuantity) {
      // Xóa cứng toàn bộ ghế cũ
      await db.promise().query(
        "DELETE FROM Seats WHERE CinemaRoomId = ?",
        [id]
      );
      // Tạo lại ghế mới
      await this.generateSeatsForRoom(db, id, Row, Col, SeatQuantity, UpdatedBy);
    }

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
