import api from './api.js';

const imageService = {
  uploadGalleryImage: async (formData) => {
    try {
      const response = await api.post('/api/image/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllGalleryImages: async () => {
    try {
      const response = await api.get('/api/image/gallery');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadInstagramImage: async (formData) => {
    try {
      const response = await api.post('/api/image/instagram', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllInstagramImages: async () => {
    try {
      const response = await api.get('/api/image/instagram');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default imageService;

