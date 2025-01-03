// controllers/bookingController.js
const Booking = require("../model/bookingModel");
const Room = require("../model/roomsModel");
const Camp = require("../model/campsModel");
const ParkingSlot = require("../model/parkingSlotModel");
const sendEmail = require("../utils/sendMail");

const checkAvailability = async (
  serviceType,
  quantity,
  checkIn,
  checkOut,
  options = {}
) => {
  let ServiceModel;
  switch (serviceType) {
    case "room":
      ServiceModel = Room;
      break;
    case "camp":
      ServiceModel = Camp;
      break;
    case "parking":
      ServiceModel = ParkingSlot;
      break;
    default:
      throw new Error("Invalid service type");
  }

  // Get current service data
  const service = await ServiceModel.findOne().sort({ createdAt: -1 });
  if (!service) {
    throw new Error("Service not found");
  }

  // Get overlapping bookings
  const overlappingBookings = await Booking.find({
    serviceType,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      {
        checkIn: { $lte: checkOut },
        checkOut: { $gte: checkIn },
      },
    ],
  });

  // Calculate total booked quantity for the period
  const bookedQuantity = overlappingBookings.reduce(
    (total, booking) => total + booking.quantity,
    0
  );

  // Calculate price based on service type
  let price = 0;

  switch (serviceType) {
    case "parking":
      const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
      };
      price = isWeekend(new Date(checkIn))
        ? service.pricing.weekend
        : service.pricing.weekday;
      break;
    case "room":
    case "camp":
      price = service.price; // Single price field for rooms and camps
      break;
  }

  // Check capacity constraints
  let capacityExceeded = false;
  if (serviceType === "room" && quantity * 4 < options.guests) {
    capacityExceeded = true;
  } else if (serviceType === "camp" && quantity * 16 < options.guests) {
    capacityExceeded = true;
  }

  // Calculate available quantity
  const availableQuantity =
    service[
      `total${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}s`
    ] - bookedQuantity;

  return {
    available: availableQuantity >= quantity && !capacityExceeded,
    availableQuantity,
    price,
    capacityExceeded,
  };
};


// Utility function to update service availability
const updateServiceAvailability = async (serviceType) => {
  let ServiceModel;
  switch (serviceType) {
    case "room":
      ServiceModel = Room;
      break;
    case "camp":
      ServiceModel = Camp;
      break;
    case "parking":
      ServiceModel = ParkingSlot;
      break;
    default:
      throw new Error("Invalid service type");
  }

  // Get current service data
  const service = await ServiceModel.findOne().sort({ createdAt: -1 });
  if (!service) {
    throw new Error("Service not found");
  }

  // Get all active bookings for this service type
  const activeBookings = await Booking.find({
    serviceType,
    status: { $in: ["pending", "confirmed"] },
    checkOut: { $gt: new Date() },
  });

  // Calculate total booked quantity
  const bookedQuantity = activeBookings.reduce(
    (total, booking) => total + booking.quantity,
    0
  );

  // Update available quantity
  const availableQuantity =
    service[
      `total${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}s`
    ] - bookedQuantity;

  // Update the service document
  await ServiceModel.updateMany(
    {},
    {
      $set: {
        [`available${
          serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
        }s`]: availableQuantity,
      },
    }
  );

  return availableQuantity;
};

// Utility function to send booking notifications
const sendBookingNotifications = async (booking, user) => {
  const isPending = booking.status === "pending";
  const statusMessage = isPending ? "Booking Pending" : "Booking Confirmed";

  // Email to user
  const userSubject = `${statusMessage} - Shubla`;
  const userMessage = `
          ${statusMessage}!
          
          Dear ${user.name},
  
          Your booking status is: ${statusMessage}.
          Here are the details:
  
          Service: ${
            booking.serviceType.charAt(0).toUpperCase() +
            booking.serviceType.slice(1)
          }
  
          Quantity: ${booking.quantity}
  
          Check-in: ${new Date(booking.checkIn).toLocaleString()}
  
          Check-out: ${new Date(booking.checkOut).toLocaleString()}
  
          Total Amount: R${booking.totalAmount}
  
          ${
            isPending
              ? "We are reviewing your booking and will notify you once it is confirmed."
              : "Thank you for choosing our services!"
          }
  
          Best regards,
  
          Shubla Team
      `;

  // Email to admin
  const adminSubject = `New Booking Alert - ${statusMessage} - Shubla`;
  const adminMessage = `
          ${statusMessage}
  
          Booking Details:
  
          Service: ${booking.serviceType}
  
          Quantity: ${booking.quantity}
  
          Check-in: ${new Date(booking.checkIn).toLocaleString()}
  
          Check-out: ${new Date(booking.checkOut).toLocaleString()}
  
          Total Amount: R${booking.totalAmount}
  
          Customer Details:
  
          Name: ${user.name}
  
          Email: ${user.email}
  
          ${
            isPending
              ? "Please review and confirm the booking at your earliest convenience."
              : "The booking has been confirmed successfully."
          }
      `;

  // Send emails
  await Promise.all([
    sendEmail(user.email, userSubject, userMessage),
    sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminMessage),
  ]);
};

