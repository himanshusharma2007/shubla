import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Building2, Tent, Car } from 'lucide-react';

const AdminHome = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [bookings] = useState({
    rooms: [
      { id: 1, type: 'Deluxe', guest: 'John Doe', status: 'Occupied', checkIn: '2025-01-06', checkOut: '2025-01-08' },
      { id: 2, type: 'Suite', guest: 'Jane Smith', status: 'Reserved', checkIn: '2025-01-10', checkOut: '2025-01-15' },
    ],
    camps: [
      { id: 1, location: 'Riverside', guest: 'Mike Johnson', status: 'Active', startDate: '2025-01-06', endDate: '2025-01-09' },
      { id: 2, location: 'Mountain View', guest: 'Sarah Wilson', status: 'Reserved', startDate: '2025-01-12', endDate: '2025-01-14' },
    ],
    parking: [
      { id: 1, spot: 'A1', vehicle: 'ABC123', guest: 'Robert Brown', status: 'Occupied' },
      { id: 2, spot: 'B2', vehicle: 'XYZ789', guest: 'Emma Davis', status: 'Reserved' },
    ]
  });

  const stats = {
    totalRooms: 50,
    occupiedRooms: 35,
    totalCamps: 20,
    occupiedCamps: 12,
    totalParking: 100,
    occupiedParking: 75,
  };

  const occupancyData = [
    {
      name: 'Rooms',
      occupied: stats.occupiedRooms,
      total: stats.totalRooms,
      percentage: (stats.occupiedRooms / stats.totalRooms) * 100
    },
    {
      name: 'Camps',
      occupied: stats.occupiedCamps,
      total: stats.totalCamps,
      percentage: (stats.occupiedCamps / stats.totalCamps) * 100
    },
    {
      name: 'Parking',
      occupied: stats.occupiedParking,
      total: stats.totalParking,
      percentage: (stats.occupiedParking / stats.totalParking) * 100
    }
  ];

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <h1 className="text-3xl font-semibold text-gray-700">Hotel Management Dashboard</h1>
        <div className="text-gray-500">Admin Portal</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Room Status', value: stats.occupiedRooms, total: stats.totalRooms, color: 'blue', icon: Building2 },
          { title: 'Camp Status', value: stats.occupiedCamps, total: stats.totalCamps, color: 'green', icon: Tent },
          { title: 'Parking Status', value: stats.occupiedParking, total: stats.totalParking, color: 'purple', icon: Car },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">{item.title}</h3>
              <item.icon size={32} className={`text-${item.color}-500`} />
            </div>
            <div className="mt-4">
              <div className={`text-4xl font-semibold text-${item.color}-600`}>
                {item.value}/{item.total}
              </div>
              <p className="text-sm text-gray-500 mt-2">Occupied</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className={`bg-${item.color}-600 h-3 rounded-full`}
                  style={{ width: `${(item.value / item.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Occupancy Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="percentage" fill="#4F46E5" name="Occupancy %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            {['rooms', 'camps', 'parking'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'rooms' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 uppercase">Room Type</th>
                    <th className="px-4 py-2 text-left text-gray-500 uppercase">Guest</th>
                    <th className="px-4 py-2 text-left text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-gray-500 uppercase">Check In</th>
                    <th className="px-4 py-2 text-left text-gray-500 uppercase">Check Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{room.type}</td>
                      <td className="px-4 py-2">{room.guest}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            room.status === 'Occupied'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{room.checkIn}</td>
                      <td className="px-4 py-2">{room.checkOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'camps' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Start Date</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">End Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.camps.map((camp) => (
                    <tr key={camp.id} className="hover:bg-gray-50">
                      <td className="px-8 py-4 text-base">{camp.location}</td>
                      <td className="px-8 py-4 text-base">{camp.guest}</td>
                      <td className="px-8 py-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          camp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-base">{camp.startDate}</td>
                      <td className="px-8 py-4 text-base">{camp.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'parking' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Spot</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Vehicle</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.parking.map((spot) => (
                    <tr key={spot.id} className="hover:bg-gray-50">
                      <td className="px-8 py-4 text-base">{spot.spot}</td>
                      <td className="px-8 py-4 text-base">{spot.vehicle}</td>
                      <td className="px-8 py-4 text-base">{spot.guest}</td>
                      <td className="px-8 py-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          spot.status === 'Occupied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {spot.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;