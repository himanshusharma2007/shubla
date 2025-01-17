const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../model/adminModel");
const sendEmail = require("../utils/sendMail");

// Generate JWT Token
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_KEY,
    { expiresIn: "7d" }
  );
};

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password, role = "superAdmin" } = req.body;

    // Check if admin already exists
    let existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin with this email or username already exists",
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password,
      role: role || "superAdmin",
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering admin",
      error: error.message,
    });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    console.log('req.body in login admin', req.body)
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials Login" });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials password" });
    }

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Generate token
    const token = generateToken(admin);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,  // Required for HTTPS
      sameSite: 'none',  // Required for cross-origin
      path: '/',
      domain: 'shubla-backend.onrender.com',  // Your backend domain
      maxAge: 24 * 60 * 60 * 1000  // 1 day in milliseconds
  });
    console.log('token set sucessfully in cookie', token)
    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log('error in login', error)
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      maxAge: 0,
    });
    return res.status(200).json({message: "Logout successful"})
  } catch (error) {
    console.log('error in login', error)
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
}

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ message: "No admin found with this email" });
    }

    // Generate reset token
    const resetToken = admin.generateResetToken();
    await admin.save();

    // Construct reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const msg = `
      <a href="${resetURL}">Click for reset password</a>
    `
    const isEmailSend = await sendEmail(admin.email, "Forget Password", msg)

    if (!isEmailSend) {
      res.status(500).json({
        message: "Email not send retry"// For testing purposes, in production, don't send this
      });
    }

    res.json({
      message: "Password reset token sent to email"// For testing purposes, in production, don't send this
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing password reset",
      error: error.message,
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find admin with valid token
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Set new password
    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching admin profile",
      error: error.message,
    });
  }
};
