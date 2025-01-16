const express = require("express");
const router = express.Router();
const {
  createPackageBooking,
  getUserPackageBookings,
  getAllPackageBookings,
  updatePackageBookingStatus,
  checkAvailabilityForPackageBooking,
} = require("../controller/packageBookingController");
const { checkAuth } = require("../middleware/checkAuth");
const { checkAdmin } = require("../middleware/checkAdmin");

router.route("/new").post(checkAuth, createPackageBooking);
router.route("/new-check-availability").post(checkAuth, checkAvailabilityForPackageBooking);
router.route("/bookings").get(checkAuth, getUserPackageBookings);
router.route("/admin/bookings").get(checkAdmin, getAllPackageBookings);
router
  .route("/admin/:id")
  .put(checkAdmin, updatePackageBookingStatus);

module.exports = router;
