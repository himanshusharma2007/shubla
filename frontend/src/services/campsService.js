import api from './api.js';

const campsService = {
  updateOrCreateCampsData: async (campData) => {
    try {
      const response = await api.put('/camps/update', campData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCampsData: async () => {
    try {
      const response = await api.get('/camps');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default campsService;

