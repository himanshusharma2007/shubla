import api from './api.js';

const paymentService = {
  // Create a new room
  stripeapikey: async () => {
    try {
      const response = await api.get('/payment/stripeapikey');
      return response.data;
    } catch (error) {
      console.error('Failed to create room:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Failed to payment key';
    }
  },
  processPayment: async (amount) => {
    try {
      const response = await api.post('/payment/process', {amount} , {
        "Content-Type": "application/json",
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create room:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Failed to payment key';
    }
  }

};

export default paymentService;
