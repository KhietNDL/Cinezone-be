const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Product {
  static async getAllProducts(page = 1, limit = 0, sortBy = "ProductName", sortOrder = "asc", status = null) {
    const allowedSortFields = ["ProductName", "Price", "Quantity", "CreatedAt"];
    if (!allowedSortFields.includes(sortBy)) sortBy = "ProductName";
    sortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    let whereClause = 'WHERE IsDeleted = 0';
    let countWhereClause = 'WHERE IsDeleted = 0';
    
    // Add status filter if provided
    if (status) {
      switch (status.toLowerCase()) {
        case 'in_stock':
          whereClause += ' AND Quantity > 10';
          countWhereClause += ' AND Quantity > 10';
          break;
        case 'low_stock':
          whereClause += ' AND Quantity > 0 AND Quantity <= 10';
          countWhereClause += ' AND Quantity > 0 AND Quantity <= 10';
          break;
        case 'out_of_stock':
          whereClause += ' AND Quantity = 0';
          countWhereClause += ' AND Quantity = 0';
          break;
      }
    }

    let productsQuery = `SELECT * FROM Products ${whereClause} ORDER BY ${sortBy} ${sortOrder}`;
    let productsParams = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      productsQuery += " LIMIT ? OFFSET ?";
      productsParams = [limit, offset];
    }
    const [products] = await db.promise().query(productsQuery, productsParams);

    let totalProducts = products.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query(
        `SELECT COUNT(*) as total FROM Products ${countWhereClause}`
      );
      totalProducts = countResult[0].total;
    }

    return {
      products,
      pagination: {
        total: totalProducts,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalProducts / limit) : 1,
        limit: limit > 0 ? limit : products.length,
      },
    };
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
      Quantity,
      CreatedBy,
      ImageUrl,
    } = data;
    const ProductId = uuidv4();
    const CreatedAt = new Date();
    await db.promise().query(
      `INSERT INTO Products (ProductId, ProductName, Description, Unit, Price, Quantity, IsDeleted, CreatedAt, CreatedBy, ImageUrl)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
      [
        ProductId,
        ProductName,
        Description,
        Unit,
        Price,
        Quantity,
        CreatedAt,
        CreatedBy,
        ImageUrl,
      ]
    );
    return ProductId;
  }

  static async updateProduct(productId, data) {
    const {
      ProductName,
      Description,
      Unit,
      Price,
      Quantity,
      UpdatedBy,
      ImageUrl,
    } = data;
    const UpdatedAt = new Date();
    const [result] = await db.promise().query(
      `UPDATE Products SET ProductName=?, Description=?, Unit=?, Price=?, Quantity=?, UpdatedAt=?, UpdatedBy=?, ImageUrl=?
       WHERE ProductId=? AND IsDeleted=0`,
      [
        ProductName,
        Description,
        Unit,
        Price,
        Quantity,
        UpdatedAt,
        UpdatedBy,
        ImageUrl,
        productId,
      ]
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

  static async getComboChildren(productId) {
    // Kiểm tra product có phải combo không
    const [comboRows] = await db.promise().query(
      "SELECT * FROM Products WHERE ProductId = ? AND Unit = 'combo' AND IsDeleted = 0",
      [productId]
    );
    if (!comboRows.length) return null;

    // Lấy các product con của combo
    const [children] = await db.promise().query(
      `SELECT cp.ComboProductId, cp.Quantity, p.ProductId, p.ProductName, p.Description, p.Unit, p.Price, p.ImageUrl
       FROM ComboProduct cp
       JOIN Products p ON cp.ProductId = p.ProductId
       WHERE cp.ComboId = ? AND cp.IsDeleted = 0`,
      [productId]
    );
    return {
      combo: comboRows[0],
      children
    };
  }

  static async searchProductsByName(name, page = 1, limit = 10, sortBy = "ProductName", sortOrder = "asc") {
    const allowedSortFields = ["ProductName", "Price", "Quantity", "CreatedAt"];
    if (!allowedSortFields.includes(sortBy)) sortBy = "ProductName";
    sortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    let productsQuery = `SELECT * FROM Products WHERE IsDeleted = 0 AND ProductName LIKE ? ORDER BY ${sortBy} ${sortOrder}`;
    let productsParams = [`%${name}%`];
    let totalProducts = 0;

    if (limit > 0) {
      const offset = (page - 1) * limit;
      productsQuery += " LIMIT ? OFFSET ?";
      productsParams.push(limit, offset);
    }
    const [products] = await db.promise().query(productsQuery, productsParams);


    if (limit > 0) {
      const [countResult] = await db.promise().query(
        "SELECT COUNT(*) as total FROM Products WHERE IsDeleted = 0 AND ProductName LIKE ?",
        [`%${name}%`]
      );
      totalProducts = countResult[0].total;
      console.log('[searchProductsByName] Total products:', totalProducts);
    } else {
      totalProducts = products.length;
    }

    return {
      products,
      pagination: {
        total: totalProducts,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalProducts / limit) : 1,
        limit: limit > 0 ? limit : products.length,
      },
    };
  }
}

module.exports = Product;