import api from './api.js';

const campsService = {
  // Create a new camp
  createCampData: async (campData) => {
    try {
      const response = await api.post('/camps/create', campData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create camp:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Failed to create camp';
    }
  },

  // Update an existing camp
  updateCampData: async (id, campData) => {
    try {
      const response = await api.put(`/camps/update/${id}`, campData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update camp:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Failed to update camp';
    }
  },

  // Fetch all camp data
  getCampsData: async () => {
    try {
      const response = await api.get('/camps', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch camps:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Failed to fetch camps';
    }
  }
};

export default campsService;
