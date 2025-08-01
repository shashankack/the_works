import { useState, useEffect } from "react";

const API_URL = "/bookings";

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bookings for current user
  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: {
          // Add Authorization header if needed
          // "Authorization": `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
      setError(null);
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  // bookingData should include: classId or eventId or packId, scheduleId, paymentId, etc
  const createBooking = async (bookingData) => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if needed
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) throw new Error("Failed to create booking");
      const newBooking = await res.json();
      setBookings((prev) => [...prev, newBooking]);
      setError(null);
      return newBooking;
    } catch (e) {
      setError(e.message || "Unknown error");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Confirm a booking (admin only)
  const confirmBooking = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}/confirm`, {
        method: "PUT",
        headers: {
          // "Authorization": `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error("Failed to confirm booking");
      setError(null);
      return true;
    } catch (e) {
      setError(e.message || "Unknown error");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking (admin only)
  const cancelBooking = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}/cancel`, {
        method: "PUT",
        headers: {
          // "Authorization": `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      setError(null);
      return true;
    } catch (e) {
      setError(e.message || "Unknown error");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchMyBookings,
    createBooking,
    confirmBooking,
    cancelBooking,
  };
};

export default useBookings;
