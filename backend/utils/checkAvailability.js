// Utility function to check date overlaps
const Booking = require("../model/bookingModel");
const Room = require("../model/roomsModel");
const Camp = require("../model/campsModel");
const ParkingSlot = require("../model/parkingSlotModel");

const checkDateOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};

// Function to check room availability
const checkRoomAvailability = async (
  quantity,
  checkIn,
  checkOut,
  roomType,
  guests = 1
) => {
  console.log(`Checking availability for:`, {
    quantity,
    checkIn,
    checkOut,
    roomType,
    guests,
  });

  try {
    // Get the latest room configuration
    const room = await Room.findOne({ roomType }).sort({ createdAt: -1 });
    console.log("Found room configuration:", room);

    if (!room) {
      console.log("Room type not found:", roomType);
      return { available: false, message: "Room type not found" };
    }

    // Check guest capacity
    const totalCapacity = room.capacity * quantity;
    console.log("Capacity check:", {
      requestedGuests: guests,
      roomCapacity: room.capacity,
      totalCapacity,
      withinCapacity: guests <= totalCapacity,
    });

    if (guests > totalCapacity) {
      console.log("Capacity exceeded");
      return {
        available: false,
        message: "Guest count exceeds room capacity",
        capacityExceeded: true,
      };
    }

    // Get all active bookings for this room type
    const activeBookings = await Booking.find({
      serviceType: "room",
      roomType,
      status: "confirmed",
      $or: [{ checkIn: { $lte: checkOut } }, { checkOut: { $lte: checkIn } }],
    });
    console.log("Active bookings found:", activeBookings.length);

    // Calculate currently booked rooms for the requested period
    const bookedRooms = activeBookings.reduce(
      (total, booking) => total + booking.quantity,
      0
    );
    const availableRooms = room.totalRooms - bookedRooms;
    console.log("Availability calculation:", {
      totalRooms: room.totalRooms,
      bookedRooms,
      availableRooms,
      requestedQuantity: quantity,
    });

    if (availableRooms >= quantity) {
      console.log("Rooms available for immediate booking");
      return {
        available: true,
        status: "confirmed",
        price: room.pricing,
        message: "Rooms available for booking",
      };
    }

    // Check for potential availability due to checkouts before check-in
    const checkoutBeforeCheckin = await Booking.find({
      serviceType: "room",
      roomType,
      status: { $in: ["pending", "confirmed"] },
      checkOut: { $lte: checkIn },
    });
    console.log(
      "Potential checkouts before checkin:",
      checkoutBeforeCheckin.length
    );

    const potentialAvailableRooms = checkoutBeforeCheckin.reduce(
      (total, booking) => total + booking.quantity,
      0
    );
    console.log("Potential availability:", {
      potentialAvailableRooms,
      totalPotentialRooms: potentialAvailableRooms + availableRooms,
      requestedQuantity: quantity,
    });

    if (potentialAvailableRooms + availableRooms >= quantity) {
      console.log("Rooms potentially available pending checkouts");
      return {
        available: true,
        status: "pending",
        price: room.pricing,
        message: "Rooms may become available",
      };
    }

    console.log("Not enough rooms available");
    return {
      available: false,
      message: "Not enough rooms available",
    };
  } catch (error) {
    console.error("Error in checkRoomAvailability:", error);
    throw new Error(`Error checking room availability: ${error.message}`);
  }
};
// Function to check camp availability
const checkCampAvailability = async (
  quantity,
  checkIn,
  checkOut,
  guests = 1
) => {
  try {
    // Get the latest camp configuration
    const camp = await Camp.findOne().sort({ createdAt: -1 });
    if (!camp) {
      return { available: false, message: "Camp configuration not found" };
    }

    // Check guest capacity
    if (guests > camp.capacity * quantity) {
      return {
        available: false,
        message: "Guest count exceeds camp capacity",
        capacityExceeded: true,
      };
    }

    // Get all active bookings
    const activeBookings = await Booking.find({
      serviceType: "camp",
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lte: checkOut },
          checkOut: { $gte: checkIn },
        },
      ],
    });

    // Calculate booked camps
    const bookedCamps = activeBookings.reduce(
      (total, booking) => total + booking.quantity,
      0
    );
    const availableCamps = camp.totalCamps - bookedCamps;

    // Calculate price based on weekday/weekend
    const checkInDay = new Date(checkIn).getDay();
    // const price =
    //   checkInDay === 0 || checkInDay === 6
    //     ? camp.pricing.weekend
    //     : camp.pricing.weekday;

    if (availableCamps >= quantity) {
      return {
        available: true,
        status: "confirmed",
        price: camp.pricing,
        message: "Camps available for booking",
      };
    }

    // Check potential availability
    const checkoutBeforeCheckin = await Booking.find({
      serviceType: "camp",
      status: { $in: ["pending", "confirmed"] },
      checkOut: { $lt: checkIn },
    });

    const potentialAvailableCamps = checkoutBeforeCheckin.reduce(
      (total, booking) => total + booking.quantity,
      0
    );

    if (potentialAvailableCamps + availableCamps >= quantity) {
      return {
        available: true,
        status: "pending",
        price: camp.pricing,
        message: "Camps may become available",
      };
    }

    return {
      available: false,
      message: "Not enough camps available",
    };
  } catch (error) {
    throw new Error(`Error checking camp availability: ${error.message}`);
  }
};

