import api from "./api.js";

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUser: async () => {
    try {
      const response = await api.get("/auth/get-user", {
        withCredentials: true,
      });
      console.log("response in get user ", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
