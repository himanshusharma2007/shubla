import React, { useState } from 'react';
import {  Tent, Car, Home, AlertCircle } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { createBooking } from './bookingService';
import RoomBookingForm from '../bookingForm/RoomBooking';
import CampBookingForm from '../bookingForm/CampBooking';
import ParkingBookingForm from '../bookingForm/ParkingBooking';

// Main Booking Container Component
const BookingContainer = ({ serviceType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const forms = {
    room: <RoomBookingForm onSubmit={handleBookingSubmit} />,
    camp: <CampBookingForm onSubmit={handleBookingSubmit} />,
    parking: <ParkingBookingForm onSubmit={handleBookingSubmit} />
  };

  async function handleBookingSubmit(bookingData) {
    try {
      setLoading(true);
      setError(null);
      const response = await createBooking({
        ...bookingData,
        serviceType
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'An error occurred during booking');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <BookingHeader serviceType={serviceType} />
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              Booking successful! You will receive a confirmation email shortly.
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            forms[serviceType]
          )}
        </div>
      </div>
    </div>
  );
};

// Booking Header Component
const BookingHeader = ({ serviceType }) => {
  const icons = {
    room: Home,
    camp: Tent,
    parking: Car
  };
  const Icon = icons[serviceType];
  const titles = {
    room: 'Room Booking',
    camp: 'Camp Booking',
    parking: 'Parking Booking'
  };

  return (
    <div className="mb-8 text-center">
      <div className="flex justify-center mb-4">
        <Icon className="w-12 h-12 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{titles[serviceType]}</h1>
      <p className="mt-2 text-gray-600">Complete the form below to make your reservation</p>
    </div>
  );
};

export default BookingContainer;