// Function to check parking availability
const checkParkingAvailability = async (quantity, checkIn, checkOut) => {
  try {
    // Get the latest parking configuration
    const parkingSlot = await ParkingSlot.findOne().sort({ createdAt: -1 });
    if (!parkingSlot) {
      return { available: false, message: "Parking configuration not found" };
    }

    // Get all active bookings
    const activeBookings = await Booking.find({
      serviceType: "parking",
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lte: checkOut },
          checkOut: { $gte: checkIn },
        },
      ],
    });

    // Calculate booked slots
    const bookedSlots = activeBookings.reduce(
      (total, booking) => total + booking.quantity,
      0
    );
    const availableSlots = parkingSlot.totalSlots - bookedSlots;

    // Calculate price based on weekday/weekend
    const checkInDay = new Date(checkIn).getDay();
    const price =
      checkInDay === 0 || checkInDay === 6
        ? parkingSlot.pricing.weekend
        : parkingSlot.pricing.weekday;

    if (availableSlots >= quantity) {
      return {
        available: true,
        status: "confirmed",
        price,
        message: "Parking slots available",
      };
    }

    // Check potential availability
    const checkoutBeforeCheckin = await Booking.find({
      serviceType: "parking",
      status: { $in: ["pending", "confirmed"] },
      checkOut: { $lt: checkIn },
    });

    const potentialAvailableSlots = checkoutBeforeCheckin.reduce(
      (total, booking) => total + booking.quantity,
      0
    );

    if (potentialAvailableSlots + availableSlots >= quantity) {
      return {
        available: true,
        status: "pending",
        price,
        message: "Parking slots may become available",
      };
    }

    return {
      available: false,
      message: "Not enough parking slots available",
    };
  } catch (error) {
    throw new Error(`Error checking parking availability: ${error.message}`);
  }
};

// Main function to check availability for any service type
const checkAvailability = async (
  serviceType,
  quantity,
  checkIn,
  checkOut,
  options = {}
) => {
  const { roomType, guests } = options;

  switch (serviceType) {
    case "room":
      return checkRoomAvailability(
        quantity,
        checkIn,
        checkOut,
        roomType,
        guests
      );
    case "camp":
      return checkCampAvailability(quantity, checkIn, checkOut, guests);
    case "parking":
      return checkParkingAvailability(quantity, checkIn, checkOut);
    default:
      throw new Error("Invalid service type");
  }
};

module.exports = checkAvailability;
