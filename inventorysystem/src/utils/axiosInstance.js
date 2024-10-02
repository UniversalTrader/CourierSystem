// utils/axiosInstance.js
import axios from "axios";

// Axios instance banate hain
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // tumhare API ka base URL
});

// Axios instance ko token add karne wala interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
