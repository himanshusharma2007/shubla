// packageBookingController.js
const PackageBooking = require("../model/packageBooking");
const Room = require("../model/roomsModel");
const Camp = require("../model/campsModel");
const ParkingSlot = require("../model/parkingSlotModel");
const Booking = require("../model/bookingModel");
const checkAvailability = require("../utils/checkAvailability");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendMail");
const { updateServiceAvailability } = require("./bookingController");

// Create Package Booking
exports.createPackageBooking = async (req, res) => {
  console.log('req.body', req.body)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      checkIn,
      checkOut,
      services,
      paymentInfo,
      paymentStatus,
      isPrivateBooking = true
    } = req.body;

    const user = req.user;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Check-in time cannot be in the past",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out time must be after check-in time",
      });
    }

    // Check availability and create bookings for each service
    const bookings = [];
    let totalAmount = 0;
    let overallStatus = "confirmed"; // Will be set to "pending" if any service is pending

    // Helper function to check and create booking
    const processBooking = async (serviceType, quantity, options = {}) => {
      const availability = await checkAvailability(
        serviceType,
        quantity,
        checkInDate,
        checkOutDate,
        options
      );

      if (!availability.available) {
        throw new Error(`${serviceType} ${options.roomType || ''} not available: ${availability.message}`);
      }

      // If any service is pending, the whole package becomes pending
      if (availability.status === "pending") {
        overallStatus = "pending";
      }

      const booking = await Booking.create([{
        user: user._id,
        serviceType,
        roomType: options.roomType,
        quantity,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalAmount: quantity * availability.price,
        status: availability.status,
        paymentInfo,
        paymentStatus,
        isPrivateBooking
      }], { session });

      if (availability.status === "confirmed") {
        console.log("updateServiceAvailability run")
        await updateServiceAvailability(serviceType)
      }

      return {
        booking: booking[0],
        price: availability.price,
        status: availability.status
      };
    };

    const duration = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    // Process room bookings
    if (services.room) {
      if (services.room.master && services.room.master.quantity > 0) {
        const { booking, price, status } = await processBooking('room',
          services.room.master.quantity,
          { roomType: 'master', guests: services.room.master.guests }
        );
        bookings.push(booking);
        services.room.master.bookingRef = booking._id;
        services.room.master.price = price;
        services.room.master.status = status;
        totalAmount += (price * services.room.master.quantity * duration);
      }

      if (services.room.kids && services.room.kids.quantity > 0) {
        const { booking, price, status } = await processBooking('room',
          services.room.kids.quantity,
          { roomType: 'kids', guests: services.room.kids.guests }
        );
        bookings.push(booking);
        services.room.kids.bookingRef = booking._id;
        services.room.kids.price = price;
        services.room.kids.status = status;
        totalAmount += (price * services.room.kids.quantity * duration);
      }
    }

    // Process camp booking
    if (services.camp && services.camp.quantity > 0) {
      const { booking, price, status } = await processBooking('camp',
        services.camp.quantity,
        { guests: services.camp.guests }
      );
      bookings.push(booking);
      services.camp.bookingRef = booking._id;
      services.camp.price = price;
      services.camp.status = status;
      totalAmount += (price * services.camp.quantity * duration);
    }

    // Process parking booking
    if (services.parking && services.parking.quantity > 0) {
      const { booking, price, status } = await processBooking('parking',
        services.parking.quantity
      );
      bookings.push(booking);
      services.parking.bookingRef = booking._id;
      services.parking.price = price;
      services.parking.status = status;
      totalAmount += (price * services.parking.quantity * duration);
    }

    // Create package booking
    const packageBooking = await PackageBooking.create([{
      user: user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      services,
      totalAmount,
      status: overallStatus,
      paymentInfo,
      paymentStatus
    }], { session });


    await session.commitTransaction();

    // Send notifications
    await sendPackageBookingNotifications(packageBooking[0], user, bookings);

    res.status(201).json({
      success: true,
      message: overallStatus === "confirmed"
        ? "Package booking confirmed successfully"
        : "Package booking request received and pending confirmation",
      packageBooking: packageBooking[0],
      bookings
    });

  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: "Error creating package booking",
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

