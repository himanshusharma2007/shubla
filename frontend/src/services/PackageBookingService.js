import api from "./api";


export const createPackageBooking = async (packageBookingData) => {
  console.log('package booking data', packageBookingData);
  try {
    const response = await api.post("/package-booking/new", packageBookingData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkPackageBookingAvailability = async (packageBookingData) => {
  console.log('package booking data', packageBookingData);
  try {
    const response = await api.post("/package-booking/new-check-availability", packageBookingData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserPackageBookings = async () => {
  try {
    const response = await api.get("/package-booking/bookings", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllPackageBookings = async () => {
  try {
    const response = await api.get("/package-booking/admin/bookings", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePackageBookingStatus = async (bookingId, statusData) => {
  try {
    const response = await api.put(`/package-booking/admin/${bookingId}`, statusData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};