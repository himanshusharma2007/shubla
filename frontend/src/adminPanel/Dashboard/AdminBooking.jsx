import React, { useState, useEffect } from "react";
import { getAllBookings } from "../../services/bookingService"; // Adjust the path to your service
import { FiLoader } from "react-icons/fi"; // Using Lucid React icons (FiLoader)
import { MdError } from "react-icons/md"; // For error icon

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all bookings on component mount
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

  useEffect(()=>{
    console.log('data booking', bookings)
  }, [])

  // Function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // Render loader, error, or table
  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <FiLoader className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center mt-10 text-red-500">
        <MdError className="text-4xl mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-5">All Bookings</h1>
      <div className="overflow-x-auto shadow-md border-b border-gray-200">
        <table className="min-w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-gray-600">Booking ID</th>
              <th className="px-6 py-3 text-gray-600">User</th>
              <th className="px-6 py-3 text-gray-600">Service Type</th>
              <th className="px-6 py-3 text-gray-600">Check-In</th>
              <th className="px-6 py-3 text-gray-600">Check-Out</th>
              <th className="px-6 py-3 text-gray-600">Quantity</th>
              <th className="px-6 py-3 text-gray-600">Total Amount</th>
              <th className="px-6 py-3 text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{booking._id}</td>
                <td className="px-6 py-4">{booking.user?.name || "N/A"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      booking.serviceType === "room"
                        ? "bg-blue-500 text-white"
                        : booking.serviceType === "camp"
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {booking.serviceType.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(booking.checkIn)}</td>
                <td className="px-6 py-4">{formatDate(booking.checkOut)}</td>
                <td className="px-6 py-4">{booking.quantity}</td>
                <td className="px-6 py-4">₹{booking.totalAmount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      booking.status === "pending"
                        ? "bg-orange-300 text-gray-800"
                        : booking.status === "completed"
                        ? "bg-green-500 text-white"
                        : booking.status === "cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooking;
