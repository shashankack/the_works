import React, { useState } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
  TableContainer,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { useBookings } from "../../hooks/useBookings";

const BookingsManager = () => {
  const {
    bookings,
    loading,
    error,
    fetchMyBookings,
    confirmBooking,
    cancelBooking,
  } = useBookings();

  const handleConfirm = async (id) => {
    try {
      await confirmBooking(id);
      fetchMyBookings();
    } catch {}
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id);
        fetchMyBookings();
      } catch {}
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight="bold">
          Bookings
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : bookings.length === 0 ? (
        <Alert severity="info">No bookings made yet.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 600 }}>Booking ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => {
                const type = booking.classId
                  ? "Class"
                  : booking.eventId
                  ? "Event"
                  : booking.packId
                  ? "Pack"
                  : "N/A";
                return (
                  <TableRow key={booking.id} hover>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={
                          booking.status === "confirmed"
                            ? "success"
                            : booking.status === "cancelled"
                            ? "error"
                            : "default"
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(booking.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {booking.status === "pending" && (
                        <>
                          <Tooltip title="Confirm Booking">
                            <IconButton
                              onClick={() => handleConfirm(booking.id)}
                              size="small"
                              color="primary"
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel Booking">
                            <IconButton
                              onClick={() => handleCancel(booking.id)}
                              size="small"
                              color="error"
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BookingsManager;
