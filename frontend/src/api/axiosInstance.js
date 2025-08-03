import axios from "axios";
import { getToken, setToken } from "../utils/auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto-refresh access token
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Only handle token refresh for authenticated requests
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/") &&
      getToken("accessToken") // Only try refresh if we actually have a token
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getToken("refreshToken");
        
        if (!refreshToken) {
          // No refresh token available, clear storage and don't redirect
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return Promise.reject(error);
        }

        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        const newAccessToken = refreshRes.data.accessToken;
        setToken(newAccessToken, refreshToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        // Clear tokens
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Only redirect if we're in an admin context
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
          window.location.href = "/admin/login";
        }
        // For public routes, don't redirect - let the UI handle it
        
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
