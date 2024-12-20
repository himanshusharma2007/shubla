const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getAdminProfile,
} = require("../controller/adminController");
const { checkAdmin } = require("../middleware/checkAdmin");

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
};
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character"
    ),
  body("role")
    .optional()
    .isIn(["superAdmin", "admin", "editor"])
    .withMessage("Invalid admin role"),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character"
    ),
];

// Authentication Routes
router.post("/register", registerValidation, validate, registerAdmin);

router.post("/login", loginValidation, validate, loginAdmin);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Invalid email"),
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  resetPassword
);

// Protected Routes
router.get("/profile", checkAdmin, getAdminProfile);

module.exports = router;
