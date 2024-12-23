const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { register, login, logout } = require("../controller/authController");
const { checkAuth } = require("../middleware/checkAuth");

// Middleware for handling validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register Route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  validateRequest,
  register
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login
);

// Logout Route
router.post("/logout", checkAuth, logout);

// Get User Route
router.get("/get-user", checkAuth, (req, res) => {
  console.log('req.user', req.user)
  res.status(200).json({ user: req.user });
});

module.exports = router;
