const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {checkAuth} = require("../middleware/checkAuth");
const {checkAdmin} = require("../middleware/checkAdmin");
const {
  updateOrCreateCampsData,
  getCampsData,
} = require("../controller/campsController");

// Validation middleware
const campValidation = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  check("subtitle")
    .notEmpty()
    .withMessage("Subtitle is required")
    .isLength({ max: 200 })
    .withMessage("Subtitle cannot exceed 200 characters"),
  check("facilities")
    .isArray()
    .withMessage("Facilities must be an array")
    .notEmpty()
    .withMessage("At least one facility is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("totalCamps")
    .notEmpty()
    .withMessage("Total camps is required")
    .isInt({ min: 1 })
    .withMessage("Total camps must be at least 1"),
  check("availableCamps")
    .notEmpty()
    .withMessage("Available camps is required")
    .isInt({ min: 0 })
    .withMessage("Available camps cannot be negative")
    .custom((value, { req }) => {
      if (value > req.body.totalCamps) {
        throw new Error("Available camps cannot exceed total camps");
      }
      return true;
    }),
];

// Routes
router.route("/update").put(checkAdmin, campValidation, updateOrCreateCampsData);

router.route("/").get( getCampsData);

module.exports = router;
