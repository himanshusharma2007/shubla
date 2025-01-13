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

// Helper function to calculate type-specific metrics
const calculateTypeMetrics = (
  items,
  activeBookings,
  serviceType,
  typeField
) => {
  const types = [...new Set(items.map((item) => item[typeField]))];
  const metrics = {};

  types.forEach((type) => {
    const typeItems = items.filter((item) => item[typeField] === type);
    const typeBookings = activeBookings.filter(
      (b) => b.serviceType === serviceType && b[typeField] === type
    );

    const total = typeItems.reduce(
      (sum, item) =>
        sum + item.totalRooms || item.totalCamps || item.totalSlots,
      0
    );
    const occupied = typeBookings.length;

    metrics[type] = {
      total,
      occupied,
      available: total - occupied,
      revenue: typeBookings.reduce((sum, b) => sum + b.totalAmount, 0),
    };
  });

  return metrics;
};

exports.generateDashboardMetrics = async (req, res) => {
  try {
    const dateRanges = getDateRanges();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate earnings
    const earnings = {
      total: await calculateEarnings(new Date(0)),
      periodic: {
        daily: await calculateEarnings(dateRanges.daily),
        weekly: await calculateEarnings(dateRanges.weekly),
        monthly: await calculateEarnings(dateRanges.monthly),
        yearly: await calculateEarnings(dateRanges.yearly),
      },
      byService: {
        rooms: {
          total: await calculateEarnings(new Date(0), "room"),
          daily: await calculateEarnings(dateRanges.daily, "room"),
          weekly: await calculateEarnings(dateRanges.weekly, "room"),
          monthly: await calculateEarnings(dateRanges.monthly, "room"),
        },
        camps: {
          total: await calculateEarnings(new Date(0), "camp"),
          daily: await calculateEarnings(dateRanges.daily, "camp"),
          weekly: await calculateEarnings(dateRanges.weekly, "camp"),
          monthly: await calculateEarnings(dateRanges.monthly, "camp"),
        },
        parking: {
          total: await calculateEarnings(new Date(0), "parking"),
          daily: await calculateEarnings(dateRanges.daily, "parking"),
          weekly: await calculateEarnings(dateRanges.weekly, "parking"),
          monthly: await calculateEarnings(dateRanges.monthly, "parking"),
        },
      },
    };

    // Get all relevant data
    const bookings = await Booking.find({
      createdAt: { $gte: today },
    });

    const rooms = await Room.find();
    const camps = await Camp.find();
    const parkingSlots = await ParkingSlot.find();
    const messages = await Contact.find({
      createdAt: { $gte: today },
    });

    // Calculate active bookings
    const activeBookings = await Booking.find({
      serviceType: { $in: ["room", "camp", "parking"] },
      roomType: { $exists: true },
      status: "confirmed",
      $and: [{ checkIn: { $lte: Date.now() } }, { checkOut: { $gte: Date.now() } }],
    });

    // Calculate type-specific metrics
    const roomTypeMetrics = calculateTypeMetrics(
      rooms,
      activeBookings,
      "room",
      "roomType"
    );
    const campTypeMetrics = calculateTypeMetrics(
      camps,
      activeBookings,
      "camp",
      "tentType"
    );

    // Calculate totals
    const totalRooms = rooms.reduce((sum, room) => sum + room.totalRooms, 0);
    const totalCamps = camps.reduce((sum, camp) => sum + camp.totalCamps, 0);
    const totalParkingSlots = parkingSlots.reduce(
      (sum, slot) => sum + slot.totalSlots,
      0
    );

    // Calculate occupied counts
    const occupiedRooms = activeBookings.filter(
      (b) => b.serviceType === "room"
    ).length;
    const occupiedCamps = activeBookings.filter(
      (b) => b.serviceType === "camp"
    ).length;
    const occupiedParkingSlots = activeBookings.filter(
      (b) => b.serviceType === "parking"
    ).length;
    console.log("activeBookings", activeBookings);
    console.log("occupiedCamps", occupiedCamps);
    const metrics = {
      totalRevenue: bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
      ),
      earnings,
      bookingMetrics: {
        totalBookings: bookings.length,
        serviceTypeDistribution: {
          rooms: bookings.filter((b) => b.serviceType === "room").length,
          camps: bookings.filter((b) => b.serviceType === "camp").length,
          parking: bookings.filter((b) => b.serviceType === "parking").length,
        },
        revenueByService: {
          rooms: bookings
            .filter((b) => b.serviceType === "room")
            .reduce((sum, b) => sum + b.totalAmount, 0),
          camps: bookings
            .filter((b) => b.serviceType === "camp")
            .reduce((sum, b) => sum + b.totalAmount, 0),
          parking: bookings
            .filter((b) => b.serviceType === "parking")
            .reduce((sum, b) => sum + b.totalAmount, 0),
        },
        bookingStatusCounts: {
          pending: bookings.filter((b) => b.status === "pending").length,
          confirmed: bookings.filter((b) => b.status === "confirmed").length,
          completed: bookings.filter((b) => b.status === "completed").length,
          cancelled: bookings.filter((b) => b.status === "cancelled").length,
        },
        paymentStatusCounts: {
          pending: bookings.filter((b) => b.paymentStatus === "pending").length,
          completed: bookings.filter((b) => b.paymentStatus === "completed")
            .length,
        },
      },
      roomMetrics: {
        totalRooms,
        availableRooms: totalRooms - occupiedRooms,
        occupiedRooms,
        byType: roomTypeMetrics,
        roomRevenue: bookings
          .filter((b) => b.serviceType === "room")
          .reduce((sum, b) => sum + b.totalAmount, 0),
        occupancyRate: this.totalRooms ? (occupiedRooms / totalRooms) * 100 : 0,
      },
      campMetrics: {
        totalCamps,
        availableCamps: totalCamps - camps.availableCamps,
        occupiedCamps,
        byType: campTypeMetrics,
        campRevenue: bookings
          .filter((b) => b.serviceType === "camp")
          .reduce((sum, b) => sum + b.totalAmount, 0),
        occupancyRate: totalCamps ? (occupiedCamps / totalCamps) * 100 : 0,
      },
      parkingMetrics: {
        totalSlots: totalParkingSlots,
        availableSlots: totalParkingSlots - occupiedParkingSlots,
        occupiedSlots: occupiedParkingSlots,
        parkingRevenue: bookings
          .filter((b) => b.serviceType === "parking")
          .reduce((sum, b) => sum + b.totalAmount, 0),
        occupancyRate: totalParkingSlots
          ? (occupiedParkingSlots / totalParkingSlots) * 100
          : 0,
      },
      customerServiceMetrics: {
        totalMessages: messages.length,
        unrepliedMessages: messages.filter((m) => !m.replied).length,
      },
      timePeriod: "daily",
      date: today,
      lastUpdated: new Date(),
    };

    // Save or update metrics
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
    console.log("error", error);
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
