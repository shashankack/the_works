import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Alert, CircularProgress } from "@mui/material";
import PaymentPage from "./PaymentPage";
import { isAuthenticated } from "../utils/auth";

const PaymentPageWrapper = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get booking data from sessionStorage
    const storedData = sessionStorage.getItem('bookingData');
    if (!storedData) {
      navigate('/');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setBookingData(data);
    } catch (error) {
      console.error("Failed to parse booking data:", error);
      navigate('/');
      return;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handlePaymentSuccess = (paymentData) => {
    console.log("Payment successful:", paymentData);
    
    // Clear booking data from storage
    sessionStorage.removeItem('bookingData');
    
    // Navigate to success page or home
    navigate('/', { 
      state: { 
        message: "Booking confirmed successfully!" 
      } 
    });
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!bookingData) {
    return (
      <Box p={4}>
        <Alert severity="error">
          No booking data found. Please go back and try again.
        </Alert>
      </Box>
    );
  }

  return (
    <PaymentPage
      activity={bookingData.activity}
      price={bookingData.totalPrice}
      selectedPack={bookingData.selectedPack}
      selectedSchedule={bookingData.selectedSchedule}
      selectedAddons={bookingData.selectedAddons}
      onPaymentSuccess={handlePaymentSuccess}
    />
  );
};

export default PaymentPageWrapper;
