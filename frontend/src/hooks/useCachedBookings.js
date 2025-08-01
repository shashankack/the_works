import { useCachedApi } from "./useCachedApi";
import axiosInstance from "../api/axiosInstance";

export const useCachedBookings = (options = {}) => {
  const {
    ttl = 2 * 60 * 1000, // 2 minutes for more dynamic data
    immediate = true,
    ...restOptions
  } = options;

  const {
    data: bookings,
    loading,
    error,
    fetchData,
    refresh,
    updateCachedData,
    clearCache,
    isStale,
    isCached
  } = useCachedApi(
    'bookings',
    async () => {
      const response = await axiosInstance.get('/bookings');
      return response.data;
    },
    {
      ttl,
      immediate,
      ...restOptions
    }
  );

  return { 
    bookings: bookings || [], 
    loading, 
    error, 
    refetch: refresh,
    fetchBookings: fetchData,
    updateBookings: updateCachedData,
    clearBookingsCache: clearCache,
    isStale,
    isCached
  };
};

export default useCachedBookings;
