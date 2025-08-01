import React, { useState, useEffect } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Box,
  Typography,
  Paper,
  Container,
  Chip,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Visibility,
  Person,
  Event,
  FitnessCenter,
  Payment,
  Schedule,
  Add,
  Phone,
  Email,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import { useUsers } from "../../hooks/useUsers";
import { useClasses } from "../../hooks/useClasses";
import useClassPacks from "../../hooks/useClassPacks";
import { useEvents } from "../../hooks/useEvents";

const BookingsManagePage = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Use custom hooks
  const { users, fetchUser } = useUsers();
  const { classes } = useClasses();
  const { packs } = useClassPacks();
  const { events } = useEvents();

  // Helper functions to get detailed information
  const getUserDetails = (userId) => {
    return users[userId] || null;
  };

  const getClassDetails = (classId) => {
    return classes.find((cls) => cls.id === classId) || null;
  };

  const getPackDetails = (packId) => {
    return packs.find((pack) => pack.id === packId) || null;
  };

  const getEventDetails = (eventId) => {
    return events.find((event) => event.id === eventId) || null;
  };

  // Fetch user details for all bookings when bookings change
  useEffect(() => {
    const uniqueUserIds = [
      ...new Set(bookings.map((booking) => booking.userId)),
    ];
    uniqueUserIds.forEach((userId) => {
      if (!users[userId]) {
        fetchUser(userId);
      }
    });
  }, [bookings]); // Only depend on bookings, not users or fetchUser

  // Fetch all bookings (admin only)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken("accessToken");
      const response = await axiosInstance.get("/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings by status
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBookingAction = async (bookingId, action) => {
    setActionLoading(true);
    setActionError(null);

    try {
      const token = getToken("accessToken");
      await axiosInstance.put(
        `/bookings/${bookingId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh bookings list
      await fetchBookings();
      setDetailsOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      setActionError(
        err.response?.data?.error || `Failed to ${action} booking`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
    setActionError(null);
  };

  const BookingCard = ({ booking, showActions = false }) => {
    const userDetails = getUserDetails(booking.userId);
    const classDetails = getClassDetails(booking.classId);
    const eventDetails = getEventDetails(booking.eventId);

    return (
      <Card
        sx={{
          mb: 3,
          border:
            booking.status === "pending" ? `3px solid #ff9800` : `1px solid`,
          borderColor:
            booking.status === "pending" ? "#ff9800" : "background.default",
          backgroundColor:
            booking.status === "pending" ? "rgba(255, 152, 0, 0.08)" : "white",
          borderRadius: 3,
          boxShadow:
            booking.status === "pending"
              ? "0 8px 25px rgba(255, 152, 0, 0.15)"
              : "0 4px 12px rgba(78, 41, 22, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              booking.status === "pending"
                ? "0 12px 35px rgba(255, 152, 0, 0.25)"
                : "0 8px 25px rgba(78, 41, 22, 0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.white",
                    }}
                  >
                    <Person fontSize="small" />
                  </Box>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        fontSize: "18px",
                      }}
                    >
                      #{booking.id.slice(-8)}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: "14px" }}
                    >
                      {formatDate(booking.createdAt)}
                    </Typography>
                  </Box>
                </Stack>

                {/* User Details */}
                {userDetails ? (
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      backgroundColor: "rgba(177, 83, 36, 0.15)",
                      border: "2px solid rgba(177, 83, 36, 0.3)",
                      boxShadow: "0 4px 12px rgba(177, 83, 36, 0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ fontSize: "16px", mb: 1.5 }}
                    >
                      {userDetails.firstName} {userDetails.lastName}
                    </Typography>
                    {userDetails.phone && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mt: 1 }}
                      >
                        <Phone
                          fontSize="small"
                          sx={{ color: "primary.main", fontSize: "18px" }}
                        />
                        <Typography
                          component="a"
                          href={`tel:${userDetails.phone}`}
                          variant="body2"
                          sx={{ 
                            fontSize: "13px",
                            color: "primary.main",
                            fontWeight: "medium",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                              color: "secondary.main",
                            },
                          }}
                        >
                          {userDetails.phone}
                        </Typography>
                      </Stack>
                    )}
                    {userDetails.email && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mt: 1 }}
                      >
                        <Email
                          fontSize="small"
                          sx={{ color: "primary.main", fontSize: "18px" }}
                        />
                        <Typography
                          component="a"
                          href={`mailto:${userDetails.email}`}
                          variant="body2"
                          sx={{ 
                            fontSize: "13px",
                            color: "primary.main",
                            fontWeight: "medium",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                              color: "secondary.main",
                            },
                          }}
                          noWrap
                        >
                          {userDetails.email}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(177, 83, 36, 0.1)",
                      border: "1px solid rgba(177, 83, 36, 0.2)",
                    }}
                  >
                    <CircularProgress
                      size={16}
                      sx={{ color: "primary.main" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "12px", ml: 1 }}
                    >
                      Loading user...
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: booking.classId
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(156, 39, 176, 0.1)",
                  border: booking.classId
                    ? "1px solid rgba(76, 175, 80, 0.3)"
                    : "1px solid rgba(156, 39, 176, 0.3)",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {booking.classId ? (
                    <FitnessCenter
                      fontSize="small"
                      sx={{ color: "success.main" }}
                    />
                  ) : (
                    <Event fontSize="small" sx={{ color: "secondary.main" }} />
                  )}
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ fontSize: "14px" }}
                    >
                      {booking.classId ? "Class" : "Event"}
                    </Typography>
                    {booking.classId && classDetails && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "12px" }}
                      >
                        {classDetails.name}
                      </Typography>
                    )}
                    {booking.eventId && eventDetails && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "12px" }}
                      >
                        {eventDetails.title}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={2}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Payment fontSize="small" sx={{ color: "info.main" }} />
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    noWrap
                    sx={{ fontSize: "14px" }}
                  >
                    {booking.paymentId
                      ? booking.paymentId.slice(-8)
                      : "No payment"}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={2}>
              <Chip
                label={
                  booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)
                }
                color={getStatusColor(booking.status)}
                size="large"
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  height: 40,
                  borderRadius: 3,
                  minWidth: 100,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => openBookingDetails(booking)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "medium",
                  }}
                >
                  Details
                </Button>

                {showActions && booking.status === "pending" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleBookingAction(booking.id, "confirm")}
                      disabled={actionLoading}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                        "&:hover": {
                          boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
                        },
                      }}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleBookingAction(booking.id, "cancel")}
                      disabled={actionLoading}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                        "&:hover": {
                          boxShadow: "0 6px 16px rgba(244, 67, 54, 0.4)",
                        },
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const BookingDetailsDialog = () => {
    const userDetails = selectedBooking
      ? getUserDetails(selectedBooking.userId)
      : null;
    const classDetails = selectedBooking
      ? getClassDetails(selectedBooking.classId)
      : null;
    const packDetails = selectedBooking
      ? getPackDetails(selectedBooking.packId)
      : null;
    const eventDetails = selectedBooking
      ? getEventDetails(selectedBooking.eventId)
      : null;

    return (
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "text.white",
            borderRadius: "16px 16px 0 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: "24px", color: "text.white" }}
            >
              Booking Details #{selectedBooking?.id.slice(-8)}
            </Typography>
            <Chip
              label={
                selectedBooking?.status.charAt(0).toUpperCase() +
                selectedBooking?.status.slice(1)
              }
              color={getStatusColor(selectedBooking?.status)}
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                height: 36,
                borderRadius: 3,
                backgroundColor: "white",
                color: "text.primary",
              }}
            />
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 4, backgroundColor: "background.default" }}>
          {actionError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 3,
                border: "1px solid rgba(244, 67, 54, 0.3)",
              }}
            >
              {actionError}
            </Alert>
          )}

          {selectedBooking && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.08)",
                    backgroundColor: "white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography
                    variant="h1"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: "20px",
                    }}
                  >
                    Booking Information
                  </Typography>
                  <Divider
                    sx={{ mb: 3, backgroundColor: "primary.main", height: 2 }}
                  />

                  <Stack spacing={3}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(33, 150, 243, 0.05)",
                        border: "1px solid rgba(33, 150, 243, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        Booking ID
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ mt: 0.5, fontFamily: "monospace" }}
                      >
                        {selectedBooking.id}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(76, 175, 80, 0.05)",
                        border: "1px solid rgba(76, 175, 80, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        Customer Details
                      </Typography>
                      {userDetails ? (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "16px", color: "primary.main" }}>
                            {userDetails.firstName} {userDetails.lastName}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mt: 1 }}
                          >
                            <Email
                              fontSize="small"
                              sx={{ color: "primary.main" }}
                            />
                            <Typography 
                              component="a"
                              href={`mailto:${userDetails.email}`}
                              variant="body2" 
                              sx={{ 
                                color: "primary.main",
                                fontWeight: "medium",
                                textDecoration: "none",
                                "&:hover": {
                                  textDecoration: "underline",
                                  color: "secondary.main",
                                },
                              }}
                            >
                              {userDetails.email}
                            </Typography>
                          </Stack>
                          {userDetails.phone && (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              sx={{ mt: 1 }}
                            >
                              <Phone
                                fontSize="small"
                                sx={{ color: "primary.main" }}
                              />
                              <Typography
                                component="a"
                                href={`tel:${userDetails.phone}`}
                                variant="body2"
                                sx={{ 
                                  color: "primary.main",
                                  fontWeight: "medium",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                    color: "secondary.main",
                                  },
                                }}
                              >
                                {userDetails.phone}
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <CircularProgress size={16} />
                          <Typography variant="body2" color="text.secondary">
                            Loading customer details...
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(156, 39, 176, 0.05)",
                        border: "1px solid rgba(156, 39, 176, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        Created At
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ mt: 0.5 }}
                      >
                        {formatDate(selectedBooking.createdAt)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 193, 7, 0.05)",
                        border: "1px solid rgba(255, 193, 7, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        Payment ID
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ mt: 0.5, fontFamily: "monospace" }}
                      >
                        {selectedBooking.paymentId || "Not provided"}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.08)",
                    backgroundColor: "white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography
                    variant="h1"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "secondary.main",
                      fontSize: "20px",
                    }}
                  >
                    Activity Details
                  </Typography>
                  <Divider
                    sx={{ mb: 3, backgroundColor: "secondary.main", height: 2 }}
                  />

                  <Stack spacing={3}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: selectedBooking.classId
                          ? "rgba(76, 175, 80, 0.05)"
                          : "rgba(156, 39, 176, 0.05)",
                        border: selectedBooking.classId
                          ? "1px solid rgba(76, 175, 80, 0.1)"
                          : "1px solid rgba(156, 39, 176, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        Activity Type
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ mt: 0.5 }}
                      >
                        {selectedBooking.classId
                          ? "Class Booking"
                          : "Event Booking"}
                      </Typography>
                    </Box>

                    {selectedBooking.classId && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "rgba(76, 175, 80, 0.05)",
                          border: "1px solid rgba(76, 175, 80, 0.1)",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="medium"
                        >
                          Class Details
                        </Typography>
                        {classDetails ? (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                              {classDetails.name}
                            </Typography>
                            {classDetails.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                {classDetails.description}
                              </Typography>
                            )}
                            {classDetails.duration && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                Duration: {classDetails.duration} minutes
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, fontFamily: "monospace" }}
                          >
                            ID: {selectedBooking.classId}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {selectedBooking.eventId && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "rgba(156, 39, 176, 0.05)",
                          border: "1px solid rgba(156, 39, 176, 0.1)",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="medium"
                        >
                          Event Details
                        </Typography>
                        {eventDetails ? (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                              {eventDetails.title}
                            </Typography>
                            {eventDetails.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                {eventDetails.description}
                              </Typography>
                            )}
                            {eventDetails.date && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                Date: {formatDate(eventDetails.date)}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, fontFamily: "monospace" }}
                          >
                            ID: {selectedBooking.eventId}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {selectedBooking.packId && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "rgba(33, 150, 243, 0.05)",
                          border: "1px solid rgba(33, 150, 243, 0.1)",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="medium"
                        >
                          Class Pack Details
                        </Typography>
                        {packDetails ? (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                              {packDetails.name}
                            </Typography>
                            {packDetails.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                {packDetails.description}
                              </Typography>
                            )}
                            {packDetails.classCount && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                Classes: {packDetails.classCount}
                              </Typography>
                            )}
                            {packDetails.price && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                Price: ${packDetails.price}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, fontFamily: "monospace" }}
                          >
                            ID: {selectedBooking.packId}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {selectedBooking.scheduleId && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "rgba(255, 193, 7, 0.05)",
                          border: "1px solid rgba(255, 193, 7, 0.1)",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="medium"
                        >
                          Schedule ID
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ mt: 0.5, fontFamily: "monospace" }}
                        >
                          {selectedBooking.scheduleId}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 4,
            backgroundColor: "background.default",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <Button
            onClick={() => setDetailsOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "medium",
              px: 3,
              py: 1,
            }}
          >
            Close
          </Button>

          {selectedBooking?.status === "pending" && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={
                  actionLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CheckCircle />
                  )
                }
                onClick={() =>
                  handleBookingAction(selectedBooking.id, "confirm")
                }
                disabled={actionLoading}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
                  },
                }}
              >
                {actionLoading ? "Approving..." : "Approve Booking"}
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={
                  actionLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Cancel />
                  )
                }
                onClick={() =>
                  handleBookingAction(selectedBooking.id, "cancel")
                }
                disabled={actionLoading}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(244, 67, 54, 0.4)",
                  },
                }}
              >
                {actionLoading ? "Rejecting..." : "Reject Booking"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading bookings: {error.message}
      </Alert>
    );
  }

  return (
    <Box
      sx={{ py: 10, backgroundColor: "background.default", minHeight: "100vh" }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              color: "secondary.main",
              textAlign: "center",
              mb: 2,
            }}
          >
            Bookings Management
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 4 }}
          >
            Review and manage all booking requests
          </Typography>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                onClick={() => setSelectedTab(3)}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: selectedTab === 3 ? "primary.main" : "primary.main",
                  color: "text.white",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: selectedTab === 3 
                    ? "0 8px 30px rgba(177, 83, 36, 0.4)" 
                    : "0 4px 20px rgba(177, 83, 36, 0.3)",
                  cursor: "pointer",
                  transform: selectedTab === 3 ? "translateY(-4px)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(177, 83, 36, 0.4)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background: "rgba(227, 222, 211, 0.1)",
                    borderRadius: "50%",
                    transform: "translate(30px, -30px)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(227, 222, 211, 0.2)",
                      width: 56,
                      height: 56,
                      color: "primary.main",
                    }}
                  >
                    <AssignmentIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="text.white"
                    >
                      {bookings.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.9, color: "text.white" }}
                    >
                      Total Bookings
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                onClick={() => setSelectedTab(0)}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: selectedTab === 0 ? "#e65100" : "#ff9800",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: selectedTab === 0
                    ? "0 8px 30px rgba(255, 152, 0, 0.4)"
                    : "0 4px 20px rgba(255, 152, 0, 0.3)",
                  cursor: "pointer",
                  transform: selectedTab === 0 ? "translateY(-4px)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(255, 152, 0, 0.4)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    transform: "translate(30px, -30px)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 56,
                      height: 56,
                      color: "#ff9800",
                    }}
                  >
                    <Schedule fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {pendingBookings.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Pending Approval
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                onClick={() => setSelectedTab(1)}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: selectedTab === 1 ? "#2e7d32" : "#4caf50",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: selectedTab === 1
                    ? "0 8px 30px rgba(76, 175, 80, 0.4)"
                    : "0 4px 20px rgba(76, 175, 80, 0.3)",
                  cursor: "pointer",
                  transform: selectedTab === 1 ? "translateY(-4px)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(76, 175, 80, 0.4)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    transform: "translate(30px, -30px)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 56,
                      height: 56,
                      color: "#4caf50",
                    }}
                  >
                    <CheckCircle fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {confirmedBookings.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Confirmed
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                onClick={() => setSelectedTab(2)}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: selectedTab === 2 ? "#3e2723" : "secondary.main",
                  color: "text.white",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: selectedTab === 2
                    ? "0 8px 30px rgba(78, 41, 22, 0.4)"
                    : "0 4px 20px rgba(78, 41, 22, 0.3)",
                  cursor: "pointer",
                  transform: selectedTab === 2 ? "translateY(-4px)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(78, 41, 22, 0.4)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background: "rgba(227, 222, 211, 0.1)",
                    borderRadius: "50%",
                    transform: "translate(30px, -30px)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(227, 222, 211, 0.2)",
                      width: 56,
                      height: 56,
                      color: "secondary.main",
                    }}
                  >
                    <Cancel fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="text.white"
                    >
                      {cancelledBookings.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.9, color: "text.white" }}
                    >
                      Cancelled
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box>
          {selectedTab === 0 && (
            <Box>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  color: "#ff9800",
                  fontSize: "24px",
                  mb: 3,
                }}
              >
                Pending Bookings - Action Required
              </Typography>
              {pendingBookings.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: "white",
                    border: "2px solid",
                    borderColor: "background.default",
                  }}
                >
                  <Schedule
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h1"
                    color="text.primary"
                    sx={{ fontSize: "20px" }}
                  >
                    No pending bookings
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    All bookings have been processed
                  </Typography>
                </Paper>
              ) : (
                pendingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={true}
                  />
                ))
              )}
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  color: "#4caf50",
                  fontSize: "24px",
                  mb: 3,
                }}
              >
                Confirmed Bookings
              </Typography>
              {confirmedBookings.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: "white",
                    border: "2px solid",
                    borderColor: "background.default",
                  }}
                >
                  <CheckCircle
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h1"
                    color="text.primary"
                    sx={{ fontSize: "20px" }}
                  >
                    No confirmed bookings
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Approved bookings will appear here
                  </Typography>
                </Paper>
              ) : (
                confirmedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </Box>
          )}

          {selectedTab === 2 && (
            <Box>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  color: "secondary.main",
                  fontSize: "24px",
                  mb: 3,
                }}
              >
                Cancelled Bookings
              </Typography>
              {cancelledBookings.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: "white",
                    border: "2px solid",
                    borderColor: "background.default",
                  }}
                >
                  <Cancel
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h1"
                    color="text.primary"
                    sx={{ fontSize: "20px" }}
                  >
                    No cancelled bookings
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Rejected bookings will appear here
                  </Typography>
                </Paper>
              ) : (
                cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </Box>
          )}

          {selectedTab === 3 && (
            <Box>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  color: "text.primary",
                  fontSize: "24px",
                  mb: 3,
                }}
              >
                All Bookings
              </Typography>
              {bookings.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: "white",
                    border: "2px solid",
                    borderColor: "background.default",
                  }}
                >
                  <AssignmentIcon
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h1"
                    color="text.primary"
                    sx={{ fontSize: "20px" }}
                  >
                    No bookings found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Customer bookings will appear here
                  </Typography>
                </Paper>
              ) : (
                bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={booking.status === "pending"}
                  />
                ))
              )}
            </Box>
          )}
        </Box>

        <BookingDetailsDialog />
      </Container>
    </Box>
  );
};

export default BookingsManagePage;