exports.checkAvailabilityForPackageBooking = async (req, res) => {
  console.log('req.body', req.body)

  try {
    const {
      checkIn,
      checkOut,
      services,
      isPrivateBooking = true
    } = req.body;

    const user = req.user;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Check-in time cannot be in the past",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out time must be after check-in time",
      });
    }

    // Check availability and create bookings for each service
    const bookings = [];
    let totalAmount = 0;
    let overallStatus = "confirmed"; // Will be set to "pending" if any service is pending

    // Helper function to check and create booking
    const processBooking = async (serviceType, quantity, options = {}) => {
      const availability = await checkAvailability(
        serviceType,
        quantity,
        checkInDate,
        checkOutDate,
        options
      );

      if (!availability.available) {
        throw new Error(`${serviceType} ${options.roomType || ''} not available: ${availability.message}`);
      }

      // If any service is pending, the whole package becomes pending
      if (availability.status === "pending") {
        overallStatus = "pending";
      }

      const booking = {
        user: user._id,
        serviceType,
        roomType: options.roomType,
        quantity,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalAmount: quantity * availability.price,
        status: availability.status,
        isPrivateBooking
      };

      if (availability.status === "confirmed") {
        console.log("updateServiceAvailability run")
        await updateServiceAvailability(serviceType)
      }

      return {
        booking: booking[0],
        price: availability.price,
        status: availability.status
      };
    };

    // Process room bookings
    const duration = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    if (services.room) {
      if (services.room.master && services.room.master.quantity > 0) {
        const { booking, price, status } = await processBooking('room',
          services.room.master.quantity,
          { roomType: 'master', guests: services.room.master.guests }
        );
        bookings.push(booking);
        services.room.master.price = price;
        services.room.master.status = status;
        totalAmount += (price * services.room.master.quantity * duration);
      }

      if (services.room.kids && services.room.kids.quantity > 0) {
        const { booking, price, status } = await processBooking('room',
          services.room.kids.quantity,
          { roomType: 'kids', guests: services.room.kids.guests }
        );
        bookings.push(booking);
        services.room.kids.price = price;
        services.room.kids.status = status;
        totalAmount += (price * services.room.kids.quantity * duration);
      }
    }

    // Process camp booking
    if (services.camp && services.camp.quantity > 0) {
      const { booking, price, status } = await processBooking('camp',
        services.camp.quantity,
        { guests: services.camp.guests }
      );
      bookings.push(booking);
      services.camp.price = price;
      services.camp.status = status;
      totalAmount += (price * services.camp.quantity * duration);
    }

    // Process parking booking
    if (services.parking && services.parking.quantity > 0) {
      const { booking, price, status } = await processBooking('parking',
        services.parking.quantity
      );
      bookings.push(booking);
      services.parking.price = price;
      services.parking.status = status;
      totalAmount += (price * services.parking.quantity * duration);
    }

    // Create package booking
    const packageBooking = {
      user: user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      services,
      totalAmount,
      status: overallStatus
    };

    res.status(201).json({
      success: true,
      status: overallStatus,
      totalAmount,
      packageBooking: packageBooking,
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error creating package booking",
      error: error.message
    });
  }
};

// Get user's package bookings
exports.getUserPackageBookings = async (req, res) => {
  try {
    const packageBookings = await PackageBooking.find({ user: req.user._id })
      .populate('services.room.master.bookingRef')
      .populate('services.room.kids.bookingRef')
      .populate('services.camp.bookingRef')
      .populate('services.parking.bookingRef')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: packageBookings.length,
      packageBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching package bookings",
      error: error.message,
    });
  }
};

