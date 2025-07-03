const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ComboProduct {
  static async getAll() {
    const [rows] = await db.promise().query('SELECT * FROM ComboProduct WHERE IsDeleted = 0');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.promise().query('SELECT * FROM ComboProduct WHERE ComboProductId = ? AND IsDeleted = 0', [id]);
    return rows[0];
  }

  static async create({ ComboId, ProductId, Quantity }) {
    const ComboProductId = uuidv4();
    await db.promise().query(
      `INSERT INTO ComboProduct (ComboProductId, ComboId, ProductId, Quantity, IsDeleted, CreatedAt)
       VALUES (?, ?, ?, ?, 0, NOW())`,
      [ComboProductId, ComboId, ProductId, Quantity]
    );
    return ComboProductId;
  }

  static async update(id, { Quantity, UpdatedBy }) {
    const [result] = await db.promise().query(
      `UPDATE ComboProduct SET Quantity=?, UpdatedAt=NOW(), UpdatedBy=? WHERE ComboProductId=? AND IsDeleted=0`,
      [Quantity, UpdatedBy, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.promise().query(
      `UPDATE ComboProduct SET IsDeleted=1, DeletedAt=NOW() WHERE ComboProductId=? AND IsDeleted=0`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ComboProduct;