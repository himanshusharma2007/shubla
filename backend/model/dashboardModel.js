const mongoose = require("mongoose");

const dashboardMetricsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timePeriod: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true,
  },
  revenue: {
    total: Number,
    byPeriod: {
      daily: Number,
      weekly: Number,
      monthly: Number,
      yearly: Number
    },
    byService: {
      rooms: {
        total: Number,
        byType: {
          master: Number,
          kids: Number
        }
      },
      camps: Number,
      parking: Number
    }
  },
  occupancy: {
    rooms: {
      master: {
        total: Number,
        occupied: Number,
        available: Number,
        occupancyRate: Number,
        capacityUtilization: Number
      },
      kids: {
        total: Number,
        occupied: Number,
        available: Number,
        occupancyRate: Number,
        capacityUtilization: Number
      }
    },
    camps: {
      total: Number,
      occupied: Number,
      available: Number,
      occupancyRate: Number,
      capacityUtilization: Number
    },
    parking: {
      total: Number,
      occupied: Number,
      available: Number,
      occupancyRate: Number,
      byAmenities: {
        electricity: Number,
        water: Number,
        sanitation: Number
      }
    }
  },
  bookings: {
    total: Number,
    byService: {
      rooms: {
        total: Number,
        byType: {
          master: Number,
          kids: Number
        }
      },
      camps: Number,
      parking: Number
    },
    byStatus: {
      pending: Number,
      confirmed: Number,
      completed: Number,
      cancelled: Number
    },
    byPaymentStatus: {
      pending: Number,
      completed: Number
    },
    averageStayDuration: {
      rooms: Number,
      camps: Number,
      parking: Number
    }
  },
  customerService: {
    totalMessages: Number,
    unrepliedMessages: Number,
    responseRate: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("DashboardMetrics", dashboardMetricsSchema);
