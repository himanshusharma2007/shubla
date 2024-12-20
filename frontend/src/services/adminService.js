import api from './api.js';

const adminService = {
  registerAdmin: async (adminData) => {
    try {
      const response = await api.post('/api/admin/register', adminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  loginAdmin: async (credentials) => {
    try {
      const response = await api.post('/api/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/admin/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/api/admin/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAdminProfile: async () => {
    try {
      const response = await api.get('/api/admin/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default adminService;

