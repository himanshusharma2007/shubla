import api from './api.js';

const roomsService = {
  // Create a new room
  createRoomData: async (roomData) => {
    try {
      const response = await api.post('/rooms/create', roomData);
      return response.data;
    } catch (error) {
      console.error('Failed to create room:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Failed to create room';
    }
  },

  // Update an existing room
  updateRoomData: async (id, roomData) => {
    try {
      const response = await api.put(`/rooms/update/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error('Failed to update room:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Failed to update room';
    }
  },

  // Fetch all room data
  getRoomsData: async () => {
    try {
      const response = await api.get('/rooms');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch rooms:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Failed to fetch rooms';
    }
  }
};

export default roomsService;
