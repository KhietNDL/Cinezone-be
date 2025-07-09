const UserManagement = require("../models/user.management.model");
const jwt = require("jsonwebtoken");
const bucket = require("../config/firebase"); // Nếu dùng Firebase

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 0;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder;

    const result = await UserManagement.getAllUsers(page, limit, sortBy, sortOrder);

    res.status(200).json({
      message: "Users retrieved successfully",
      users: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get users by name
const getUsersbyName = async (req, res) => {
  const { name } = req.query;
  try {
    const users = await UserManagement.getUsersbyName(name);
    // Chỉ lấy các trường cần thiết
    const filteredUsers = users.map((user) => ({
      UserId: user.UserId,
      FullName: user.FullName,
      DateOfBirth: user.DateOfBirth,
      Sex: user.Sex,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Address: user.Address,
      CCCD: user.CCCD,
      avatar_url: user.avatar_url,
      ScoreBalance: user.ScoreBalance,
      CreatedAt: user.CreatedAt,
    }));
    res.status(200).json({
      message: "Users retrieved successfully",
      users: filteredUsers,
    });
  } catch (error) {
    console.error("Get users by name error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    console.log('Searching for user with ID:', userId);
    const user = await UserManagement.getUserById(userId);
    if (!user) {
      console.log('No user found with ID:', userId);
      return res.status(404).json({ message: "User not found" });
    }
    console.log('Found user:', user);

    // Chỉ lấy các trường cần thiết
    const filteredUser = {
      UserId: user.UserId,
      FullName: user.FullName,
      DateOfBirth: user.DateOfBirth,
      Sex: user.Sex,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Address: user.Address,
      CCCD: user.CCCD,
      avatar_url: user.avatar_url,
      ScoreBalance: user.ScoreBalance,
      CreatedAt: user.CreatedAt,
    };
    res.status(200).json({
      message: "User retrieved successfully",
      user: filteredUser,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user by email
const getUserByEmail = async (req, res) => {
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
    const user = await UserManagement.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Chỉ lấy các trường cần thiết
    const filteredUser = {
      UserId: user.UserId,
      FullName: user.FullName,
      DateOfBirth: user.DateOfBirth,
      Sex: user.Sex,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Address: user.Address,
      CCCD: user.CCCD,
      avatar_url: user.avatar_url,
      ScoreBalance: user.ScoreBalance,
      CreatedAt: user.CreatedAt,
    };
    res.status(200).json({
      message: "User retrieved successfully",
      user: filteredUser,
    });
  } catch (error) {
    console.error("Get user by email error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    // Xử lý upload avatar nếu có file gửi lên
    if (req.file) {
      // Nếu dùng Firebase:
      const avatarFile = req.file;
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

      req.body.avatar_url = avatarUrl;
    }

    const userData = req.body;
    const newUserId = await UserManagement.createUser(userData);
    const user = await UserManagement.getUserById(newUserId);
    const token = jwt.sign({ userId: user.UserId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      message: "User created successfully",
      userId: newUserId,
      token,
      user: {
        UserId: user.UserId,
        FullName: user.FullName,
        DateOfBirth: user.DateOfBirth,
        Sex: user.Sex,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        Address: user.Address,
        CCCD: user.CCCD,
        avatar_url: user.avatar_url,
        CreatedAt: user.CreatedAt,
      }
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await UserManagement.deleteUser(userId);
    if (result) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found or already deleted" });
    }
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const existingUser = await UserManagement.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xử lý upload avatar nếu có file gửi lên
    if (req.file) {
      // Xóa avatar cũ trên Firebase nếu có
      if (existingUser.avatar_url) {
        try {
          const fileNameMatch = existingUser.avatar_url.match(/firebasestorage\.app\/([^?]+)/);
          if (fileNameMatch && fileNameMatch[1]) {
            const oldFilePath = fileNameMatch[1];
            await bucket.file(oldFilePath).delete().catch(() => {});
          }
        } catch (error) {
          console.log("Error deleting old avatar:", error);
        }
      }

      // Upload avatar mới lên Firebase
      const avatarFile = req.file;
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

      userData.avatar_url = avatarUrl;
    }

    // Xóa trường avatar nếu có (tránh lưu buffer vào DB)
    delete userData.avatar;

    // Lọc bỏ trường rỗng
    Object.keys(userData).forEach(key => {
      if (userData[key] === "" || userData[key] === undefined) {
        delete userData[key];
      }
    });

    const result = await UserManagement.updateUser(userId, userData);
    if (result) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found or update failed" });
    }
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user by CCCD
const getUserByCCCD = async (req, res) => {
  const { cccd } = req.params;
  try {
    const user = await UserManagement.getUserByCCCD(cccd);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const filteredUser = {
      UserId: user.UserId,
      FullName: user.FullName,
      DateOfBirth: user.DateOfBirth,
      Sex: user.Sex,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Address: user.Address,
      CCCD: user.CCCD,
      avatar_url: user.avatar_url,
      ScoreBalance: user.ScoreBalance,
      CreatedAt: user.CreatedAt,
    };
    res.status(200).json({
      message: "User retrieved successfully",
      user: filteredUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by Phone Number
const getUserByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.params;
  try {
    const user = await UserManagement.getUserByPhoneNumber(phoneNumber);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const filteredUser = {
      UserId: user.UserId,
      FullName: user.FullName,
      DateOfBirth: user.DateOfBirth,
      Sex: user.Sex,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Address: user.Address,
      CCCD: user.CCCD,
      avatar_url: user.avatar_url,
      ScoreBalance: user.ScoreBalance,
      CreatedAt: user.CreatedAt,
    };
    res.status(200).json({
      message: "User retrieved successfully",
      user: filteredUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUsersbyName,
  getUserById,
  getUserByEmail,
  createUser,
  deleteUser,
  updateUser,
  getUserByCCCD,
  getUserByPhoneNumber,
};
