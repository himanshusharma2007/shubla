// dashboardController.js
const DashboardMetrics = require("../model/dashboardModel");
const Booking = require("../model/bookingModel");
const Room = require("../model/roomsModel");
const Camp = require("../model/campsModel");
const ParkingSlot = require("../model/parkingSlotModel");
const Contact = require("../model/contactModel");

// Helper function to get date ranges
const getDateRanges = () => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return {
    daily: startOfDay,
    weekly: startOfWeek,
    monthly: startOfMonth,
    yearly: startOfYear,
  };
};
// Helper function to calculate earnings
const calculateEarnings = async (startDate, serviceType) => {
  const query = {
    createdAt: { $gte: startDate },
    paymentStatus: "completed",
  };

  if (serviceType) {
    query.serviceType = serviceType;
  }

  const bookings = await Booking.find(query);
  return bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
};

const calculateStayDuration = (checkIn, checkOut) => {
  return Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  );
};

const calculateRevenue = async (startDate, filters = {}) => {
  const query = {
    createdAt: { $gte: startDate },
    paymentStatus: "completed",
    ...filters,
  };

  const bookings = await Booking.find(query);
  return bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
};

const calculateRoomMetrics = async (rooms, activeBookings) => {
  const metrics = {
    master: {
      total: 0,
      occupied: 0,
      available: 0,
      occupancyRate: 0,
      capacityUtilization: 0,
    },
    kids: {
      total: 0,
      occupied: 0,
      available: 0,
      occupancyRate: 0,
      capacityUtilization: 0,
    },
  };

  // Calculate totals by room type
  rooms.forEach((room) => {
    metrics[room.roomType].total += room.totalRooms;
    metrics[room.roomType].capacity = room.capacity;
  });

  // Calculate occupancy by room type
  activeBookings.forEach((booking) => {
    if (booking.serviceType === "room") {
      metrics[booking.roomType].occupied += booking.quantity;
    }
  });

  // Calculate rates
  ["master", "kids"].forEach((type) => {
    metrics[type].available = metrics[type].total - metrics[type].occupied;
    metrics[type].occupancyRate =
      (metrics[type].occupied / metrics[type].total) * 100;

    // Calculate capacity utilization based on actual people vs maximum capacity
    const maxCapacity = metrics[type].total * metrics[type].capacity;
    const actualOccupants = activeBookings
      .filter((b) => b.serviceType === "room" && b.roomType === type)
      .reduce((sum, b) => sum + b.quantity, 0);
    metrics[type].capacityUtilization = (actualOccupants / maxCapacity) * 100;
  });

  return metrics;
};

const calculateCampMetrics = async (camps, activeBookings) => {
  const totalCamps = camps.reduce((sum, camp) => sum + camp.totalCamps, 0);
  const occupiedCamps = activeBookings
    .filter((b) => b.serviceType === "camp")
    .reduce((sum, b) => sum + b.quantity, 0);

  const maxCapacity = camps.reduce(
    (sum, camp) => sum + camp.totalCamps * camp.capacity,
    0
  );
  const actualOccupants = activeBookings
    .filter((b) => b.serviceType === "camp")
    .reduce((sum, b) => sum + b.quantity, 0);

  return {
    total: totalCamps,
    occupied: occupiedCamps,
    available: totalCamps - occupiedCamps,
    occupancyRate: (occupiedCamps / totalCamps) * 100,
    capacityUtilization: (actualOccupants / maxCapacity) * 100,
  };
};

const calculateParkingMetrics = async (parkingSlots, activeBookings) => {
  const totalSlots = parkingSlots.reduce(
    (sum, slot) => sum + slot.totalSlots,
    0
  );
  const occupiedSlots = activeBookings
    .filter((b) => b.serviceType === "parking")
    .reduce((sum, b) => sum + b.quantity, 0);

  // Calculate amenity usage
  const amenityUsage = {
    electricity: 0,
    water: 0,
    sanitation: 0,
  };

  parkingSlots.forEach((slot) => {
    Object.keys(amenityUsage).forEach((amenity) => {
      if (slot.amenities[amenity]) {
        amenityUsage[amenity] += slot.totalSlots;
      }
    });
  });

  return {
    total: totalSlots,
    occupied: occupiedSlots,
    available: totalSlots - occupiedSlots,
    occupancyRate: (occupiedSlots / totalSlots) * 100,
    byAmenities: amenityUsage,
  };
};

