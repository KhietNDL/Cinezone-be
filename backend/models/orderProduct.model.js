const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class OrderProduct {
  static async getAll() {
    const [rows] = await db.promise().query('SELECT * FROM OrderProduct WHERE IsDeleted = 0');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.promise().query('SELECT * FROM OrderProduct WHERE OrderProductId = ? AND IsDeleted = 0', [id]);
    return rows[0];
  }

  static async create({ MemberId, TotalAmount, Status, Notes, CreatedBy }) {
    const OrderProductId = uuidv4();
    await db.promise().query(
      `INSERT INTO OrderProduct (OrderProductId, MemberId, TotalAmount, Status, Notes, IsDeleted, CreatedAt, CreatedBy)
       VALUES (?, ?, ?, ?, ?, 0, NOW(), ?)`,
      [OrderProductId, MemberId, TotalAmount, Status, Notes, CreatedBy]
    );
    return OrderProductId;
  }

  static async update(id, { TotalAmount, Status, Notes, UpdatedBy }) {
    const [result] = await db.promise().query(
      `UPDATE OrderProduct SET TotalAmount=?, Status=?, Notes=?, UpdatedAt=NOW(), UpdatedBy=? WHERE OrderProductId=? AND IsDeleted=0`,
      [TotalAmount, Status, Notes, UpdatedBy, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.promise().query(
      `UPDATE OrderProduct SET IsDeleted=1, DeletedAt=NOW() WHERE OrderProductId=? AND IsDeleted=0`,
      [id]
    );
    return result.affectedRows > 0;
  }

  // Hold: tạo đơn hàng với trạng thái "holding" (ví dụ Status = 0)
  static async holdOrder({ MemberId, products, Notes, CreatedBy }) {
    // products: [{ ProductId, Quantity }]
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();

      // 1. Lấy thông tin sản phẩm và tính tổng tiền
      const productIds = products.map(p => p.ProductId);
      const [productRows] = await connection.query(
        `SELECT ProductId, Price, Unit FROM Products WHERE ProductId IN (?) AND IsDeleted = 0`,
        [productIds]
      );
      if (productRows.length !== products.length) {
        throw new Error("Some products not found");
      }

      let totalAmount = 0;
      const productPriceMap = {};
      const productUnitMap = {};
      productRows.forEach(p => {
        productPriceMap[p.ProductId] = Number(p.Price);
        productUnitMap[p.ProductId] = p.Unit;
      });

      products.forEach(p => {
        if (!productPriceMap[p.ProductId]) throw new Error("Product not found");
        totalAmount += productPriceMap[p.ProductId] * p.Quantity;
      });

      // 3. Tạo OrderProduct (Status = 1: holding)
      const OrderProductId = uuidv4();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
      await connection.query(
        `INSERT INTO OrderProduct (OrderProductId, MemberId, TotalAmount, Status, Notes, IsDeleted, CreatedAt, CreatedBy, ExpiresAt)
         VALUES (?, ?, ?, 1, ?, 0, NOW(), ?, ?)`,
        [OrderProductId, MemberId, totalAmount, Notes, CreatedBy, expiresAt]
      );

      // 4. Tạo OrderProductDetail và trừ tồn kho
      for (const p of products) {
        const OrderProductDetailId = uuidv4();
        const price = productPriceMap[p.ProductId];
        await connection.query(
          `INSERT INTO OrderProductDetail (OrderProductDetailId, OrderProductId, ProductId, Quantity, TotalPrice, IsDeleted, CreatedAt, CreatedBy)
           VALUES (?, ?, ?, ?, ?, 0, NOW(), ?)`,
          [OrderProductDetailId, OrderProductId, p.ProductId, p.Quantity, price * p.Quantity, CreatedBy]
        );

        // Nếu là combo, trừ tồn kho các product con
        if (productUnitMap[p.ProductId] === 'Combo') {
          // Lấy các product con trong combo
          const [comboProducts] = await connection.query(
            `SELECT ProductId, Quantity FROM ComboProduct WHERE ComboId = ? AND IsDeleted = 0`,
            [p.ProductId]
          );
          for (const cp of comboProducts) {
            // Số lượng cần trừ = số lượng combo * số lượng product con trong combo
            const minusQty = p.Quantity * cp.Quantity;
            await connection.query(
              `UPDATE Products SET Quantity = Quantity - ? WHERE ProductId = ? AND Quantity >= ? AND IsDeleted = 0`,
              [minusQty, cp.ProductId, minusQty]
            );
          }
            await connection.query(
              `UPDATE Products SET Quantity = Quantity - ? WHERE ProductId = ? AND Quantity >= ? AND IsDeleted = 0`,
            [p.Quantity, p.ProductId, p.Quantity]
          );
        } else {
          // Nếu không phải combo, trừ tồn kho như bình thường
          await connection.query(
            `UPDATE Products SET Quantity = Quantity - ? WHERE ProductId = ? AND Quantity >= ? AND IsDeleted = 0`,
            [p.Quantity, p.ProductId, p.Quantity]
          );
        }
      }

      await connection.commit();
      return { OrderProductId, totalAmount };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Confirm: chuyển trạng thái sang "confirmed" (ví dụ Status = 1)
  static async confirmOrder(orderProductId) {
    const [result] = await db.promise().query(
      `UPDATE OrderProduct SET Status = 2 WHERE OrderProductId = ? AND Status = 1 AND IsDeleted = 0`,
      [orderProductId]
    );

    // XÓA PHẦN WEBSOCKET NOTIFICATION SAU KHI CONFIRM ORDERPRODUCT
    // const io = global._io;
    // const [[order]] = await db.promise().query(
    //   `SELECT MemberId FROM OrderProduct WHERE OrderProductId = ?`, [orderProductId]
    // );
    // if (io && order && order.MemberId) {
    //   console.log("[BE] Emit notification to:", order.MemberId, orderProductId);
    //   io.to(order.MemberId).emit('notification', {
    //     type: 'orderProduct',
    //     orderProductId,
    //     status: 2,
    //     message: 'Your order has been confirmed!'
    //   });
    // } else {
    //   console.log("[BE] Không emit được notification", io, order);
    // }
    return result.affectedRows > 0;
  }

  // Checkin: chuyển trạng thái sang "checked-in" (ví dụ Status = 2)
  static async checkinOrder(orderProductId) {
    const [result] = await db.promise().query(
      `UPDATE OrderProduct SET Status = 3 WHERE OrderProductId = ? AND Status = 2 AND IsDeleted = 0`,
      [orderProductId]
    );

    // Gửi notification realtime khi checkin
    const io = global._io;
    const [[order]] = await db.promise().query(
      `SELECT MemberId FROM OrderProduct WHERE OrderProductId = ?`, [orderProductId]
    );
    if (io && order && order.MemberId) {
      io.to(order.MemberId).emit('notification', {
        type: 'orderProduct',
        orderProductId,
        status: 3,
        message: 'Your order has been checked in!'
      });
    }
    return result.affectedRows > 0;
  }

  // Cancel: chuyển trạng thái sang "cancelled" (ví dụ Status = 3)
  static async cancelOrder(orderProductId) {
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();

      // 1. Lấy danh sách chi tiết đơn hàng kèm Unit
      const [details] = await connection.query(
        `SELECT d.ProductId, d.Quantity, p.Unit
         FROM OrderProductDetail d
         JOIN Products p ON d.ProductId = p.ProductId
         WHERE d.OrderProductId = ? AND d.IsDeleted = 0`,
        [orderProductId]
      );

      // 2. Tăng lại tồn kho
      for (const detail of details) {
        if (detail.Unit === 'Combo') {
          // Nếu là combo, tăng lại tồn kho cho từng product con
          const [comboProducts] = await connection.query(
            `SELECT ProductId, Quantity FROM ComboProduct WHERE ComboId = ? AND IsDeleted = 0`,
            [detail.ProductId]
          );
          for (const cp of comboProducts) {
            const plusQty = detail.Quantity * cp.Quantity;
            await connection.query(
              `UPDATE Products SET Quantity = Quantity + ? WHERE ProductId = ? AND IsDeleted = 0`,
              [plusQty, cp.ProductId]
            );
          }
          await connection.query(
            `UPDATE Products SET Quantity = Quantity + ? WHERE ProductId = ? AND IsDeleted = 0`,
            [detail.Quantity, detail.ProductId]
          );
        } else {
          // Nếu không phải combo, tăng lại tồn kho như bình thường
          await connection.query(
            `UPDATE Products SET Quantity = Quantity + ? WHERE ProductId = ? AND IsDeleted = 0`,
            [detail.Quantity, detail.ProductId]
          );
        }
      }

      // 3. Xóa mềm các OrderProductDetail liên quan
      await connection.query(
        `DELETE FROM OrderProductDetail WHERE OrderProductId = ? AND IsDeleted = 0`,
        [orderProductId]
      );

      // 4. Cập nhật trạng thái đơn hàng sang cancelled
      const [result] = await connection.query(
        `UPDATE OrderProduct SET Status = 4 WHERE OrderProductId = ? AND Status IN (1,2) AND IsDeleted = 0`,
        [orderProductId]
      );

      await connection.commit();

      // Gửi notification realtime khi cancel
      const io = global._io;
      const [[order]] = await db.promise().query(
        `SELECT MemberId FROM OrderProduct WHERE OrderProductId = ?`, [orderProductId]
      );
      if (io && order && order.MemberId) {
        io.to(order.MemberId).emit('notification', {
          type: 'orderProduct',
          orderProductId,
          status: 4,
          message: 'Your order has been cancelled!'
        });
      }
      return result.affectedRows > 0;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getOrderProductDetail(orderProductId) {
    // Lấy thông tin đơn hàng và người mua
    const [orderRows] = await db.promise().query(
      `SELECT o.OrderProductId, o.MemberId, u.FullName AS buyerName, u.PhoneNumber AS buyerPhone, o.Status
       FROM OrderProduct o
       JOIN Users u ON o.MemberId = u.UserId
       WHERE o.OrderProductId = ? AND o.IsDeleted = 0`,
      [orderProductId]
    );
    if (!orderRows[0]) return null;

    // Lấy chi tiết sản phẩm trong đơn hàng
    const [details] = await db.promise().query(
      `SELECT d.ProductId, p.ProductName, p.Unit, p.Price, d.Quantity, d.TotalPrice
       FROM OrderProductDetail d
       JOIN Products p ON d.ProductId = p.ProductId
       WHERE d.OrderProductId = ? AND d.IsDeleted = 0`,
      [orderProductId]
    );
    return {
      orderProductId: orderRows[0].OrderProductId,
      buyerName: orderRows[0].buyerName,
      buyerPhone: orderRows[0].buyerPhone,
      status: orderRows[0].Status,
      products: details.map(d => ({
        productId: d.ProductId,
        productName: d.ProductName,
        unit: d.Unit,
        price: d.Price,
        quantity: d.Quantity,
        totalPrice: d.TotalPrice
      }))
    };
  }

  static async getOrderProductsByMemberId(memberId, { page = 1, limit = 10, sortBy = "CreatedAt", sortOrder = "desc" } = {}) {
    let sql = `SELECT * FROM OrderProduct WHERE MemberId = ? AND IsDeleted = 0 ORDER BY ${sortBy} ${sortOrder}`;
    let params = [memberId];
    let total = 0;

    if (limit > 0) {
      const [[countRow]] = await db.promise().query(
        `SELECT COUNT(*) as total FROM OrderProduct WHERE MemberId = ? AND IsDeleted = 0`,
        [memberId]
      );
      total = countRow.total;
      const offset = (page - 1) * limit;
      sql += ` LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));
    }

    const [rows] = await db.promise().query(sql, params);
    return { data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}

module.exports = OrderProduct;