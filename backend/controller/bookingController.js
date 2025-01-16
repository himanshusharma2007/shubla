// controllers/bookingController.js
const Booking = require("../model/bookingModel");
const Room = require("../model/roomsModel");
const Camp = require("../model/campsModel");
const ParkingSlot = require("../model/parkingSlotModel");
const sendEmail = require("../utils/sendMail");
const checkAvailability = require("../utils/checkAvailability");

// Utility function to update service availability
exports.updateServiceAvailability = async (serviceType) => {
  console.log("Execution started for service type:", serviceType);

  let ServiceModel;

  // Determine the service model
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
      console.error("Invalid service type:", serviceType);
      throw new Error("Invalid service type");
  }

  if (serviceType === "room") {
    console.log("Handling room service type...");

    // Handle each room type individually
    const roomTypes = ["master", "kids"]; // Add more types as needed
    console.log("Room types to process:", roomTypes);

    for (const roomType of roomTypes) {
      console.log(`Processing room type: ${roomType}`);
      const service = await ServiceModel.findOne({ roomType }).sort({
        createdAt: -1,
      });

      if (!service) {
        console.warn(`No service found for room type: ${roomType}`);
        continue;
      }

      console.log(`Service found for room type ${roomType}:`, service);

      // Get all active bookings for this room type
      const activeBookings = await Booking.find({
        serviceType,
        status: "confirmed",
        checkOut: { $gt: new Date() },
        roomType,
      });

      console.log(`Active bookings for room type ${roomType}:`, activeBookings);

      // Calculate total booked quantity
      const bookedQuantity = activeBookings.reduce(
        (total, booking) => total + booking.quantity,
        0
      );

      console.log(
        `Total booked quantity for room type ${roomType}:`,
        bookedQuantity
      );

      // Update available quantity for the specific room type
      const availableQuantity = service.totalRooms - bookedQuantity;

      console.log(
        `Updating availableRooms for ${roomType}:`,
        availableQuantity
      );

      // Update the service document
      await ServiceModel.updateMany(
        { roomType },
        {
          $set: {
            availableRooms: availableQuantity,
          },
        }
      );

      console.log(`Successfully updated availableRooms for ${roomType}`);
    }

    console.log("Room service type processing completed.");
    return;
  }

  console.log("Handling generic service type...");

  // Generic handling for other service types
  const service = await ServiceModel.findOne().sort({ createdAt: -1 });
  if (!service) {
    console.error("No service found for generic service type:", serviceType);
    throw new Error("Service not found");
  }

  console.log(
    `Service found for generic service type ${serviceType}:`,
    service
  );

  // Get all active bookings for this service type
  const activeBookings = await Booking.find({
    serviceType,
    status: "confirmed",
    checkOut: { $gt: new Date() },
  });

  console.log(
    `Active bookings for service type ${serviceType}:`,
    activeBookings
  );

  // Calculate total booked quantity
  const bookedQuantity = activeBookings.reduce(
    (total, booking) => total + booking.quantity,
    0
  );

  console.log(
    `Total booked quantity for service type ${serviceType}:`,
    bookedQuantity
  );

  // Update available quantity
  let availableQuantity =
    service[
    `total${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}s`
    ] - bookedQuantity;

  if(serviceType==="parking"){
    availableQuantity = service["totalSlots"] - bookedQuantity
  }

  console.log(
    `Updating available quantity for ${serviceType}:`,
    availableQuantity
  );

  // Update the service document
  await ServiceModel.updateMany(
    {},
    {
      $set: {
        [`available${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
          }s`]: availableQuantity,
      },
    }
  );

  if(serviceType==="parking"){
    await ServiceModel.updateMany(
      {},
      {
        $set: {
          [`availableSlots`]: availableQuantity,
        },
      }
    );
  }

  console.log(`Successfully updated available quantity for ${serviceType}`);
  return availableQuantity;
};

// Utility function to send booking notifications// controllers/bookingController.js

