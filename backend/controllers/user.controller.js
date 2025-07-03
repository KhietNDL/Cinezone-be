const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const bucket = require("../config/firebase");
const ScoreHistory = require("../models/scorehistory.model");

// Define error codes
const ERROR_CODES = {
  USER_EXISTS: "AUTH_001",
  INVALID_CREDENTIALS: "AUTH_002",
  ACCOUNT_LOCKED: "AUTH_003",
  USER_NOT_FOUND: "AUTH_004",
  INVALID_RESET_CODE: "AUTH_005",
  INVALID_UUID: "AUTH_006",
  FORBIDDEN: "AUTH_007",
  SERVER_ERROR: "AUTH_008",
  PLEASE_VERIFY_OTP: "AUTH_009",
};

// Helper function to remove sensitive data from user object
const removeSensitiveData = (user) => {
  return {
    userId: user.UserId,
    fullName: user.FullName,
    email: user.Email,
    phoneNumber: user.PhoneNumber,
    dateOfBirth: user.DateOfBirth,
    sex: user.Sex,
    cccd: user.CCCD,
    address: user.Address,
    avatar_url: user.avatar_url,
    scoreBalance: user.ScoreBalance,
  };
};

// Register new user
const register = async (req, res) => {
  try {
    const { password, fullName, dateOfBirth, sex, email, phoneNumber, cccd } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists",
        code: ERROR_CODES.USER_EXISTS,
      });
    }

    // Create new user
    const userId = await User.create({
      password,
      fullName,
      dateOfBirth,
      sex,
      email,
      phoneNumber,
      cccd,
    });

    // Get the created user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(500).json({
        error: "Failed to create user",
        code: ERROR_CODES.SERVER_ERROR,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.UserId, role: user.Role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: removeSensitiveData(user),
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      error: "Internal server error during registration",
      code: ERROR_CODES.SERVER_ERROR,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    // Check if user is active
    if (user.IsDeleted) {
      return res.status(401).json({
        error: "Account is locked",
        code: ERROR_CODES.ACCOUNT_LOCKED,
      });
    }

    // Verify password
    const isMatch = await User.comparePassword(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.UserId, role: user.Role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      message: "Login successful",
      user: removeSensitiveData(user),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error during login",
      code: ERROR_CODES.SERVER_ERROR,
    });
  }
};

// Forgot password - Step 1: Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user with reset code and set expiry time (15 minutes)
    await User.updateResetCode(email, resetCode);

    // Store email in session for OTP verification
    req.session.reset = {
      email: user.Email,
      verified: false,
    };

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send reset code email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Password Reset Code</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Arial, sans-serif;
                            background: #181829;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 480px;
                            margin: 40px auto;
                            background: #232347;
                            border-radius: 18px;
                            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                            padding: 32px 24px 24px 24px;
                            color: #fff;
                        }
                        .logo {
                            display: flex;
                            justify-content: center;
                            margin-bottom: 24px;
                        }
                        .logo img {
                            width: 90px;
                            height: auto;
                        }
                        .header {
                            text-align: center;
                            font-size: 1.6rem;
                            font-weight: bold;
                            margin-bottom: 12px;
                            color: #a18aff;
                            letter-spacing: 1px;
                        }
                        .content {
                            text-align: center;
                            margin-bottom: 24px;
                        }
                        .code {
                            font-size: 2.2rem;
                            font-weight: bold;
                            color: #a18aff;
                            letter-spacing: 8px;
                            background: #fff;
                            color: #232347;
                            border-radius: 8px;
                            padding: 18px 0;
                            margin: 24px 0;
                            box-shadow: 0 2px 8px rgba(161, 138, 255, 0.15);
                        }
                        .footer {
                            text-align: center;
                            font-size: 0.95rem;
                            color: #bdbdbd;
                            margin-top: 32px;
                        }
                        .warning {
                            color: #ff6b6b;
                            font-size: 1rem;
                            margin-top: 18px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s" alt="CineZone Logo" />
                        </div>
                        <div class="header">Password Reset Code</div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>We received a request to reset your password. Please use the following code to reset your password:</p>
                            <div class="code">${resetCode}</div>
                            <p>This code will expire in 15 minutes.</p>
                            <p class="warning">If you did not request this code, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    res.json({
      message: "Reset code sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      error: "Internal server error during password reset request",
      code: ERROR_CODES.SERVER_ERROR,
    });
  }
};

