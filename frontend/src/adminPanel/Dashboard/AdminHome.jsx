import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Building2, Tent, Car, DollarSign, Users, Clock, Activity,
  TrendingUp, MessageCircle, Calendar
} from 'lucide-react';
import { generateDashboardMetrics, getDashboardMetrics, getEarningsMetrics } from '../../services/dashboardServices';

const AdminHome = () => {
  const [metrics, setMetrics] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('daily');

  const COLORS = {
    rooms: '#4338ca',
    camps: '#15803d',
    parking: '#7e22ce',
    chart: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsData, earningsData] = await Promise.all([
          getDashboardMetrics({ timePeriod: timeframe }),
          getEarningsMetrics()
        ]);
        setMetrics(metricsData.data[0]);
        setEarnings(earningsData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Activity className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const serviceCards = [
    {
      title: 'Rooms',
      icon: Building2,
      color: COLORS.rooms,
      metrics: {
        total: metrics.roomMetrics.totalRooms,
        available: metrics.roomMetrics.availableRooms,
        occupied: metrics.roomMetrics.occupiedRooms,
        revenue: metrics.roomMetrics.roomRevenue,
        occupancyRate: metrics.roomMetrics.occupancyRate,
        typeMetrics: metrics.roomMetrics.byType
      }
    },
    {
      title: 'Camps',
      icon: Tent,
      color: COLORS.camps,
      metrics: {
        total: metrics.campMetrics.totalCamps,
        available: metrics.campMetrics.availableCamps,
        occupied: metrics.campMetrics.occupiedCamps,
        revenue: metrics.campMetrics.campRevenue,
        occupancyRate: metrics.campMetrics.occupancyRate,
        typeMetrics: metrics.campMetrics.byType
      }
    },
    {
      title: 'Parking',
      icon: Car,
      color: COLORS.parking,
      metrics: {
        total: metrics.parkingMetrics.totalSlots,
        available: metrics.parkingMetrics.availableSlots,
        occupied: metrics.parkingMetrics.occupiedSlots,
        revenue: metrics.parkingMetrics.parkingRevenue,
        occupancyRate: metrics.parkingMetrics.occupancyRate
      }
    }
  ];

  const bookingStatusData = [
    { name: 'Pending', value: metrics.bookingMetrics.bookingStatusCounts.pending },
    { name: 'Confirmed', value: metrics.bookingMetrics.bookingStatusCounts.confirmed },
    { name: 'Completed', value: metrics.bookingMetrics.bookingStatusCounts.completed },
    { name: 'Cancelled', value: metrics.bookingMetrics.bookingStatusCounts.cancelled }
  ];

  const earningsData = [
    {
      name: 'Daily',
      rooms: metrics.earnings.byService.rooms.daily,
      camps: metrics.earnings.byService.camps.daily,
      parking: metrics.earnings.byService.parking.daily
    },
    {
      name: 'Weekly',
      rooms: metrics.earnings.byService.rooms.weekly,
      camps: metrics.earnings.byService.camps.weekly,
      parking: metrics.earnings.byService.parking.weekly
    },
    {
      name: 'Monthly',
      rooms: metrics.earnings.byService.rooms.monthly,
      camps: metrics.earnings.byService.camps.monthly,
      parking: metrics.earnings.byService.parking.monthly
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="px-4 py-2 border rounded-lg bg-white shadow-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {serviceCards.map((service, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${service.color}20` }}>
                  <service.icon 
                    className="w-6 h-6"
                    style={{ color: service.color }}
                  />
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold text-gray-800">
                  ${service.metrics.revenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Occupancy Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Occupancy</span>
                  <span className="font-medium">
                    {service.metrics.occupied}/{service.metrics.total} 
                    ({service.metrics.occupancyRate.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{ 
                      width: `${service.metrics.occupancyRate}%`,
                      backgroundColor: service.color
                    }}
                  />
                </div>
              </div>

              {/* Type-specific stats if available */}
              {service.metrics.typeMetrics && Object.entries(service.metrics.typeMetrics).map(([type, data]) => (
                <div key={type} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium capitalize mb-2">{type}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-medium">{data.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Available</p>
                      <p className="font-medium">{data.available}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-medium">${data.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Earnings Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Earnings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{ background: '#fff', border: '1px solid #f0f0f0' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rooms" 
                stroke={COLORS.rooms} 
                name="Rooms"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="camps" 
                stroke={COLORS.camps} 
                name="Camps"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="parking" 
                stroke={COLORS.parking} 
                name="Parking"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Customer Service Overview</h3>
          <MessageCircle className="w-5 h-5 text-gray-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-1">Total Messages</p>
            <p className="text-2xl font-bold">
              {metrics.customerServiceMetrics.totalMessages}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-1">Pending Replies</p>
            <p className="text-2xl font-bold">
              {metrics.customerServiceMetrics.unrepliedMessages}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;