import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false,
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Only log errors, not successful responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(`API Error:`, error.response?.status, error.response?.data);
    return Promise.reject(error);
  },
);

export default api;
