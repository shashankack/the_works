import axiosInstance from "./axiosInstance";
import { getToken } from "../utils/auth";

// Get current user profile
export const getCurrentUser = async () => {
  console.log("getCurrentUser - Starting request");
  
  try {
    console.log("getCurrentUser - Making request to /auth/me");
    const response = await axiosInstance.get("/auth/me");
    
    console.log("getCurrentUser - Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("getCurrentUser - Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    throw error;
  }
};

// Get user details by ID (admin only)
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export default {
  getCurrentUser,
  getUserById,
};
