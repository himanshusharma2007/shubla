// DashboardServices.js
import api from './api'; // Import your Axios instance

/**
 * Service to generate or update dashboard metrics.
 * @param {Object} metricsData - The data for generating/updating metrics.
 * @returns {Promise} - The API response.
 */
export const generateDashboardMetrics = async (metricsData) => {
  try {
    const response = await api.post('/admin/dashboard/metrics', metricsData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};

/**
 * Service to fetch dashboard metrics.
 * @returns {Promise} - The API response.
 */
export const getDashboardMetrics = async () => {
  try {
    const response = await api.get('/admin/dashboard/metrics');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};

/**
 * Service to fetch earnings metrics.
 * @returns {Promise} - The API response.
 */
export const getEarningsMetrics = async () => {
  try {
    const response = await api.get('/admin/dashboard/earnings');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};
