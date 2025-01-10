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