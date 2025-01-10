const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { checkAuth } = require("../middleware/checkAuth");
const {
  getRoomsData,
  updateRoom,
  createRoom,
} = require("../controller/roomsController");
const { checkAdmin } = require("../middleware/checkAdmin");

// Validation middleware
const roomValidation = [
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
  check("totalRooms")
    .notEmpty()
    .withMessage("Total rooms is required")
    .isInt({ min: 1 })
    .withMessage("Total rooms must be at least 1"),
  check("availableRooms")
    .notEmpty()
    .withMessage("Available rooms is required")
    .isInt({ min: 0 })
    .withMessage("Available rooms cannot be negative")
    .custom((value, { req }) => {
      if (value > req.body.totalRooms) {
        throw new Error("Available rooms cannot exceed total rooms");
      }
      return true;
    }),
];

// Routes
router
  .route("/update/:id")
  .put(checkAdmin, roomValidation, updateRoom);
router
  .route("/create")
  .post(checkAdmin, roomValidation, createRoom);

router.get("/", getRoomsData);

module.exports = router;
