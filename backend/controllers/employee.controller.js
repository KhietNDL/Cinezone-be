const Employee = require("../models/employee.model");
const jwt = require("jsonwebtoken");
// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.getAllEmployees();
    // Chỉ lấy các trường cần thiết
    const filteredEmployees = employees.map((emp) => ({
      UserId: emp.UserId,
      FullName: emp.FullName,
      DateOfBirth: emp.DateOfBirth,
      Sex: emp.Sex,
      Email: emp.Email,
      CCCD: emp.CCCD,
      Address: emp.Address,
      PhoneNumber: emp.PhoneNumber,
      CreatedAt: emp.CreatedAt,
    }));
    res.status(200).json({
      message: "Employees retrieved successfully",
      employees: filteredEmployees,
    });
  } catch (error) {
    console.error("Get all employees error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get employees by name
const getEmployeesbyName = async (req, res) => {
  const { name } = req.query;
  try {
    const employees = await Employee.getEmployeesbyName(name);
    // Chỉ lấy các trường cần thiết
    const filteredEmployees = employees.map((emp) => ({
      UserId: emp.UserId,
      FullName: emp.FullName,
      DateOfBirth: emp.DateOfBirth,
      Sex: emp.Sex,
      Email: emp.Email,
      CCCD: emp.CCCD,
      Address: emp.Address,
      PhoneNumber: emp.PhoneNumber,
      CreatedAt: emp.CreatedAt,
    }));
    res.status(200).json({
      message: "Employees retrieved successfully",
      employees: filteredEmployees,
    });
  } catch (error) {
    console.error("Get employees by name error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get employee by ID
const getEmployeeById = async (req, res) => {
  const { userId } = req.params; 
  try {
    const employee = await Employee.getEmployeeById(userId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    // Chỉ lấy các trường cần thiết
    const filteredEmployee = {
      UserId: employee.UserId,
      FullName: employee.FullName,
      DateOfBirth: employee.DateOfBirth,
      Sex: employee.Sex,
      Email: employee.Email,
      CCCD: employee.CCCD,
      Address: employee.Address,
      PhoneNumber: employee.PhoneNumber,
      CreatedAt: employee.CreatedAt,
    };
    res.status(200).json({
      message: "Employee retrieved successfully",
      employee: filteredEmployee,
    });
  } catch (error) {
    console.error("Get employee by ID error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get employee by email
const getEmployeeByEmail = async (req, res) => {
  // Kiểm tra từng thuộc tính trước khi truy cập .email
  const email =
    (req && req.query && req.query.email) ||
    (req && req.body && req.body.email) ||
    (req && req.params && req.params.email);
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required in query, body, or params" });
  }
  try {
    const employee = await Employee.getEmployeeByEmail(email);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    // Chỉ lấy các trường cần thiết
    const filteredEmployee = {
      UserId: employee.UserId,
      FullName: employee.FullName,
      DateOfBirth: employee.DateOfBirth,
      Sex: employee.Sex,
      Email: employee.Email,
      CCCD: employee.CCCD,
      Address: employee.Address,
      PhoneNumber: employee.PhoneNumber,
      CreatedAt: employee.CreatedAt,
    };
    res.status(200).json({
      message: "Employee retrieved successfully",
      employee: filteredEmployee,
    });
  } catch (error) {
    console.error("Get employee by email error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Create employee
const createEmployee = async (req, res) => {
  const employeeData = req.body;
  try {
    const newEmployeeId = await Employee.createEmployee(employeeData);
    // Lấy thông tin nhân viên vừa tạo
    const employee = await Employee.getEmployeeById(newEmployeeId);
    // Tạo JWT token cho nhân viên mới
    const token = jwt.sign({ userId: employee.UserId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      message: "Employee created successfully",
      employeeId: newEmployeeId,
      token,
      employee: {
        UserId: employee.UserId,
        FullName: employee.FullName,
        DateOfBirth: employee.DateOfBirth,
        Sex: employee.Sex,
        Email: employee.Email,
        CCCD: employee.CCCD,
        Address: employee.Address,
        PhoneNumber: employee.PhoneNumber,
        CreatedAt: employee.CreatedAt,
      }
    });
  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Delete employee

const deleteEmployee = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await Employee.deleteEmployee(userId);
    if (result) {
      res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: "Employee not found or already deleted" });
    }
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  const { userId } = req.params;
  const employeeData = req.body;
  try {
    const result = await Employee.updateEmployee(userId, employeeData);
    if (result) {
      res.status(200).json({ message: "Employee updated successfully" });
    } else {
      res.status(404).json({ message: "Employee not found or update failed" });
    }
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the controller functions
module.exports = {
  getAllEmployees,
  getEmployeesbyName,
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  deleteEmployee,
  updateEmployee,
};
