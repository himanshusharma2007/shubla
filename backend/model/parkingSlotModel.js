const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a parking slot title"],
    trim: true,
    maxLength: [100, "Parking slot title cannot exceed 100 characters"],
  },
  subtitle: {
    type: String,
    required: [true, "Please provide a parking slot subtitle"],
    trim: true,
    maxLength: [200, "Parking slot subtitle cannot exceed 200 characters"],
  },
  facilities: [
    {
      type: String,
      required: [true, "Please specify parking facilities"],
    },
  ],
  description: {
    type: String,
    required: [true, "Please provide a parking slot description"],
    trim: true,
  },
  totalSlots: {
    type: Number,
    required: [true, "Please specify total number of parking slots"],
    min: [1, "Total parking slots must be at least 1"],
  },
  availableSlots: {
    type: Number,
    required: [true, "Please specify number of available parking slots"],
  },
  dimension: {
    width: {
      type: Number,
      default: 10, // meters
    },
    length: {
      type: Number,
      default: 10, // meters
    },
  },
  price: {
    type: Number,
    required: [true, "Please specify parking slot price"],
    min: [1, "Parking slot price must be at least 1"],
  },
  amenities: {
    electricity: { type: Boolean, default: true },
    water: { type: Boolean, default: true },
    sanitation: { type: Boolean, default: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
