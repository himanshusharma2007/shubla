import api from './api.js';

const roomsService = {
  updateOrCreateRoomsData: async (roomData) => {
    try {
      const response = await api.put('/rooms/update', roomData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRoomsData: async () => {
    try {
      const response = await api.get('/rooms');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default roomsService;

