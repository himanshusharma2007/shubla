import api from './api.js';

const adminService = {
  registerAdmin: async (adminData) => {
    try {
      const response = await api.post('/admin/register', adminData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  loginAdmin: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logOutAdmin: async (credentials) => {
    try {
      const response = await api.get('/admin/logout', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/admin/forgot-password', { email }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/admin/reset-password', resetData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAdminProfile: async () => {
    try {
      const response = await api.get('/admin/profile', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default adminService;