// Get all package bookings (admin only)
exports.getAllPackageBookings = async (req, res) => {
  try {
    const packageBookings = await PackageBooking.find()
      .populate('user', 'name email')
      .populate('services.room.master.bookingRef')
      .populate('services.room.kids.bookingRef')
      .populate('services.camp.bookingRef')
      .populate('services.parking.bookingRef')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: packageBookings.length,
      packageBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching package bookings",
      error: error.message,
    });
  }
};

// Update package booking status
exports.updatePackageBookingStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const packageBooking = await PackageBooking.findById(req.params.id)
      .populate('user', 'name email');

    if (!packageBooking) {
      return res.status(404).json({
        success: false,
        message: "Package booking not found",
      });
    }

    // Update package booking status
    packageBooking.status = status;
    await packageBooking.save({ session });

    // Update all associated bookings
    const updatePromises = [];

    // Helper function to update booking references
    const updateBookingRef = async (bookingRef) => {
      if (bookingRef) {
        await Booking.findByIdAndUpdate(
          bookingRef,
          { status },
          { session }
        );
      }
    };

    // Update room bookings
    if (packageBooking.services.room) {
      if (packageBooking.services.room.master) {
        updatePromises.push(updateBookingRef(packageBooking.services.room.master.bookingRef));
      }
      if (packageBooking.services.room.kids) {
        updatePromises.push(updateBookingRef(packageBooking.services.room.kids.bookingRef));
      }
    }

    // Update camp booking
    if (packageBooking.services.camp) {
      updatePromises.push(updateBookingRef(packageBooking.services.camp.bookingRef));
    }

    // Update parking booking
    if (packageBooking.services.parking) {
      updatePromises.push(updateBookingRef(packageBooking.services.parking.bookingRef));
    }

    await Promise.all(updatePromises);
    await session.commitTransaction();

    // Send notification
    await sendStatusUpdateNotification(packageBooking, status);

    res.status(200).json({
      success: true,
      message: "Package booking status updated successfully",
      packageBooking,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Error updating package booking status",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Utility function to send package booking notifications
const sendPackageBookingNotifications = async (packageBooking, user, bookings) => {
  const isPending = packageBooking.status === "pending";
  const statusMessage = isPending ? "Package Booking Request Pending" : "Package Booking Confirmed";

  // Create service summary
  const createServiceSummary = () => {
    let summary = [];

    if (packageBooking.services.room) {
      if (packageBooking.services.room.master?.quantity) {
        summary.push(`Master Rooms: ${packageBooking.services.room.master.quantity}`);
      }
      if (packageBooking.services.room.kids?.quantity) {
        summary.push(`Kids Rooms: ${packageBooking.services.room.kids.quantity}`);
      }
    }
    if (packageBooking.services.camp?.quantity) {
      summary.push(`Camps: ${packageBooking.services.camp.quantity}`);
    }
    if (packageBooking.services.parking?.quantity) {
      summary.push(`Parking Slots: ${packageBooking.services.parking.quantity}`);
    }

    return summary.join('\n');
  };

  // Email to user
  const userSubject = `${statusMessage} - Package Booking Reference`;
  const userMessage = `
    ${statusMessage}!
    
    Dear ${user.name},

    Your package booking status is: ${statusMessage}
    
    Booking Details:
    ${createServiceSummary()}
    Check-in: ${new Date(packageBooking.checkIn).toLocaleString()}
    Check-out: ${new Date(packageBooking.checkOut).toLocaleString()}
    Total Amount: R${packageBooking.totalAmount}

    ${isPending
      ? "Your package booking is currently pending availability. We will notify you once we can confirm your booking."
      : "Your package booking is confirmed! We look forward to hosting you."
    }

    Best regards,
    Booking Team
  `;

  // Send emails
  await Promise.all([
    sendEmail(user.email, userSubject, userMessage),
    sendEmail(
      process.env.ADMIN_EMAIL,
      `New ${statusMessage} - Administrative Notice`,
      `New package booking received. Total amount: R${packageBooking.totalAmount}`
    ),
  ]);
};