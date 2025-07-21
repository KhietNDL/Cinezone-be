const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const Booking = require('./booking.model');
const OrderProduct = require('./orderProduct.model');

class Payment {
  static async createPayment(paymentData) {
    const paymentId = uuidv4();
    const {
      Amount,
      Provider,
      PaymentReference,
      Status,
      BookingId,
      OrderProductId,
      MethodId,
      CreatedBy
    } = paymentData;

    const [result] = await db.promise().query(
      "INSERT INTO Payments (PaymentId, PaymentDate, Amount, Provider, PaymentReference, Status, IsDeleted, CreatedAt, CreatedBy, BookingId, OrderProductId, MethodId) VALUES (?, NOW(), ?, ?, ?, ?, 0, NOW(), ?, ?, ?, ?)",
      [paymentId, Amount, Provider, PaymentReference, Status, CreatedBy, BookingId, OrderProductId, MethodId]
    );

    return paymentId;
  }

  static async getPaymentById(paymentId) {
    const [rows] = await db.promise().query(
      "SELECT * FROM Payments WHERE PaymentId = ? AND IsDeleted = 0",
      [paymentId]
    );
    return rows[0];
  }

  static async updatePaymentStatus(paymentId, status, updatedBy, metadata = {}) {
    const [result] = await db.promise().query(
      "UPDATE Payments SET Status = ?, UpdatedAt = NOW(), UpdatedBy = ? WHERE PaymentId = ?",
      [status, updatedBy, paymentId]
    );

    if (metadata && metadata.PaymentReference) {
      await this.updatePaymentReference(paymentId, metadata.PaymentReference);
    }

    return result.affectedRows > 0;
  }

  static async updatePaymentReference(paymentId, reference) {
    const [result] = await db.promise().query(
      "UPDATE Payments SET PaymentReference = ?, UpdatedAt = NOW() WHERE PaymentId = ?",
      [reference, paymentId]
    );
    return result.affectedRows > 0;
  }

  static async getPaymentsByBookingId(bookingId) {
    const [rows] = await db.promise().query(
      "SELECT p.*, pm.Name as MethodName, pm.Type as MethodType FROM Payments p JOIN PaymentMethod pm ON p.MethodId = pm.MethodId WHERE p.BookingId = ? AND p.IsDeleted = 0",
      [bookingId]
    );
    return rows;
  }
  
  /**
   * Lấy lịch sử booking kèm orderProduct theo memberId, có phân trang và sort
   */
  static async getMemberHistory(memberId, { page = 1, limit = 10, sortBy = "CreatedAt", sortOrder = "desc" } = {}) {
    // Lấy tất cả payment liên quan đến memberId (qua booking hoặc orderProduct)
    const offset = (page - 1) * limit;
    const [payments] = await db.promise().query(
      `SELECT * FROM Payments 
       WHERE IsDeleted = 0 
         AND (BookingId IN (SELECT BookingId FROM Bookings WHERE MemberId = ?) 
           OR OrderProductId IN (SELECT OrderProductId FROM OrderProduct WHERE MemberId = ?))
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [memberId, memberId, limit, offset]
    );

    // Lấy tổng số payment cho phân trang
    const [[{ total }]] = await db.promise().query(
      `SELECT COUNT(*) as total FROM Payments 
       WHERE IsDeleted = 0 
         AND (BookingId IN (SELECT BookingId FROM Bookings WHERE MemberId = ?) 
           OR OrderProductId IN (SELECT OrderProductId FROM OrderProduct WHERE MemberId = ?))`,
      [memberId, memberId]
    );

    // Lấy chi tiết booking và orderProduct cho từng payment
    const result = [];
    for (const payment of payments) {
      let booking = null, orderProduct = null;
      if (payment.BookingId) {
        booking = await Booking.getBookingDetail(payment.BookingId);
      }
      if (payment.OrderProductId) {
        orderProduct = await OrderProduct.getOrderProductDetail(payment.OrderProductId);
      }
      result.push({
        payment,
        booking,
        orderProduct
      });
    }

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = Payment;