const Employee = require("../models/employee.model");
const jwt = require("jsonwebtoken");
const User = require('../models/user.model');
const bucket = require("../config/firebase"); // Thêm dòng này ở đầu file
const { blacklistUserId } = require('../middlewares/auth.middleware');
// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 0;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder;
    const status = req.query.status; // Add status filter

    const result = await Employee.getAllEmployees(page, limit, sortBy, sortOrder, status);

    if (limit > 0 && page > 1 && result.employees.length === 0) {
      return res.status(400).json({
        error: "Page number exceeds available pages"
      });
    }

    if (result.employees.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No employees found",
        data: [],
        pagination: result.pagination
      });
    }

    const filteredEmployees = result.employees.map((emp) => ({
      UserId: emp.UserId,
      FullName: emp.FullName,
      DateOfBirth: emp.DateOfBirth,
      Sex: emp.Sex,
      Email: emp.Email,
      CCCD: emp.CCCD,
      Address: emp.Address,
      PhoneNumber: emp.PhoneNumber,
      CreatedAt: emp.CreatedAt,
      avatar_url: emp.avatar_url,
      isDeleted: emp.IsDeleted // Thêm trường isDeleted
    }));

    res.status(200).json({
      status: "success",
      data: filteredEmployees,
      pagination: result.pagination
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
      avatar_url: emp.avatar_url // thêm dòng này
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
      avatar_url: employee.avatar_url // thêm dòng này
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
      avatar_url: employee.avatar_url // thêm dòng này
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
    // Check if user already exists
    const existingUser = await User.findByEmail(employeeData.Email);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'Employee with this email already exists'
            });
        }
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
        PhoneNumber: employee.PhoneNumber
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
      blacklistUserId(userId); // Force logout for deleted employee
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
    // Lấy thông tin employee hiện tại để xác định avatar cũ
    const existingEmployee = await Employee.getEmployeeById(userId);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Xử lý upload avatar nếu có file gửi lên
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      try {
        // Xóa avatar cũ trên Firebase nếu có
        if (existingEmployee.avatar_url) {
          try {
            const fileNameMatch = existingEmployee.avatar_url.match(/firebasestorage\.app\/([^?]+)/);
            if (fileNameMatch && fileNameMatch[1]) {
              const oldFilePath = fileNameMatch[1];
              await bucket.file(oldFilePath).delete().catch(() => {});
            }
          } catch (error) {
            console.log("Error deleting old avatar:", error);
          }
        }

        // Upload avatar mới lên Firebase
        const avatarFile = req.files.avatar[0];
        const avatarFileName = `avatars/${Date.now()}-${avatarFile.originalname.replace(/\s+/g, "_")}`;
        const avatarBlob = bucket.file(avatarFileName);

        const avatarStream = avatarBlob.createWriteStream({
          metadata: { contentType: avatarFile.mimetype },
        });

        await new Promise((resolve, reject) => {
          avatarStream.on("error", reject);
          avatarStream.on("finish", resolve);
          avatarStream.end(avatarFile.buffer);
        });

        const [avatarUrl] = await avatarBlob.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });

        employeeData.avatar_url = avatarUrl;
      } catch (firebaseError) {
        console.error("Firebase operation failed:", firebaseError);
        return res.status(500).json({
          error: "Firebase operation failed during profile update",
        });
      }
    }

    // Xóa trường avatar nếu có (tránh lưu buffer vào DB)
    delete employeeData.avatar;

    // Cập nhật employee
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

// Find employees by information
const findEmployeesByInfo = async (req, res) => {
  const { email, cccd, phone, name, page = 1, limit = 0, sortBy = 'FullName', sortOrder = 'asc' } = req.query;
  try {
    const result = await Employee.findEmployeesByInfo({ email, cccd, phone, name }, parseInt(page), parseInt(limit), sortBy, sortOrder);

    const filteredEmployees = result.employees.map((emp) => ({
      UserId: emp.UserId,
      FullName: emp.FullName,
      DateOfBirth: emp.DateOfBirth,
      Sex: emp.Sex,
      Email: emp.Email,
      PhoneNumber: emp.PhoneNumber,
      Address: emp.Address,
      CCCD: emp.CCCD,
      avatar_url: emp.avatar_url,
      CreatedAt: emp.CreatedAt,
      isDeleted: emp.IsDeleted
    }));

    res.status(200).json({
      message: "Employees found",
      employees: filteredEmployees,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unban employee
const unbanEmployee = async (req, res) => {
  const { userId } = req.params;
  const updatedBy = req.user ? req.user.UserId : null;
  try {
    const result = await Employee.unbanEmployee(userId, updatedBy);
    if (result) {
      res.status(200).json({ message: "Employee unbanned successfully" });
    } else {
      res.status(404).json({ message: "Employee not found or not banned" });
    }
  } catch (error) {
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
  findEmployeesByInfo,
  unbanEmployee,
};
