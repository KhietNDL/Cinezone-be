const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Payment {
  static async createPayment(paymentData) {
    const paymentId = uuidv4();
    const {
      Amount, 
      Provider, 
      PaymentReference,
      Status,
      BookingId,
      ProductId,
      MethodId,
      CreatedBy
    } = paymentData;
    
    const [result] = await db.promise().query(
      "INSERT INTO Payments (PaymentId, PaymentDate, Amount, Provider, PaymentReference, Status, IsDeleted, CreatedAt, CreatedBy, BookingId, ProductId, MethodId) VALUES (?, NOW(), ?, ?, ?, ?, 0, NOW(), ?, ?, ?, ?)",
      [paymentId, Amount, Provider, PaymentReference, Status, CreatedBy, BookingId, ProductId, MethodId]
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
}

module.exports = Payment;