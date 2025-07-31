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
  selectedSchedule,
  selectedAddons = [],
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
      const { accessToken } = getToken();

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
        classPackId: selectedPack || undefined, // Note: backend uses classPackId, not packId
        paymentId: transactionId,
      };

      // Remove undefined values
      Object.keys(bookingPayload).forEach(
        (key) => bookingPayload[key] === undefined && delete bookingPayload[key]
      );

      console.log("Creating booking with payload:", bookingPayload);

      // Create the booking
      const bookingResponse = await axiosInstance.post(
        "/api/bookings", // Note: backend uses /api/ prefix
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const bookingId = bookingResponse.data.id;
      console.log("Booking created with ID:", bookingId);

      // If there are selected add-ons, attach them to the booking
      if (selectedAddons && selectedAddons.length > 0) {
        console.log("Adding selected add-ons:", selectedAddons);
        
        await axiosInstance.post(
          `/api/bookings/${bookingId}/addons`, // Backend expects this format
          {
            addonIds: selectedAddons, // Backend expects array of addon IDs
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

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

      <Typography variant="body1" gutterBottom>
        Total Price: ₹{price}
      </Typography>

      {selectedAddons && selectedAddons.length > 0 && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Includes {selectedAddons.length} add-on
          {selectedAddons.length > 1 ? "s" : ""}
        </Typography>
      )}

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
