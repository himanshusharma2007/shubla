const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {checkAuth} = require("../middleware/checkAuth");
const {checkAdmin} = require("../middleware/checkAdmin");
const {
  sendMessage,
  getAllMessages,
} = require("../controller/contactController");

// Validation middleware
const contactValidation = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  check("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),
];

// Routes
router.post("/", contactValidation, sendMessage);
router.get("/get-messages", checkAdmin, getAllMessages);

module.exports = router;
