// packageBookingModel.js
const mongoose = require("mongoose");

const packageBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    paymentInfo: {
      id: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        default: null,
      },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    services: {
      room: {
        master: {
          quantity: {
            type: Number,
            default: 0,
          },
          price: {
            type: Number,
            default: 0,
          },
          bookingRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
          },
        },
        kids: {
          quantity: {
            type: Number,
            default: 0,
          },
          price: {
            type: Number,
            default: 0,
          },
          bookingRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
          },
        },
      },
      camp: {
        quantity: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        bookingRef: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
      },
      parking: {
        quantity: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        bookingRef: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Validate check-out is after check-in
packageBookingSchema.pre("save", function (next) {
  if (this.checkOut <= this.checkIn) {
    const err = new Error("Check-out time must be after check-in time");
    next(err);
  }
  next();
});

module.exports = mongoose.model("PackageBooking", packageBookingSchema);
