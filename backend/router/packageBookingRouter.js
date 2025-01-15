const express = require("express");
const router = express.Router();
const {
  createPackageBooking,
  getUserPackageBookings,
  getAllPackageBookings,
  updatePackageBookingStatus,
} = require("../controller/packageBookingController");
const { checkAuth } = require("../middleware/checkAuth");
const { checkAdmin } = require("../middleware/checkAdmin");

router.route("/package-booking/new").post(checkAuth, createPackageBooking);
router.route("/package-bookings").get(checkAuth, getUserPackageBookings);
router.route("/admin/package-bookings").get(checkAdmin, getAllPackageBookings);
router
  .route("/admin/package-booking/:id")
  .put(checkAdmin, updatePackageBookingStatus);

module.exports = router;
