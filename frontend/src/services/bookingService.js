import api from "../api";

/**
 * Create a new booking
 * @param {Object} bookingData - The booking details
 * @returns {Promise} - API response
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get the bookings of the currently logged-in user
 * @returns {Promise} - API response
 */
export const getUserBookings = async () => {
  try {
    const response = await api.get("/bookings/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all bookings (Admin only)
 * @returns {Promise} - API response
 */
export const getAllBookings = async () => {
  try {
    const response = await api.get("/bookings/admin");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update the booking status (Admin only)
 * @param {string} bookingId - The ID of the booking to update
 * @param {Object} statusData - The status update details
 * @returns {Promise} - API response
 */
export const updateBookingStatus = async (bookingId, statusData) => {
  try {
    const response = await api.put(`/bookings/admin/${bookingId}`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