exports.createBooking = async (req, res) => {
  try {
    console.log("Create booking API called with body:", req.body);

    const {
      serviceType,
      quantity,
      checkIn,
      checkOut,
      guests,
      roomType,
      isPrivateBooking,
      paymentInfo,
      paymentStatus
    } = req.body;

    const user = req.user;
    console.log("User information:", user);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    console.log("Parsed check-in date:", checkInDate);
    console.log("Parsed check-out date:", checkOutDate);

    // Validate check-in date
    if (checkInDate < new Date()) {
      console.log("Validation failed: Check-in date is in the past");
      return res.status(400).json({
        success: false,
        message: "Check-in time cannot be in the past",
      });
    }

    // Validate check-out date
    if (checkOutDate <= checkInDate) {
      console.log("Validation failed: Check-out date is not after check-in date");
      return res.status(400).json({
        success: false,
        message: "Check-out time must be after check-in time",
      });
    }

    // Validate service type
    if (!["room", "camp", "parking"].includes(serviceType)) {
      console.log("Validation failed: Invalid service type:", serviceType);
      return res.status(400).json({
        success: false,
        message: "Invalid service type",
      });
    }

    // Validate room type if service type is room
    if (serviceType === "room" && !["master", "kids"].includes(roomType)) {
      console.log("Validation failed: Invalid room type:", roomType);
      return res.status(400).json({
        success: false,
        message: "Invalid room type",
      });
    }

    // Check service availability
    console.log("Checking service availability...");
    const availability = await checkAvailability(
      serviceType,
      quantity,
      checkInDate,
      checkOutDate,
      { roomType, guests }
    );

    console.log("Service availability:", availability);

    if (!availability.available) {
      console.log("Validation failed: Service not available:", availability.message);
      return res.status(400).json({
        success: false,
        message: availability.message,
      });
    }

    // Calculate duration in days
    const duration = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    console.log("Calculated booking duration (days):", duration);

    // Calculate total amount
    const totalAmount = quantity * availability.price * duration;
    console.log("Calculated total amount:", totalAmount);

    // Create booking with dynamic status
    console.log("Creating booking...");
    const booking = await Booking.create({
      user: user._id,
      serviceType,
      quantity,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalAmount,
      status: availability.status, // Dynamic status based on availability
      paymentInfo,
      paymentStatus,
      isPrivateBooking: isPrivateBooking || false,
      roomType: serviceType === "room" ? roomType : undefined,
    });

    console.log("Booking created:", booking);

    if (availability.status === "confirmed") {
      console.log("Updating service availability as status is confirmed...");
      await updateServiceAvailability(serviceType);
    }

    // Send notifications based on booking status
    console.log("Sending booking notifications...");
    await sendBookingNotifications(booking, user);

    // Prepare response message based on status
    const statusMessage =
      availability.status === "confirmed"
        ? "Booking confirmed successfully"
        : "Booking request received and pending confirmation";

    console.log("Final response prepared with status message:", statusMessage);

    res.status(201).json({
      success: true,
      message: statusMessage,
      booking,
      availability: {
        status: availability.status,
        message: availability.message,
      },
    });
  } catch (error) {
    console.error("Error in create booking:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
}

exports.getAvailability = async(req,res)=> {
  try {
    console.log("Create booking API called with body:", req.body);

    const {
      serviceType,
      quantity,
      checkIn,
      checkOut,
      guests,
      roomType,
    } = req.body;

    const user = req.user;
    console.log("User information:", user);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    console.log("Parsed check-in date:", checkInDate);
    console.log("Parsed check-out date:", checkOutDate);

    // Validate check-in date
    if (checkInDate < new Date()) {
      console.log("Validation failed: Check-in date is in the past");
      return res.status(400).json({
        success: false,
        message: "Check-in time cannot be in the past",
      });
    }

    // Validate check-out date
    if (checkOutDate <= checkInDate) {
      console.log("Validation failed: Check-out date is not after check-in date");
      return res.status(400).json({
        success: false,
        message: "Check-out time must be after check-in time",
      });
    }

    // Validate service type
    if (!["room", "camp", "parking"].includes(serviceType)) {
      console.log("Validation failed: Invalid service type:", serviceType);
      return res.status(400).json({
        success: false,
        message: "Invalid service type",
      });
    }

    // Validate room type if service type is room
    if (serviceType === "room" && !["master", "kids"].includes(roomType)) {
      console.log("Validation failed: Invalid room type:", roomType);
      return res.status(400).json({
        success: false,
        message: "Invalid room type",
      });
    }

    // Check service availability
    console.log("Checking service availability...");
    const availability = await checkAvailability(
      serviceType,
      quantity,
      checkInDate,
      checkOutDate,
      { roomType, guests }
    );

    console.log("Service availability:", availability);

    if (!availability.available) {
      console.log("Validation failed: Service not available:", availability.message);
      return res.status(400).json({
        success: false,
        message: availability.message,
      });
    }

    // Calculate duration in days
    const duration = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    console.log("Calculated booking duration (days):", duration);

    // Calculate total amount
    const totalAmount = quantity * availability.price * duration;
    console.log("Calculated total amount:", totalAmount);

    res.status(201).json({
      success: true,
      data: {
        ...availability, totalAmount
      }
    }
    );
  } catch (error) {
    console.error("Error in booking availability:", error);
    res.status(500).json({
      success: false,
      message: "Error get booking availability",
      error: error.message,
    });
  }
}


// Update the sendBookingNotifications function to handle different statuses
const sendBookingNotifications = async (booking, user) => {
  const isPending = booking.status === "pending";
  const statusMessage = isPending
    ? "Booking Request Pending"
    : "Booking Confirmed";
  const serviceTypeFormatted =
    booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1);

  // Email to user
  const userSubject = `${statusMessage} - Booking Reference`;
  const userMessage = `
      ${statusMessage}!
      
      Dear ${user.name},

      Your booking status is: ${statusMessage}
      Here are the details:

      Service: ${serviceTypeFormatted}
      ${booking.roomType ? `Room Type: ${booking.roomType}\n` : ""}
      Quantity: ${booking.quantity}
      Check-in: ${new Date(booking.checkIn).toLocaleString()}
      Check-out: ${new Date(booking.checkOut).toLocaleString()}
      Total Amount: R${booking.totalAmount}

      ${isPending
      ? "Your booking is currently pending availability. We will notify you as soon as we can confirm your booking."
      : "Your booking is confirmed! We look forward to hosting you."
    }

      ${isPending
      ? "\nNote: Pending bookings are subject to availability. We will process your request as soon as possible."
      : "\nIf you need to modify or cancel your booking, please contact us at least 24 hours in advance."
    }

      Best regards,
      Booking Team
  `;

  // Email to admin
  const adminSubject = `New ${statusMessage} - Administrative Notice`;
  const adminMessage = `
      New ${statusMessage}

      Booking Details:
      Service: ${serviceTypeFormatted}
      ${booking.roomType ? `Room Type: ${booking.roomType}\n` : ""}
      Quantity: ${booking.quantity}
      Check-in: ${new Date(booking.checkIn).toLocaleString()}
      Check-out: ${new Date(booking.checkOut).toLocaleString()}
      Total Amount: R${booking.totalAmount}

      Customer Details:
      Name: ${user.name}
      Email: ${user.email}

      ${isPending
      ? "This booking requires review due to pending availability status."
      : "This booking has been automatically confirmed based on availability."
    }
  `;

  // Send emails
  await Promise.all([
    sendEmail(user.email, userSubject, userMessage),
    sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminMessage),
  ]);
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
