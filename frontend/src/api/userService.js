import axiosInstance from "./axiosInstance";
import { getToken } from "../utils/auth";

// Get current user profile
export const getCurrentUser = async () => {
  const accessToken = getToken("accessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await axiosInstance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export default {
  getCurrentUser,
};
