const db = require('../config/database');

async function cleanupExpiredOrderProducts() {
  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // 1. Tìm các đơn hàng hết hạn (Status = 1: holding, ExpiresAt < NOW())
    const [expired] = await connection.query(
      `SELECT OrderProductId FROM OrderProduct WHERE Status = 1 AND ExpiresAt < NOW() AND IsDeleted = 0`
    );
    if (expired.length === 0) {
      await connection.commit();
      return;
    }
    const expiredIds = expired.map(o => o.OrderProductId);

    // 2. Đổi trạng thái đơn hàng sang "cancelled"
    await connection.query(
      `UPDATE OrderProduct SET Status = 4 WHERE OrderProductId IN (?)`,
      [expiredIds]
    );

    // 3. (Nếu cần) hoàn lại tồn kho cho các sản phẩm trong đơn hàng này
    // Có thể gọi lại logic trong OrderProduct.cancelOrder cho từng đơn

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.error('OrderProduct cleanup error:', err);
  } finally {
    connection.release();
  }
}

module.exports = cleanupExpiredOrderProducts;