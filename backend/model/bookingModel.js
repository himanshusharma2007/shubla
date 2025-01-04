const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  isPrivateBooking: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceType: {
    type: String,
    enum: ["room", "camp", "parking"],
    required: [true, "Please specify service type"],
  },
  roomType: {
    type: String,
    enum: ["master", "kids"], // Add all possible room types here
    required: function () {
      return this.serviceType === "room";
    },
  },
  quantity: {
    type: Number,
    required: [true, "Please specify quantity"],
    min: [1, "Quantity must be at least 1"],
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Validate check-out is after check-in
bookingSchema.pre("save", function (next) {
  if (this.checkOut <= this.checkIn) {
    const err = new Error("Check-out time must be after check-in time");
    next(err);
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
