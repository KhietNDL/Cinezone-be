const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PaymentMethod {
  static async getAllMethods() {
    const [rows] = await db.promise().query(
      "SELECT * FROM PaymentMethod WHERE IsActive = 1"
    );
    return rows;
  }

  static async getMethodById(methodId) {
    const [rows] = await db.promise().query(
      "SELECT * FROM PaymentMethod WHERE MethodId = ?",
      [methodId]
    );
    return rows[0];
  }
  
  static async createMethod(data) {
    const methodId = uuidv4();
    const { Name, Type } = data;
    
    const [result] = await db.promise().query(
      "INSERT INTO PaymentMethod (MethodId, Name, Type, IsActive, CreatedAt) VALUES (?, ?, ?, 1, NOW())",
      [methodId, Name, Type]
    );
    
    return methodId;
  }
  
  static async findByName(name) {
    const [rows] = await db.promise().query(
      "SELECT * FROM PaymentMethod WHERE Name = ? AND IsActive = 1",
      [name]
    );
    return rows[0];
  }
  
  static async findByType(type) {
    const [rows] = await db.promise().query(
      "SELECT * FROM PaymentMethod WHERE Type = ? AND IsActive = 1",
      [type]
    );
    return rows[0];
  }
}

module.exports = PaymentMethod;