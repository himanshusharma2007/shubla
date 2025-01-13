import React, { useState } from 'react'
import Nav from '../Nav/Nav'


function Mybooking() {
    const [activeTab, setActiveTab] = useState("Upcoming");

    const tabs = ["Upcoming", "Pending", "Past", "Cancelled"];

    const bookingsData = {
        Upcoming: [
          {
            id: "B12345",
            type: "Hotel Room",
            date: "2025-01-07",
            checkIn: "2025-01-10",
            checkOut: "2025-01-15",
            amount: 200,
            status: "Paid",
          },
          {
            id: "B12346",
            type: "Deluxe Room",
            date: "2025-01-08",
            checkIn: "2025-01-12",
            checkOut: "2025-01-16",
            amount: 350,
            status: "Not Paid",
          },
        ],
        Pending: [
          {
            id: "B12347",
            type: "Suite",
            date: "2025-01-06",
            checkIn: "2025-01-11",
            checkOut: "2025-01-13",
            amount: 500,
            status: "Pending",
          },
        ],
        Past: [
          {
            id: "B12348",
            type: "Standard Room",
            date: "2024-12-30",
            checkIn: "2025-01-01",
            checkOut: "2025-01-05",
            amount: 150,
            status: "Paid",
          },
        ],
        Cancelled: [
          {
            id: "B12349",
            type: "Single Room",
            date: "2025-01-03",
            checkIn: "2025-01-05",
            checkOut: "2025-01-07",
            amount: 100,
            status: "Cancelled",
          },
        ],
      };
      
  return (
    <>
        <Nav/>
        <div className='w-full mt-20 pt-10 pl-20 pr-20 '>
            <h1 className='text-2xl font-bold'>My Bookings</h1>
            <p className='text-sm text-gray-700'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae ipsum enim maiores dolor nostrum </p>

            <div className="max-w-full mt-10">
                <div className="border-b-2 border-gray-200">
    <div className="flex overflow-x-auto space-x-4 sm:justify-center">
        {tabs.map((tab) => (
        <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeTab === tab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
        >
            {tab}
        </button>
        ))}
    </div>
                </div>

                <div className="mt-6">
                    {bookingsData[activeTab].length > 0 ? (
                    <ul>
                        {bookingsData[activeTab].map((booking, index) => (
                            <div key={index} className="max-w-full mt-5 mx-auto p-4 bg-white shadow-md rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {booking.type}
                            </h3>
                            <span
                                className={`text-sm font-medium px-3 py-1 rounded-full ${
                                booking.status === "Paid"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                            >
                                {booking.status}
                            </span>
                            </div>
                            <div className="mt-3">
                            <p className="text-sm text-gray-500">
                                <strong>Booking ID:</strong> {booking.id}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Booking Date:</strong> {booking.date}
                            </p>
                            </div>
                            <div className="mt-4 flex justify-between text-sm text-gray-700">
                            <div>
                                <p>
                                <strong>Check-in:</strong> {booking.checkIn}
                                </p>
                                <p>
                                <strong>Check-out:</strong> {booking.checkOut}
                                </p>
                            </div>
                            <div className="text-right">
                                <p>
                                <strong>Amount:</strong> ${booking.amount}
                                </p>
                            </div>
                            </div>
                            </div>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-gray-500">No bookings available.</p>
                    )}
                </div>
            </div>
        </div>
    </>
   
  )
}

export default Mybooking
