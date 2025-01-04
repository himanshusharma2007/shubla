const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a camp title"],
    trim: true,
    maxLength: [100, "Camp title cannot exceed 100 characters"],
  },
  subtitle: {
    type: String,
    required: [true, "Please provide a camp subtitle"],
    trim: true,
    maxLength: [200, "Camp subtitle cannot exceed 200 characters"],
  },
  facilities: [
    {
      type: String,
      required: [true, "Please specify camp facilities"],
    },
  ],
  pricing: {
    type: Number,
    default: 200,
  },
  description: {
    type: String,
    required: [true, "Please provide a camp description"],
    trim: true,
  },
  totalCamps: {
    type: Number,
    required: [true, "Please specify total number of camps"],
    min: [1, "Total camps must be at least 1"],
  },
  availableCamps: {
    type: Number,
    required: [true, "Please specify number of available camps"],
  },
  tentType: {
    type: String,
    enum: ["bedouin"],
    required: [true, "Please specify tent type"],
  },
  capacity: {
    type: Number,
    required: true,
    max: [16, "Tent capacity cannot exceed 16 people"],
  },
  dimension: {
    width: Number,
    length: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Camp", campSchema);
