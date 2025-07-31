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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/token")
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {
            refreshToken: getToken("refreshToken"),
          }
        );

        const newAccessToken = refreshRes.data.accessToken;
        setToken(newAccessToken, getToken("refreshToken"));
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
