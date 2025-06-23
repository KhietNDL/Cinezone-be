const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Booking {
  static async getBookingById(bookingId) {
    const sql = `SELECT * FROM Bookings WHERE BookingId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [bookingId]);
    return rows[0];
  }

  static async getBookingsByMemberId(memberId) {
    const sql = `SELECT * FROM Bookings WHERE MemberId = ? AND IsDeleted = 0`;
    const [rows] = await db.promise().query(sql, [memberId]);
    return rows;
  }

  static async getAllBookings() {
    const sql = `SELECT * FROM Bookings WHERE IsDeleted = 0`;
    const [rows] = await db.promise().query(sql);
    return rows;
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
    productIds,
    promotionTitle,
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

      // 2. Kiểm tra khuyến mãi (giả sử luôn hợp lệ hoặc bạn tự bổ sung)
      let discount = 0;
      let promotionId = null;

      if (promotionTitle) {
        const [promotion] = await connection.query(
          `SELECT DiscountValue, PromotionId FROM Promotions WHERE Title = ? AND IsDeleted = 0`,
          [promotionTitle]
        );
        if (promotion.length === 0) {
          throw new Error("Promotion not found");
        }
        discount = promotion[0].DiscountValue || 0;
        promotionId = promotion[0].PromotionId;
      }

      // 3. Tính tổng tiền
      const [seatInfo] = await connection.query(
        `SELECT SUM(Price) as total FROM Seats WHERE SeatId IN (?)`,
        [seatIds]
      );
      let totalAmount = Number(seatInfo[0].total) || 0;

      if (Array.isArray(productIds) && productIds.length > 0) {
        const [products] = await connection.query(
          `SELECT SUM(Price) as total FROM Products WHERE ProductId IN (?)`,
          [productIds]
        );
        totalAmount += Number(products[0].total) || 0;
      }

      totalAmount -= (totalAmount * discount) / 100;

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
          promotionId, // <-- Dùng biến này
          expiresAt,
          now,
        ]
      );

      // 5. Tạm giữ ghế
      for (const seatId of seatIds) {
        await connection.query(
          `INSERT INTO SeatShowtime (SeatShowtimeId, SeatId, ShowtimeId, Status, CreatedAt, IsDeleted)
           VALUES (?, ?, ?, 'holding', NOW(), 0)`,
          [uuidv4(), seatId, showtimeId]
        );
      }

      // 6. Lưu sản phẩm (nếu có)
      // if (productOrders && productOrders.length > 0) {
      //   for (const p of productOrders) {
      //     await connection.query(
      //       `INSERT INTO BookingProducts (BookingProductId, BookingId, ProductId, Quantity)
      //        VALUES (?, ?, ?, ?)`,
      //       [uuidv4(), bookingId, p.productId, p.quantity]
      //     );
      //   }
      // }

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

      // 1. Đổi trạng thái booking sang "success" (ví dụ Status = 2)
      await connection.query(
        `UPDATE Bookings SET Status = 2 WHERE BookingId = ? AND Status = 1`,
        [bookingId]
      );

      // 2. Đổi trạng thái các ghế từ "holding" sang "taken"
      await connection.query(
        `UPDATE SeatShowtime
SET Status = 'taken'
WHERE ShowtimeId = (SELECT ShowtimeId FROM Bookings WHERE BookingId = ?) 
  AND Status = 'holding'`,
        [bookingId]
      );

      await connection.commit();
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
      const [bookingRows] = await db.promise().query(
        "SELECT BookingId, TotalAmount, Status FROM Bookings WHERE BookingId = ?",
        [bookingId]
      );

      const booking = bookingRows[0];

      if (!booking) {
        return {
          success: false,
          message: "Booking not found",
          code: "BOOKING_NOT_FOUND"
        };
      }

      if (booking.Status === status) {
        return {
          success: true,
          message: "Booking already in requested status",
          updated: false
        };
      }

      const amountMatches = Math.abs(Number(paidAmount) - Number(booking.TotalAmount)) < 0.01;
      if (!amountMatches) {
        return {
          success: false,
          message: "Payment amount doesn't match booking total amount",
          code: "AMOUNT_MISMATCH",
          expectedAmount: booking.TotalAmount,
          actualAmount: paidAmount
        };
      }

      const [result] = await db.promise().query(
        "UPDATE Bookings SET Status = ?, UpdatedAt = NOW() WHERE BookingId = ?",
        [status, bookingId]
      );

      return {
        success: true,
        updated: result.affectedRows > 0,
        message: "Booking status updated successfully"
      };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return {
        success: false,
        message: "Failed to update booking status",
        error: error.message,
        code: "DATABASE_ERROR"
      };
    }
  }
}

module.exports = Booking;