// Enhanced createBooking controller
exports.createBooking = async (req, res) => {
  try {
      const { 
          serviceType, 
          quantity, 
          checkIn, 
          checkOut, 
          guests,
          roomType,
          isPrivateBooking
      } = req.body;
      
      const user = req.user;
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkInDate < new Date()) {
          return res.status(400).json({
              success: false,
              message: "Check-in time cannot be in the past"
          });
      }

      // Regular service booking
      const availability = await checkAvailability(
          serviceType,
          quantity,
          checkInDate,
          checkOutDate,
          { roomType, guests }
      );

      if (!availability.available) {
          return res.status(400).json({
              success: false,
              message: availability.capacityExceeded ?
                  "Guest count exceeds capacity" :
                  "Service not available for selected dates and quantity"
          });
      }

      const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const totalAmount = quantity * availability.price * duration;

      const booking = await Booking.create({
          user: user._id,
          serviceType,
          quantity,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          totalAmount,
          status: "confirmed",
          paymentStatus: "pending",
          isPrivateBooking: isPrivateBooking || false,
          roomType: serviceType === "room" ? roomType : undefined
      });

      await updateServiceAvailability(serviceType);
      await sendBookingNotifications(booking, user);

      res.status(201).json({
          success: true,
          message: "Booking confirmed successfully",
          booking
      });
  } catch (error) {
      console.log("error in create booking", error);
      res.status(500).json({
          success: false,
          message: "Error creating booking",
          error: error.message
      });
  }
};


// Enhanced updateBookingStatus controller
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Update service availability if status changed
    if (oldStatus !== status) {
      await updateServiceAvailability(booking.serviceType);
    }

    // Send status update notification to user
    const subject = `Booking Status Updated - EJUUZ`;

    let message;
    switch (status) {
      case "confirmed":
        message = `
            <h2>Booking Confirmed</h2>
            <p>Dear ${booking.user.name},</p>
            <p>Your booking has been confirmed. Here are the details:</p>
            <ul>
                <li>Service: ${booking.serviceType}</li>
                <li>Check-in: ${new Date(booking.checkIn).toLocaleString()}</li>
                <li>Check-out: ${new Date(
                  booking.checkOut
                ).toLocaleString()}</li>
            </ul>
            <p>Thank you for choosing EJUUZ. We look forward to serving you!</p>
          `;
        break;

      case "canceled":
        message = `
            <h2>Booking Canceled</h2>
            <p>Dear ${booking.user.name},</p>
            <p>We regret to inform you that your booking has been canceled. Here are the details:</p>
            <ul>
                <li>Service: ${booking.serviceType}</li>
                <li>Check-in: ${new Date(booking.checkIn).toLocaleString()}</li>
                <li>Check-out: ${new Date(
                  booking.checkOut
                ).toLocaleString()}</li>
            </ul>
            <p>If you have any questions or need further assistance, please contact our support team.</p>
          `;
        break;

      case "pending":
        message = `
            <h2>Booking Pending</h2>
            <p>Dear ${booking.user.name},</p>
            <p>Your booking is currently pending. Here are the details:</p>
            <ul>
                <li>Service: ${booking.serviceType}</li>
                <li>Check-in: ${new Date(booking.checkIn).toLocaleString()}</li>
                <li>Check-out: ${new Date(
                  booking.checkOut
                ).toLocaleString()}</li>
            </ul>
            <p>We will notify you once your booking status changes. Thank you for your patience!</p>
          `;
        break;

      default:
        message = `
            <h2>Booking Status Update</h2>
            <p>Dear ${booking.user.name},</p>
            <p>Your booking status has been updated to: ${status}</p>
            <p>Here are the details:</p>
            <ul>
                <li>Service: ${booking.serviceType}</li>
                <li>Check-in: ${new Date(booking.checkIn).toLocaleString()}</li>
                <li>Check-out: ${new Date(
                  booking.checkOut
                ).toLocaleString()}</li>
            </ul>
          `;
    }

    if (status !== "completed") {
      await sendEmail(booking.user.email, subject, message);
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking status",
      error: error.message,
    });
  }
};

// Add automated cleanup for expired bookings
const cleanupExpiredBookings = async () => {
  try {
    const expiredBookings = await Booking.find({
      status: { $in: ["pending", "confirmed"] },
      checkOut: { $lt: new Date() },
    });

    for (const booking of expiredBookings) {
      booking.status = "completed";
      await booking.save();
      await updateServiceAvailability(booking.serviceType);
    }
  } catch (error) {
    console.error("Error in cleanup:", error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredBookings, 60 * 60 * 1000);

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};
