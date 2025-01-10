const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a room title"],
    trim: true,
    maxLength: [100, "Room title cannot exceed 100 characters"],
  },
  roomType: {
    type: String,
    enum: ["master", "kids"],
    required: [true, "Please specify room type"],
  },
  capacity: {
    type: Number,
    required: [true, "Please specify room capacity"],
    max: [4, "Room capacity cannot exceed 4 people"],
  },
  facilities: [
    {
      type: String,
      required: [true, "Please specify room facilities"],
    },
  ],
  subtitle: {
    type: String,
    required: [true, "Please provide a room subtitle"],
    trim: true,
    maxLength: [200, "Room subtitle cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a room description"],
    trim: true,
  },
  totalRooms: {
    type: Number,
    required: [true, "Please specify total number of rooms"],
    min: [1, "Total rooms must be at least 1"],
  },
  availableRooms: {
    type: Number,
    required: [true, "Please specify number of available rooms"],
  },
  pricing: {
    type: Number,
    default: 3000,
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