exports.generateDashboardMetrics = async (req, res) => {
  try {
    const dateRanges = getDateRanges();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all necessary data
    const [rooms, camps, parkingSlots, messages, activeBookings, allBookings] =
      await Promise.all([
        Room.find(),
        Camp.find(),
        ParkingSlot.find(),
        Contact.find({ createdAt: { $gte: today } }),
        Booking.find({
          status: { $in: ["confirmed", "completed"] },
          checkOut: { $gte: today },
        }),
        Booking.find({ createdAt: { $gte: today } }),
      ]);

    // Calculate metrics
    const roomMetrics = await calculateRoomMetrics(rooms, activeBookings);
    const campMetrics = await calculateCampMetrics(camps, activeBookings);
    const parkingMetrics = await calculateParkingMetrics(
      parkingSlots,
      activeBookings
    );

    // Calculate average stay duration
    const stayDuration = {
      rooms: 0,
      camps: 0,
      parking: 0,
    };

    allBookings.forEach((booking) => {
      const duration = calculateStayDuration(booking.checkIn, booking.checkOut);
      stayDuration[booking.serviceType] += duration;
    });

    Object.keys(stayDuration).forEach((type) => {
      const bookingsOfType = allBookings.filter(
        (b) => b.serviceType === type
      ).length;
      stayDuration[type] = bookingsOfType
        ? stayDuration[type] / bookingsOfType
        : 0;
    });

    const metrics = {
      date: today,
      timePeriod: "daily",
      revenue: {
        total: await calculateRevenue(new Date(0)),
        byPeriod: {
          daily: await calculateRevenue(dateRanges.daily),
          weekly: await calculateRevenue(dateRanges.weekly),
          monthly: await calculateRevenue(dateRanges.monthly),
          yearly: await calculateRevenue(dateRanges.yearly),
        },
        byService: {
          rooms: {
            total: await calculateRevenue(new Date(0), { serviceType: "room" }),
            byType: {
              master: await calculateRevenue(new Date(0), {
                serviceType: "room",
                roomType: "master",
              }),
              kids: await calculateRevenue(new Date(0), {
                serviceType: "room",
                roomType: "kids",
              }),
            },
          },
          camps: await calculateRevenue(new Date(0), { serviceType: "camp" }),
          parking: await calculateRevenue(new Date(0), {
            serviceType: "parking",
          }),
        },
      },
      occupancy: {
        rooms: roomMetrics,
        camps: campMetrics,
        parking: parkingMetrics,
      },
      bookings: {
        total: allBookings.length,
        byService: {
          rooms: {
            total: allBookings.filter((b) => b.serviceType === "room").length,
            byType: {
              master: allBookings.filter(
                (b) => b.serviceType === "room" && b.roomType === "master"
              ).length,
              kids: allBookings.filter(
                (b) => b.serviceType === "room" && b.roomType === "kids"
              ).length,
            },
          },
          camps: allBookings.filter((b) => b.serviceType === "camp").length,
          parking: allBookings.filter((b) => b.serviceType === "parking")
            .length,
        },
        byStatus: {
          pending: allBookings.filter((b) => b.status === "pending").length,
          confirmed: allBookings.filter((b) => b.status === "confirmed").length,
          completed: allBookings.filter((b) => b.status === "completed").length,
          cancelled: allBookings.filter((b) => b.status === "cancelled").length,
        },
        byPaymentStatus: {
          pending: allBookings.filter((b) => b.paymentStatus === "pending")
            .length,
          completed: allBookings.filter((b) => b.paymentStatus === "completed")
            .length,
        },
        averageStayDuration: stayDuration,
      },
      customerService: {
        totalMessages: messages.length,
        unrepliedMessages: messages.filter((m) => !m.replied).length,
        responseRate: messages.length
          ? ((messages.length - messages.filter((m) => !m.replied).length) /
              messages.length) *
            100
          : 0,
      },
    };

    // Save metrics
    const dashboardMetrics = await DashboardMetrics.findOneAndUpdate(
      { date: today, timePeriod: "daily" },
      metrics,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: dashboardMetrics,
    });
  } catch (error) {
    console.error("Error generating dashboard metrics:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.getEarningsMetrics = async (req, res) => {
  try {
    const { startDate, endDate, serviceType } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (serviceType) {
      query.serviceType = serviceType;
    }

    query.paymentStatus = "completed";

    const earnings = await calculateEarnings(
      startDate ? new Date(startDate) : new Date(0),
      serviceType
    );

    res.status(200).json({
      success: true,
      data: {
        earnings,
        period: {
          start: startDate || "all time",
          end: endDate || "current",
        },
        serviceType: serviceType || "all services",
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getDashboardMetrics = async (req, res) => {
  try {
    const { timePeriod = "daily", startDate, endDate } = req.query;

    const query = { timePeriod };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const metrics = await DashboardMetrics.find(query)
      .sort({ date: -1 })
      .limit(30);

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
