const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class OrderProductDetail {
  static async getAll() {
    const [rows] = await db.promise().query('SELECT * FROM OrderProductDetail WHERE IsDeleted = 0');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.promise().query('SELECT * FROM OrderProductDetail WHERE OrderProductDetailId = ? AND IsDeleted = 0', [id]);
    return rows[0];
  }

  static async create({ OrderProductId, ProductId, Quantity, TotalPrice, Notes, CreatedBy }) {
    const OrderProductDetailId = uuidv4();
    await db.promise().query(
      `INSERT INTO OrderProductDetail (OrderProductDetailId, OrderProductId, ProductId, Quantity, TotalPrice, Notes, IsDeleted, CreatedAt, CreatedBy)
       VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), ?)`,
      [OrderProductDetailId, OrderProductId, ProductId, Quantity, TotalPrice, Notes, CreatedBy]
    );
    return OrderProductDetailId;
  }

  static async update(id, { Quantity, TotalPrice, Notes, UpdatedBy }) {
    const [result] = await db.promise().query(
      `UPDATE OrderProductDetail SET Quantity=?, TotalPrice=?, Notes=?, UpdatedAt=NOW(), UpdatedBy=? WHERE OrderProductDetailId=? AND IsDeleted=0`,
      [Quantity, TotalPrice, Notes, UpdatedBy, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.promise().query(
      `UPDATE OrderProductDetail SET IsDeleted=1, DeletedAt=NOW() WHERE OrderProductDetailId=? AND IsDeleted=0`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = OrderProductDetail;