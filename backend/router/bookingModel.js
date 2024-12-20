const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { checkAuth } = require("../middleware/checkAuth");
const { checkAdmin } = require("../middleware/checkAdmin");
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
} = require("../controller/bookingController");

// Validation middleware
const bookingValidation = [
  check("serviceType")
    .notEmpty()
    .withMessage("Service type is required")
    .isIn(["room", "camp", "parking"])
    .withMessage("Invalid service type"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  check("checkIn")
    .notEmpty()
    .withMessage("Check-in time is required")
    .isISO8601()
    .withMessage("Invalid check-in date format"),
  check("checkOut")
    .notEmpty()
    .withMessage("Check-out time is required")
    .isISO8601()
    .withMessage("Invalid check-out date format"),
];

// Routes
router.post("/booking", checkAuth, bookingValidation, createBooking);

router.get("/bookings/me", checkAuth, getUserBookings);

router.get("/admin/bookings", checkAdmin, getAllBookings);

router.put("/admin/booking/:id", checkAdmin, updateBookingStatus);

module.exports = router;
