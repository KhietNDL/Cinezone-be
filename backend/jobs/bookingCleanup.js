const db = require('../config/database');

async function cleanupExpiredBookings() {
  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // 1. Tìm các booking hết hạn (pending và expiresAt < NOW())
    const [expired] = await connection.query(
      `SELECT BookingId FROM Bookings WHERE Status = 1 AND ExpiresAt < NOW()`
    );
    if (expired.length === 0) {
      await connection.commit();
      return;
    }
    const expiredIds = expired.map(b => b.BookingId);

    // 2. Đổi trạng thái booking sang "cancelled"
    await connection.query(
      `UPDATE Bookings SET Status = 4 WHERE BookingId IN (?)`,
      [expiredIds]
    );

    // 3. Đổi trạng thái các ghế từ "holding" sang "available" (xóa hoặc cập nhật SeatShowtime)
    await connection.query(
      `DELETE FROM SeatShowtime WHERE BookingId IN (?) AND Status = 'holding'`,
      [expiredIds]
    );

    await connection.commit();
    console.log(`Cleaned up ${expiredIds.length} expired bookings`);
  } catch (err) {
    await connection.rollback();
    console.error('Cleanup error:', err);
  } finally {
    connection.release();
  }
}

module.exports = cleanupExpiredBookings;