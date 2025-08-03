import { useState } from "react";
import { useCachedApi } from "./useCachedApi";
import axiosInstance from "../api/axiosInstance";

const useBookings = (options = {}) => {
  const {
    ttl = 2 * 60 * 1000, // 2 minutes for dynamic data
    immediate = true,
    adminMode = false,
    ...restOptions
  } = options;

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const cacheKey = adminMode ? 'bookings_admin' : 'bookings_user';
  const endpoint = adminMode ? '/bookings' : '/bookings/me';

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
    cacheKey,
    async () => {
      const response = await axiosInstance.get(endpoint);
      return response.data;
    },
    {
      ttl,
      immediate,
      ...restOptions
    }
  );

  // Create a new booking
  const createBooking = async (bookingData) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await axiosInstance.post('/bookings', bookingData);
      const newBooking = response.data;
      
      // Update cache with new booking
      const currentBookings = bookings || [];
      updateCachedData([...currentBookings, newBooking]);
      
      return newBooking;
    } catch (error) {
      setActionError(error.message || "Failed to create booking");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm a booking (admin only)
  const confirmBooking = async (id) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await axiosInstance.put(`/bookings/${id}/confirm`);
      
      // Update cache with confirmed booking
      const currentBookings = bookings || [];
      const updatedBookings = currentBookings.map(booking =>
        booking.id === id ? { ...booking, status: 'confirmed' } : booking
      );
      updateCachedData(updatedBookings);
      
      return response.data;
    } catch (error) {
      setActionError(error.message || "Failed to confirm booking");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel a booking (admin only)
  const cancelBooking = async (id) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await axiosInstance.put(`/bookings/${id}/cancel`);
      
      // Update cache with cancelled booking
      const currentBookings = bookings || [];
      const updatedBookings = currentBookings.map(booking =>
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      );
      updateCachedData(updatedBookings);
      
      return response.data;
    } catch (error) {
      setActionError(error.message || "Failed to cancel booking");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    bookings: bookings || [],
    loading,
    error,
    actionLoading,
    actionError,
    fetchData,
    refresh,
    createBooking,
    confirmBooking,
    cancelBooking,
    clearCache,
    isStale,
    isCached,
  };
};

export default useBookings;
