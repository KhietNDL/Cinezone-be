const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { normalizeDate } = require("../middlewares/showtime.validator");
const Ticket = require("./ticket.model"); // Đảm bảo đã require ở đầu file
const io = global._io;

class Booking {
  static async getBookingById(bookingId) {
    const sql = `SELECT * FROM Bookings WHERE BookingId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [bookingId]);
    return rows[0];
  }

  static async getBookingsByMemberId(memberId) {
    // Lấy danh sách BookingId theo memberId
    const sql = `SELECT BookingId FROM Bookings WHERE MemberId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [memberId]);
    if (!rows.length) return [];

    // Lấy chi tiết từng booking
    const bookingDetails = [];
    for (const row of rows) {
      const detail = await Booking.getBookingDetail(row.BookingId);
      if (detail) bookingDetails.push(detail);
    }
    return bookingDetails;
  }

  static async getAllBookings({ page = 1, limit = 0, sortBy = 'CreatedAt', sortOrder = 'desc' } = {}) {
    let sql = `SELECT * FROM Bookings WHERE IsDeleted = 0`;
    let countSql = `SELECT COUNT(*) as total FROM Bookings WHERE IsDeleted = 0`;
    const params = [];

    // Sorting
    const allowedSort = ['CreatedAt', 'BookingDate', 'TotalAmount', 'Status'];
    if (!allowedSort.includes(sortBy)) sortBy = 'CreatedAt';
    if (!['asc', 'desc'].includes(sortOrder.toLowerCase())) sortOrder = 'desc';

    sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Pagination
    let total = 0;
    if (limit > 0) {
      const [[countRow]] = await db.promise().query(countSql);
      total = countRow.total;
      const offset = (page - 1) * limit;
      sql += ` LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));
    }

    const [rows] = await db.promise().query(sql, params);

    if (limit > 0) {
      return {
        data: rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    }
    return { data: rows };
  }

  static async createBooking(data) {
    const {
      MemberId,
      ShowtimeId,
      BookingDate,
      TotalAmount,
      Status,
      PromotionId,
      CreatedBy,
    } = data;
    const BookingId = uuidv4();
    const CreatedAt = new Date();
    const IsDeleted = 0;
    const sql = `
      INSERT INTO Bookings (BookingId, MemberId, ShowtimeId, BookingDate, TotalAmount, Status, PromotionId, IsDeleted, CreatedAt, CreatedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db
      .promise()
      .query(sql, [
        BookingId,
        MemberId,
        ShowtimeId,
        BookingDate,
        TotalAmount,
        Status,
        PromotionId,
        IsDeleted,
        CreatedAt,
        CreatedBy,
      ]);
    return BookingId;
  }

  static async updateBooking(bookingId, data) {
    const {
      MemberId,
      ShowtimeId,
      BookingDate,
      TotalAmount,
      Status,
      PromotionId,
      UpdatedBy,
    } = data;
    const UpdatedAt = new Date();
    const sql = `
      UPDATE Bookings SET MemberId=?, ShowtimeId=?, BookingDate=?, TotalAmount=?, Status=?, PromotionId=?, UpdatedAt=?, UpdatedBy=?
      WHERE BookingId=? AND IsDeleted=0
    `;
    const [result] = await db
      .promise()
      .query(sql, [
        MemberId,
        ShowtimeId,
        BookingDate,
        TotalAmount,
        Status,
        PromotionId,
        UpdatedAt,
        UpdatedBy,
        bookingId,
      ]);
    return result.affectedRows > 0;
  }

  static async deleteBooking(bookingId, deletedBy) {
    const DeletedAt = new Date();
    const sql = `UPDATE Bookings SET IsDeleted=1, DeletedAt=?, DeletedBy=? WHERE BookingId=? AND IsDeleted=0`;
    const [result] = await db
      .promise()
      .query(sql, [DeletedAt, deletedBy, bookingId]);
    return result.affectedRows > 0;
  }

  static async getLatestBookingByMemberId(memberId) {
    const sql = `SELECT * FROM Bookings WHERE MemberId = ? AND IsDeleted = 0 ORDER BY CreatedAt DESC LIMIT 1`;
    const [rows] = await db.promise().query(sql, [memberId]);
    return rows[0];
  }



  static async holdBooking({
    userId,
    showtimeId,
    seatIds,
    promotionCode,
    discount = 0,
    CreatedBy,
  }) {

    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();

      // 1. Kiểm tra ghế còn available (FOR UPDATE)
      const [seats] = await connection.query(
        `SELECT SeatId FROM Seats 
         WHERE SeatId IN (?) AND IsDeleted = 0`,
        [seatIds]
      );
      if (seats.length !== seatIds.length) {
        throw new Error("Some seats not found");
      }
      // Kiểm tra trạng thái ghế trong SeatShowtime
      const [bookedSeats] = await connection.query(
        `SELECT SeatId FROM SeatShowtime 
         WHERE ShowtimeId = ? AND SeatId IN (?) AND Status IN ('taken', 'holding') AND IsDeleted = 0 FOR UPDATE`,
        [showtimeId, seatIds]
      );
      if (bookedSeats.length > 0) {
        throw new Error("Some seats are not available");
      }

      // 2. Xử lý promotion hoặc discount (chỉ 1 trong 2)
      let promotionDiscount = 0; // phần trăm
      let promotionId = null;
      if (promotionCode) {
        const [promotion] = await connection.query(
          `SELECT DiscountValue, PromotionId FROM Promotions WHERE Code = ? AND IsDeleted = 0`,
          [promotionCode]
        );
        if (promotion.length === 0) {
          throw new Error("Promotion not found");
        }
        promotionDiscount = promotion[0].DiscountValue || 0;
        promotionId = promotion[0].PromotionId;
      }

      // 3. Tính tổng tiền & lấy thông tin từng ghế
      const [seatInfo] = await connection.query(
        `SELECT SeatId, Price FROM Seats WHERE SeatId IN (?)`,
        [seatIds]
      );
      let totalAmount = seatInfo.reduce((sum, seat) => sum + Number(seat.Price), 0);

      if (promotionDiscount > 0) {
      // Nếu có promotion, giảm theo phần trăm
      totalAmount -= (totalAmount * promotionDiscount) / 100;
      } else if (discount > 0) {
        // Nếu có discount từ điểm, giảm trực tiếp số tiền
        totalAmount -= discount;
      }
      // Đảm bảo tổng tiền không âm
      totalAmount = Math.max(0, totalAmount);

      // 4. Tạo booking
      const bookingId = uuidv4();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 phút
      await connection.query(
        `INSERT INTO Bookings (BookingId, MemberId, ShowtimeId, BookingDate, Status, TotalAmount, PromotionId, ExpiresAt, CreatedAt, IsDeleted)
         VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, 0)`,
        [
          bookingId,
          userId,
          showtimeId,
          now,
          totalAmount,
          promotionId,
          expiresAt,
          now,
        ]
      );

      // 5. Tạm giữ ghế
      for (const seatId of seatIds) {
        await connection.query(
          `INSERT INTO SeatShowtime (SeatShowtimeId, SeatId, ShowtimeId, BookingId, Status, CreatedAt, CreatedBy, IsDeleted)
           VALUES (?, ?, ?, ?, 'holding', NOW(), ?, 0)`,
          [uuidv4(), seatId, showtimeId, bookingId, CreatedBy]
        );
      }

      // 6. Tạo vé cho từng ghế với đúng giá
      for (const seat of seatInfo) {
        await Ticket.createTicket({
          BookingId: bookingId,
          SeatId: seat.SeatId,
          TotalPrice: seat.Price,
          CreatedBy,
        }, connection);
      }

      await connection.commit();
      return { bookingId, totalAmount, expiresAt };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
  static async confirmBooking(bookingId) {
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE Bookings SET Status = 2 WHERE BookingId = ? AND Status = 1`,
        [bookingId]
      );

      // 2. Đổi trạng thái các ghế từ "holding" sang "taken"
      await connection.query(
        `UPDATE SeatShowtime
        SET Status = 'taken'
        WHERE BookingId = ? AND Status = 'holding'`,
        [bookingId]
      );

      await connection.commit();

      // Lấy io tại đây, đảm bảo luôn lấy giá trị mới nhất
      const io = global._io;
      const [[booking]] = await db.promise().query(
        `SELECT MemberId FROM Bookings WHERE BookingId = ?`, [bookingId]
      );
      if (io && booking && booking.MemberId) {
        io.to(booking.MemberId).emit('notification', {
          type: 'booking',
          bookingId,
          status: 2,
          message: 'Your ticket has been confirmed!'
        });
      } else {
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
  /**
   * @param {string} bookingId - ID của booking
   * @param {number} status - Trạng thái mới (ví dụ: PAID = 2)
   * @param {number} paidAmount - Số tiền đã thanh toán
   * @returns {object} - Kết quả cập nhật và thông báo
   */
  static async updateStatus(bookingId, status, paidAmount) {
    try {
      const [bookingRows] = await db
        .promise()
        .query(
          "SELECT BookingId, TotalAmount, Status FROM Bookings WHERE BookingId = ?",
          [bookingId]
        );

      const booking = bookingRows[0];

      if (!booking) {
        return {
          success: false,
          message: "Booking not found",
          code: "BOOKING_NOT_FOUND",
        };
      }

      if (booking.Status === status) {
        return {
          success: true,
          message: "Booking already in requested status",
          updated: false,
        };
      }

      const amountMatches =
        Math.abs(Number(paidAmount) - Number(booking.TotalAmount)) < 0.01;
      if (!amountMatches) {
        return {
          success: false,
          message: "Payment amount doesn't match booking total amount",
          code: "AMOUNT_MISMATCH",
          expectedAmount: booking.TotalAmount,
          actualAmount: paidAmount,
        };
      }

      const [result] = await db
        .promise()
        .query(
          "UPDATE Bookings SET Status = ?, UpdatedAt = NOW() WHERE BookingId = ?",
          [status, bookingId]
        );

      return {
        success: true,
        updated: result.affectedRows > 0,
        message: "Booking status updated successfully",
      };
    } catch (error) {
      console.error("Error updating booking status:", error);
      return {
        success: false,
        message: "Failed to update booking status",
        error: error.message,
        code: "DATABASE_ERROR",
      };
    }
  }
  static async cancelBooking(bookingId) {
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();

      // 1. Đổi trạng thái booking sang CANCELLED (4)
      await connection.query(
        `UPDATE Bookings SET Status = 4 WHERE BookingId = ? AND Status IN (1,2)`,
        [bookingId]
      );

      // 2. Đổi trạng thái các ghế từ "holding" hoặc "taken" sang "available"
      await connection.query(
        `UPDATE SeatShowtime
         SET Status = 'cancelled'
         WHERE BookingId = ? AND Status IN ('holding', 'taken')`,
        [bookingId]
      );  

      // 3. Xóa mềm tất cả ticket của booking này
      const [tickets] = await connection.query(
        `SELECT TicketId FROM Tickets WHERE BookingId = ? AND IsDeleted = 0`,
        [bookingId]
      );
      for (const ticket of tickets) {
        await Ticket.deleteTicket(ticket.TicketId);
      }

      await connection.commit();

      // Gửi notification realtime khi cancel
      const io = global._io;
      const [[booking]] = await db.promise().query(
        `SELECT MemberId FROM Bookings WHERE BookingId = ?`, [bookingId]
      );
      if (io && booking && booking.MemberId) {
        io.to(booking.MemberId).emit('notification', {
          type: 'booking',
          bookingId,
          status: 4,
          message: 'Your ticket has been cancelled!'
        });
      }
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
  static async checkinBooking(bookingId) {
    // Chỉ cho phép checkin nếu status hiện tại là 2 (PAID)
    const [rows] = await db
      .promise()
      .query(
        "SELECT Status, MemberId FROM Bookings WHERE BookingId = ? AND IsDeleted = 0",
        [bookingId]
      );
    if (!rows[0]) {
      return { success: false, message: "Booking not found" };
    }
    if (rows[0].Status !== 2) {
      return { success: false, message: "Booking is not in PAID status" };
    }
    const [result] = await db
      .promise()
      .query(
        "UPDATE Bookings SET Status = 3, UpdatedAt = NOW() WHERE BookingId = ? AND Status = 2 AND IsDeleted = 0",
        [bookingId]
      );

    // Gửi notification realtime khi checkin
    const io = global._io;
    const memberId = rows[0].MemberId;
    if (io && memberId) {
      io.to(memberId).emit('notification', {
        type: 'booking',
        bookingId,
        status: 3,
        message: 'Your ticket has been checked in!'
      });
    }

    return {
      success: result.affectedRows > 0,
      message:
        result.affectedRows > 0 ? "Check-in successful" : "Check-in failed",
    };
  }
  static async getBookingDetail(bookingId) {
    // Lấy thông tin booking, showtime, movie, user
    const [rows] = await db.promise().query(
      `
    SELECT 
      b.BookingId,
      b.TotalAmount,
      b.BookingDate,
      u.FullName AS buyerName,
      u.PhoneNumber AS buyerPhone,
      u.CCCD AS buyerCCCD,
      mv.NameOfVietnamese,
	    mv.NameOfEnglish,
      s.Day,
      s.Time,
      cr.Name,
      v.VersionType,
      p.Title,
      b.Status,
      s.Duration,
      sh.ScoreValue
    FROM Bookings b
    JOIN Users u ON b.MemberId = u.UserId
    JOIN Showtimes s ON b.ShowtimeId = s.ShowtimeId
    JOIN Version v ON s.VersionId = v.VersionId
    JOIN Movies mv ON v.MovieId = mv.MovieId
    JOIN CinemaRooms cr ON s.CinemaRoomId = cr.CinemaRoomId
    LEFT JOIN Promotions p ON b.PromotionId = p.PromotionId
    LEFT JOIN ScoreHistory sh ON b.BookingId = sh.RelatedBookingId
    WHERE b.BookingId = ? AND b.IsDeleted = 0;
    `,
      [bookingId]
    );
    if (!rows[0]) return null;

    // Lấy danh sách ghế
    const [seats] = await db.promise().query(
      `
    SELECT s.SeatNumber, s.Price
    FROM SeatShowtime ss
    JOIN Seats s ON s.SeatId = ss.SeatId
    WHERE ss.BookingId = ?
    AND ss.Status IN ('taken', 'holding')
      AND ss.IsDeleted = 0;
    `,
      [bookingId]
    );

    return {
      bookingId: rows[0].BookingId,
      bookingDate: rows[0].BookingDate,
      movieNameVN: rows[0].NameOfVietnamese,
      movieNameEnglish: rows[0].NameOfEnglish,
      versionType: rows[0].VersionType,

      showDate: normalizeDate(rows[0].Day),
      showTime: rows[0].Time,
      duration: rows[0].Duration,
      room: rows[0].Name,
      seats: seats.map((s) => s.SeatNumber),
      seatPrices: seats.reduce((acc, s) => {
        acc[s.SeatNumber] = s.Price;
        return acc;
      }, {}),
      totalPrice: seats.reduce((sum, s) => sum + Number(s.Price), 0),
      promotionTitle: rows[0].Title,

      totalAmount: rows[0].TotalAmount,
      buyerName: rows[0].buyerName,
      buyerPhone: rows[0].buyerPhone,
      buyerCCCD: rows[0].buyerCCCD,
      pointEarn: rows[0].ScoreValue > 0 ? rows[0].ScoreValue : undefined,
      pointUse: rows[0].ScoreValue < 0 ? Math.abs(rows[0].ScoreValue) : undefined,
      status: rows[0].Status
    };
  }
  static async findBookingsByUserInfo({ email, cccd, phone }) {
  let where = [];
  let params = [];
  if (email) {
    where.push("u.Email LIKE ?");
    params.push(`%${email}%`);
  }
  if (cccd) {
    where.push("u.CCCD LIKE ?");
    params.push(`%${cccd}%`);
  }
  if (phone) {
    where.push("u.PhoneNumber LIKE ?");
    params.push(`%${phone}%`);
  }
  if (where.length === 0) return [];

  const [rows] = await db.promise().query(
    `
    SELECT b.BookingId
    FROM Bookings b
    JOIN Users u ON b.MemberId = u.UserId
    WHERE (${where.join(" OR ")}) AND b.IsDeleted = 0
    `,
    params
  );
  // Lấy chi tiết từng booking
  const bookingDetails = [];
  for (const row of rows) {
    const detail = await Booking.getBookingDetail(row.BookingId);
    if (detail) bookingDetails.push(detail);
  }
  return bookingDetails;
}
}

module.exports = Booking;
