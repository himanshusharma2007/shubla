import React, { useState, useEffect } from "react";
import { getAllBookings } from "../../services/bookingService";
import { Loader2, AlertCircle, User, Calendar, CreditCard, Search, ArrowDown, Clock, Info } from "lucide-react";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search, sort and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data.bookings);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch bookings");
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  // Sort bookings
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort bookings
  const filteredAndSortedBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const matchesServiceType = serviceTypeFilter === "all" || booking.serviceType === serviceTypeFilter;
      
      return matchesSearch && matchesStatus && matchesServiceType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(a.checkIn) - new Date(b.checkIn);
          break;
        case "amount":
          comparison = a.totalAmount - b.totalAmount;
          break;
        case "name":
          comparison = (a.user?.name || "").localeCompare(b.user?.name || "");
          break;
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-800 font-medium">{error}</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Booking Management</h1>
          <div className="flex items-center text-blue-100 space-x-4">
            <span className="flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Total Bookings: {filteredAndSortedBookings.length}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Last Updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Search Box */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 
                group-hover:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  hover:border-blue-500 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none
                  hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Service Type Filter */}
            <div className="relative">
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none
                  hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all cursor-pointer"
              >
                <option value="all">All Services</option>
                <option value="camp">Camp</option>
                <option value="room">Room</option>
              </select>
              <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSort("date")}
                className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2
                  transition-all hover:bg-gray-50 border ${
                  sortField === "date" ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Date
                {sortField === "date" && (
                  <ArrowDown className={`w-4 h-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </button>
              <button
                onClick={() => handleSort("amount")}
                className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2
                  transition-all hover:bg-gray-50 border ${
                  sortField === "amount" ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Amount
                {sortField === "amount" && (
                  <ArrowDown className={`w-4 h-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="grid gap-6">
          {filteredAndSortedBookings.map((booking) => (
            <div key={booking._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
                hover:shadow-md transition-shadow duration-200">
              <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{booking.user?.name || "N/A"}</span>
                      <span className="text-sm text-gray-500 ml-2">({booking.user?.email})</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      Payment: {booking.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Service Details
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      booking.serviceType === "camp" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {booking.serviceType.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">× {booking.quantity}</span>
                  </div>
                  {booking.isPrivateBooking && (
                    <span className="inline-block px-3 py-1.5 text-sm font-medium bg-purple-100 text-purple-800 rounded-lg">
                      Private Booking
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Booking Period
                  </h3>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">{formatDate(booking.checkIn)}</div>
                    <div className="text-sm text-gray-400">to</div>
                    <div className="text-sm text-gray-900">{formatDate(booking.checkOut)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-gray-900">₹{booking.totalAmount}</div>
                    <div className="text-sm text-gray-600">Status: {booking.paymentInfo?.status}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;