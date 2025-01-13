import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Building2, Tent, Car, DollarSign, Users, Clock, Activity,
  TrendingUp, MessageCircle, Calendar, PercentIcon, RefreshCw
} from 'lucide-react';
import { generateDashboardMetrics, getDashboardMetrics } from '../../services/dashboardServices';

const AdminHome = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('daily');
  const [isGenerating, setIsGenerating] = useState(false);
  const COLORS = {
    master: '#4338ca',
    kids: '#15803d',
    camps: '#7e22ce',
    parking: '#ff7e1c',
    chart: ['#4338ca', '#15803d', '#7e22ce', '#ff7e1c']
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const metricsData = await getDashboardMetrics({ timePeriod: timeframe });
      setMetrics(metricsData.data[0]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = async () => {
    try {
      setIsGenerating(true);
      // Call generate metrics service
      await generateDashboardMetrics();
      // Fetch updated data
      await fetchData();
    } catch (error) {
      console.error('Error generating dashboard metrics:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading, please wait...</p>
        </div>
      </div>
    );
  }
  
  const ServiceCard = ({ title, icon: Icon, color, metrics, showTypeMetrics }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-opacity-10" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-6 h-6" style={{ color: color }} />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-xl font-bold text-gray-800">
            ${metrics.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
          <div>
            <p className="text-sm text-gray-500">Total Units</p>
            <p className="font-medium">{metrics.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Occupied</p>
            <p className="font-medium">{metrics.occupied}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Available</p>
            <p className="font-medium">{metrics.available}</p>
          </div>
        </div>

        {/* Type-specific metrics for rooms */}
        {showTypeMetrics && metrics.byType && (
          <div className="space-y-4">
            {/* Master Rooms */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Master Rooms</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{metrics.byType.master.total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupied</p>
                  <p className="font-medium">{metrics.byType.master.occupied}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="font-medium">{metrics.byType.master.available}</p>
                </div>
              </div>
            </div>

            {/* Kids Rooms */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Kids Rooms</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{metrics.byType.kids.total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupied</p>
                  <p className="font-medium">{metrics.byType.kids.occupied}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="font-medium">{metrics.byType.kids.available}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Average Stay Duration */}
        {metrics.averageStay && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Average Stay Duration</p>
            <p className="font-medium">{metrics.averageStay.toFixed(1)} days</p>
          </div>
        )}
      </div>
    </div>
  );

  const revenueData = Object.entries(metrics.revenue.byPeriod).map(([period, value]) => ({
    name: period.charAt(0).toUpperCase() + period.slice(1),
    value
  }));

  const bookingStatusData = Object.entries(metrics.bookings.byStatus).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">Track your business performance and insights</p>
        </div>
        <div className="flex flex-row-reverse items-center gap-4">
        <button
            onClick={handleReload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Reload Data'}
          </button>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>{new Date(metrics.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold">${metrics.revenue.total.toLocaleString()}</p>
          </div>
          {Object.entries(metrics.revenue.byPeriod).map(([period, amount]) => (
            <div key={period} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-1 capitalize">{period}</p>
              <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Rooms Card */}
        <ServiceCard 
          title="Rooms"
          icon={Building2}
          color={COLORS.master}
          metrics={{
            revenue: metrics.revenue.byService.rooms.total,
            total: metrics.occupancy.rooms.master.total + metrics.occupancy.rooms.kids.total,
            occupied: metrics.occupancy.rooms.master.occupied + metrics.occupancy.rooms.kids.occupied,
            available: metrics.occupancy.rooms.master.available + metrics.occupancy.rooms.kids.available,
            byType: {
              master: metrics.occupancy.rooms.master,
              kids: metrics.occupancy.rooms.kids
            }
          }}
          showTypeMetrics={true}
        />

        {/* Camps Card */}
        <ServiceCard 
          title="Camps"
          icon={Tent}
          color={COLORS.camps}
          metrics={{
            revenue: metrics.revenue.byService.camps,
            total: metrics.occupancy.camps.total,
            occupied: metrics.occupancy.camps.occupied,
            available: metrics.occupancy.camps.available
          }}
        />

        {/* Parking Card */}
        <ServiceCard 
          title="Parking"
          icon={Car}
          color={COLORS.parking}
          metrics={{
            revenue: metrics.revenue.byService.parking,
            total: metrics.occupancy.parking.total,
            occupied: metrics.occupancy.parking.occupied,
            available: metrics.occupancy.parking.available
          }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="value" stroke={COLORS.master} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Distribution */}
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

      {/* Customer Service Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Customer Service Overview</h3>
          <MessageCircle className="w-5 h-5 text-gray-500" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-1">Total Messages</p>
            <p className="text-2xl font-bold">{metrics.customerService.totalMessages}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-1">Pending Replies</p>
            <p className="text-2xl font-bold">{metrics.customerService.unrepliedMessages}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-1">Response Rate</p>
            <p className="text-2xl font-bold">{metrics.customerService.responseRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;