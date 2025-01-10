const mongoose = require("mongoose");
const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  camps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
    },
  ],
  parkingSlots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSlot",
    },
  ],
  maxCapacity: {
    type: Number,
    required: true,
    max: 40,
  },
  basePrice: {
    type: Number,
    required: true,
    default: 2000,
  },
});

module.exports = mongoose.model("Unit", unitSchema);
