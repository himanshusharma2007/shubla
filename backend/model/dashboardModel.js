const mongoose = require("mongoose");

const dashboardMetricsSchema = new mongoose.Schema({
  // Overall metrics
  totalRevenue: {
    type: Number,
    required: true,
    default: 0
  },

  // Earnings metrics
  earnings: {
    total: { type: Number, default: 0 },
    periodic: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      yearly: { type: Number, default: 0 }
    },
    byService: {
      rooms: {
        total: { type: Number, default: 0 },
        daily: { type: Number, default: 0 },
        weekly: { type: Number, default: 0 },
        monthly: { type: Number, default: 0 }
      },
      camps: {
        total: { type: Number, default: 0 },
        daily: { type: Number, default: 0 },
        weekly: { type: Number, default: 0 },
        monthly: { type: Number, default: 0 }
      },
      parking: {
        total: { type: Number, default: 0 },
        daily: { type: Number, default: 0 },
        weekly: { type: Number, default: 0 },
        monthly: { type: Number, default: 0 }
      }
    }
  },
  
  // Booking metrics
  bookingMetrics: {
    totalBookings: { type: Number, default: 0 },
    serviceTypeDistribution: {
      rooms: { type: Number, default: 0 },
      camps: { type: Number, default: 0 },
      parking: { type: Number, default: 0 }
    },
    revenueByService: {
      rooms: { type: Number, default: 0 },
      camps: { type: Number, default: 0 },
      parking: { type: Number, default: 0 }
    },
    bookingStatusCounts: {
      pending: { type: Number, default: 0 },
      confirmed: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 }
    },
    paymentStatusCounts: {
      pending: { type: Number, default: 0 },
      completed: { type: Number, default: 0 }
    }
  },

  // Room metrics
  roomMetrics: {
    totalRooms: { type: Number, default: 0 },
    availableRooms: { type: Number, default: 0 },
    occupiedRooms: { type: Number, default: 0 },
    roomTypeDistribution: {
      master: { type: Number, default: 0 },
      kids: { type: Number, default: 0 }
    },
    roomRevenue: { type: Number, default: 0 },
    occupancyRate: { type: Number, default: 0 }
  },

  // Camp metrics
  campMetrics: {
    totalCamps: { type: Number, default: 0 },
    availableCamps: { type: Number, default: 0 },
    occupiedCamps: { type: Number, default: 0 },
    campRevenue: { type: Number, default: 0 },
    occupancyRate: { type: Number, default: 0 }
  },

  // Parking metrics
  parkingMetrics: {
    totalSlots: { type: Number, default: 0 },
    availableSlots: { type: Number, default: 0 },
    occupiedSlots: { type: Number, default: 0 },
    parkingRevenue: { type: Number, default: 0 },
    occupancyRate: { type: Number, default: 0 }
  },

  // Customer service metrics
  customerServiceMetrics: {
    totalMessages: { type: Number, default: 0 },
    unrepliedMessages: { type: Number, default: 0 }
  },

  // Time period
  timePeriod: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  
  date: {
    type: Date,
    required: true
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DashboardMetrics", dashboardMetricsSchema);