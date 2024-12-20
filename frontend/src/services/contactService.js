import api from './api.js';

const contactService = {
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/api/contact', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllMessages: async () => {
    try {
      const response = await api.get('/api/contact/get-messages');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default contactService;

