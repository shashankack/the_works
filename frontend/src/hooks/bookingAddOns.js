import { useState } from "react";

const useBookingAddOns = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Attach add-ons to a booking by bookingId
  // addonIds is an array of addon id strings
  const addAddonsToBooking = async (bookingId, addonIds) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/addons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header here if needed
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ addonIds }),
      });
      if (!res.ok) throw new Error("Failed to add add-ons to booking");
      setError(null);
      return true;
    } catch (e) {
      setError(e.message || "Unknown error");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addAddonsToBooking,
  };
};

export default useBookingAddOns;
