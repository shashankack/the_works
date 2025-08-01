import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { getToken } from "../utils/auth";

const PaymentPage = ({
  activity,
  price,
  selectedPack,
  selectedPackData,
  selectedSchedule,
  selectedAddons = [],
  selectedAddonDetails = [],
  onPaymentSuccess,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    if (!loading) {
      setOpenDialog(false);
      setTransactionId("");
      setError(null);
      setSuccess(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!transactionId.trim()) {
      setError("Please enter a valid transaction ID.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const accessToken = getToken("accessToken");

      if (!accessToken) {
        setError("Please log in to complete your booking.");
        setLoading(false);
        return;
      }

      // Determine if it's a class or event
      const isClass = activity.id.startsWith("class_");
      const isEvent = activity.id.startsWith("event_");

      // Prepare booking payload (matching backend schema)
      const bookingPayload = {
        classId: isClass ? activity.id : undefined,
        eventId: isEvent ? activity.id : undefined,
        classPackId: selectedPack || undefined, // Backend maps this to packId
        scheduleId: selectedSchedule || undefined, // Add schedule ID
        paymentId: transactionId,
        addonIds:
          selectedAddons && selectedAddons.length > 0
            ? selectedAddons
            : undefined, // Include addons in main request
      };

      // Remove undefined values
      Object.keys(bookingPayload).forEach(
        (key) => bookingPayload[key] === undefined && delete bookingPayload[key]
      );

      // console.log("Creating booking with payload:", bookingPayload);

      // Create the booking with addons in one call
      const bookingResponse = await axiosInstance.post(
        "/bookings", // Your base URL already includes /api
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const bookingId = bookingResponse.data.id;
      // console.log("Booking created with ID:", bookingId);
      // console.log("Addons attached:", bookingResponse.data.addonsAttached || 0);

      setSuccess(true);

      // Wait a moment to show success message
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess({
            bookingId,
            transactionId,
            activity,
            price,
            selectedAddons,
          });
        }
        setOpenDialog(false);
        setTransactionId("");
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Payment/Booking error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 400) {
        setError(
          err.response.data?.message ||
            "Invalid booking data. Please check your selection."
        );
      } else if (err.response?.status === 409) {
        setError("This activity is fully booked or no longer available.");
      } else {
        setError(
          "Failed to create booking. Please verify your transaction ID and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4} p={4} boxShadow={2} borderRadius={2}>
      <Typography variant="h5" mb={2}>
        Confirm your Payment
      </Typography>

      <Typography variant="h6" gutterBottom>
        {activity.title}
      </Typography>

      {/* Price Breakdown */}
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          mb: 2,
          bgcolor: "grey.50",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Booking Summary
        </Typography>

        {/* Pack Details */}
        {selectedPackData && (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">
              {selectedPackData.title} ({selectedPackData.classType})
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹{selectedPackData.price}
            </Typography>
          </Box>
        )}

        {/* Addon Details */}
        {selectedAddonDetails && selectedAddonDetails.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" mt={1} mb={1}>
              Add-ons:
            </Typography>
            {selectedAddonDetails.map((addon, index) => (
              <Box
                key={addon.id}
                display="flex"
                justifyContent="space-between"
                mb={0.5}
                ml={2}
              >
                <Typography variant="body2" color="text.secondary">
                  • {addon.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{addon.price}
                </Typography>
              </Box>
            ))}
          </>
        )}

        {/* Total */}
        <Box
          display="flex"
          justifyContent="space-between"
          mt={2}
          pt={1}
          borderTop={1}
          borderColor="divider"
        >
          <Typography variant="body1" fontWeight="bold">
            Total Amount:
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="primary">
            ₹{price}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" gutterBottom>
        Pay using UPI ID:
        <Box component="span" fontWeight={700} ml={1}>
          raghu@okupi
        </Box>
      </Typography>

      <Box
        sx={{
          width: 200,
          height: 200,
          bgcolor: "grey.300",
          borderRadius: 2,
          my: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "text.secondary",
        }}
      >
        QR Code Placeholder
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        After completing the payment, click "Pay" and enter your transaction ID
        to confirm your booking.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePayClick}
        fullWidth
        size="large"
      >
        Pay ₹{price}
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown={loading}
      >
        <DialogTitle>
          {success ? "Booking Confirmed!" : "Enter Transaction ID"}
        </DialogTitle>
        <DialogContent>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your booking has been successfully created! You will receive a
              confirmation shortly.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Please enter the transaction ID from your UPI payment to confirm
                your booking.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Transaction ID"
                placeholder="e.g., 123456789012"
                fullWidth
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                disabled={loading}
                variant="outlined"
              />
            </>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleDialogClose}
            disabled={loading}
            color="inherit"
          >
            {success ? "Close" : "Cancel"}
          </Button>
          {!success && (
            <Button
              onClick={handleConfirmPayment}
              variant="contained"
              color="primary"
              disabled={loading || !transactionId.trim()}
              size="large"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentPage;
