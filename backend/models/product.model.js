const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Product {
  static async getAllProducts() {
    const [rows] = await db.promise().query(
      "SELECT * FROM Products WHERE IsDeleted = 0"
    );
    return rows;
  }

  static async getProductById(productId) {
    const [rows] = await db.promise().query(
      "SELECT * FROM Products WHERE ProductId = ? AND IsDeleted = 0",
      [productId]
    );
    return rows[0];
  }

  static async createProduct(data) {
    const {
      ProductName,
      Description,
      Unit,
      Price,
      CreatedBy,
    } = data;
    const ProductId = uuidv4();
    const CreatedAt = new Date();
    await db.promise().query(
      `INSERT INTO Products (ProductId, ProductName, Description, Unit, Price, IsDeleted, CreatedAt, CreatedBy)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
      [ProductId, ProductName, Description, Unit, Price, CreatedAt, CreatedBy]
    );
    return ProductId;
  }

  static async updateProduct(productId, data) {
    const {
      ProductName,
      Description,
      Unit,
      Price,
      UpdatedBy,
    } = data;
    const UpdatedAt = new Date();
    const [result] = await db.promise().query(
      `UPDATE Products SET ProductName=?, Description=?, Unit=?, Price=?, UpdatedAt=?, UpdatedBy=?
       WHERE ProductId=? AND IsDeleted=0`,
      [ProductName, Description, Unit, Price, UpdatedAt, UpdatedBy, productId]
    );
    return result.affectedRows > 0;
  }

  static async deleteProduct(productId, deletedBy) {
    const DeletedAt = new Date();
    const [result] = await db.promise().query(
      `UPDATE Products SET IsDeleted=1, DeletedAt=?, DeletedBy=? WHERE ProductId=? AND IsDeleted=0`,
      [DeletedAt, deletedBy, productId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Product;