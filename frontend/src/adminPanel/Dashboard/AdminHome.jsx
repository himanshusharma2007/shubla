import React, { useState } from 'react';

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

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hotel Management Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="font-medium">Admin</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Room Status</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{stats.occupiedRooms}/{stats.totalRooms}</div>
            <p className="text-xs text-gray-500">Rooms occupied</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Camp Status</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{stats.occupiedCamps}/{stats.totalCamps}</div>
            <p className="text-xs text-gray-500">Camps occupied</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Parking Status</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{stats.occupiedParking}/{stats.totalParking}</div>
            <p className="text-xs text-gray-500">Parking spots occupied</p>
          </div>
        </div>
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.rooms.map((room) => (
                    <tr key={room.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{room.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{room.guest}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.status === 'Occupied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{room.checkIn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{room.checkOut}</td>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.camps.map((camp) => (
                    <tr key={camp.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{camp.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{camp.guest}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          camp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{camp.startDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{camp.endDate}</td>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.parking.map((spot) => (
                    <tr key={spot.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{spot.spot}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{spot.vehicle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{spot.guest}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
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