// Verify reset code - Step 2
const verifyOtp = async (req, res) => {
  try {
    const { resetCode } = req.body;
    const sessionData = req.session.reset;

    // Check if session data exists
    if (!sessionData || !sessionData.email) {
      return res.status(400).json({
        error: "Session expired or invalid. Please request a new reset code.",
        code: ERROR_CODES.INVALID_RESET_CODE,
      });
    }

    const { email } = sessionData;

    // Find user by email
    const user = await User.findByEmail(email);
    if (
      !user ||
      !user.reset_code ||
      user.reset_code !== resetCode ||
      new Date() > new Date(user.reset_code_expires)
    ) {
      return res.status(400).json({
        error: "Invalid or expired reset code",
        code: ERROR_CODES.INVALID_RESET_CODE,
      });
    }

    // save session data
    req.session.reset = {
      email: user.Email,
      verified: true,
    };

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      error: "Internal server error during OTP verification",
      code: ERROR_CODES.SERVER_ERROR,
    });
  }
};

// Reset password - Step 3: Set new password
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const sessionData = req.session.reset;

    // Check if OTP was verified
    if (!sessionData || !sessionData.verified) {
      return res.status(400).json({
        error: "Please verify OTP first",
        code: ERROR_CODES.PLEASE_VERIFY_OTP,
      });
    }

    const { email } = sessionData;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Update password
    const userId = user.UserId;
    await User.updatePassword(userId, newPassword);

    // Destroy the session after successful password reset
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
        return res.status(500).json({
          error: "Could not log out, please try again",
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
      res.status(200).json({ message: "Password has been reset successfully" });
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      error: "Internal server error during password reset",
      code: ERROR_CODES.SERVER_ERROR,
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Clear auth cookie if exists
    res.clearCookie("token");

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Internal server error during logout",
      code: ERROR_CODES.SERVER_ERROR,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    delete updates.avatar;

    // Lấy thông tin người dùng hiện tại để xác định avatar cũ
    const existingUserEdit = await User.findById(userId);
    if (!existingUserEdit) {
      return res.status(404).json({
        error: "User not found",
        code: ERROR_CODES.USER_NOT_FOUND,
      });
    }

    if (req.files && req.files.avatar && req.files.avatar[0]) {
      try {
        if (existingUserEdit.avatar_url) {
          try {
            console.log("Avatar URL hiện tại:", existingUserEdit.avatar_url);

            const fileNameMatch = existingUserEdit.avatar_url.match(
              /firebasestorage\.app\/([^?]+)/
            );
            if (fileNameMatch && fileNameMatch[1]) {
              const oldFilePath = fileNameMatch[1];
              console.log("Extracted path using regex:", oldFilePath);

              if (oldFilePath) {
                console.log("Attempting to delete old avatar:", oldFilePath);

                try {
                  await bucket.file(oldFilePath).delete();
                  console.log("Successfully deleted old avatar");
                } catch (deleteError) {
                  console.log(
                    "Failed to delete old avatar:",
                    deleteError.message
                  );
                }
              }
            } else {
              console.log("Could not extract file path from URL using regex");
            }
          } catch (error) {
            console.log("Error processing old avatar URL:", error);
          }
        }

        const avatarFile = req.files.avatar[0];
        const avatarFileName = `avatars/${Date.now()}-${avatarFile.originalname.replace(
          /\s+/g,
          "_"
        )}`;
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

        updates.avatar_url = avatarUrl;
      } catch (firebaseError) {
        console.error("Firebase operation failed:", firebaseError);
        return res.status(500).json({
          error: "Firebase operation failed during profile update",
          code: "AUTH_008",
        });
      }
    }

    const allowedUpdates = [
      "fullName",
      "password",
      "dateOfBirth",
      "phoneNumber",
      "sex",
      "email",
      "cccd",
      "address",
      "avatar_url",
    ];

    // Filter out empty values
    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (
        updates[key] !== undefined &&
        updates[key] !== null &&
        updates[key] !== ""
      ) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Validate update data
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        error: "No valid updates provided",
        code: ERROR_CODES.SERVER_ERROR,
      });
    }

    // Check if all update fields are allowed
    const updatesKeys = Object.keys(filteredUpdates);
    const isValidOperation = updatesKeys.every((key) =>
      allowedUpdates.includes(key)
    );
    if (!isValidOperation) {
      return res.status(400).json({
        error: "Invalid update fields",
        code: ERROR_CODES.SERVER_ERROR,
      });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
        code: ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Hash password if being updated
    if (filteredUpdates.password) {
      const salt = await bcrypt.genSalt(10);
      filteredUpdates.password = await bcrypt.hash(
        filteredUpdates.password,
        salt
      );
    }

    // Update user
    const success = await User.update(userId, filteredUpdates);
    if (!success) {
      return res.status(404).json({
        error: "User not found",
        code: ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Get updated user data
    const updatedUser = await User.findById(userId);

    res.json({
      message: "Profile updated successfully",
      user: removeSensitiveData(updatedUser),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      error: "Internal server error during profile update",
      code: ERROR_CODES.SERVER_ERROR,
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;


    // Check view permissions
    if (req.user.Role !== "admin" && req.user.Role !== 1 && req.user.UserId !== id) {
      return res.status(403).json({
        error: "Forbidden: You can only view your own information",
        code: ERROR_CODES.FORBIDDEN,
      });
    }

    // Validate UUID format
    if (!uuidValidate(id)) {
      return res.status(400).json({
        error: "Invalid UUID format",
        code: ERROR_CODES.INVALID_UUID,
      });
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: ERROR_CODES.USER_NOT_FOUND,
      });
    }

    res.json({
      message: "User retrieved successfully",
      user: removeSensitiveData(user),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Internal server error while retrieving user",
      code: ERROR_CODES.SERVER_ERROR,
    });
  }
};

const exchangeScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const { pointsToExchange, bookingId } = req.body;

    if (!uuidValidate(userId)) {
      return res.status(400).json({
        error: "Invalid user ID format",
        code: ERROR_CODES.INVALID_UUID,
      });
    }

    const points = parseInt(pointsToExchange, 10);
    if (isNaN(points) || points <= 0) {
      return res.status(400).json({
        error: "Invalid points value",
        code: ERROR_CODES.INVALID_REQUEST,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found", code: ERROR_CODES.USER_NOT_FOUND });
    }

    if (user.ScoreBalance < points) {
      return res.status(400).json({ error: "Insufficient score balance" });
    }

    const moneyGained = points * 1000;
    const newScoreBalance = user.ScoreBalance - points;

    await User.updateScoreBalance(userId, newScoreBalance);

    // Tạo bản ghi score history cho việc exchange
    const scoreHistoryId = await ScoreHistory.createScoreHistory({
      MemberId: userId,
      RelatedBookingId: bookingId || null,
      ScoreValue: -points,
      ChangeType: '2',
      ChangeDate: new Date(),
      CreatedBy: userId
    });

    res.json({
      message: "Score exchanged successfully",
      moneyGained,
      newScoreBalance,
      scoreHistoryId
    });
  } catch (error) {
    console.error("Exchange score error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", code: ERROR_CODES.SERVER_ERROR });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
  updateProfile,
  getUserById,
  exchangeScore,
};
