import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Grid,
  Button,
  Dialog,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import axiosInstance from "../api/axiosInstance";

// Forms
import RegisterForm from "../components/forms/RegisterForm";

// API services
import { getClassById } from "../api/classService";
import { getEventById } from "../api/eventService";
import useAddons from "../hooks/useAddons";
import useClassSchedules from "../hooks/useClassSchedules";

import { setToken, setUser } from "../utils/auth";
import { getClassStatus, getEventStatus } from "../utils/helpers";

const ActivityInternal = () => {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [trainer, setTrainer] = useState(null);
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [trainerError, setTrainerError] = useState(null);

  const [registerOpen, setRegisterOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Add-ons hook - fetch add-ons globally or filtered per activity if needed
  const {
    addons,
    loading: addonsLoading,
    error: addonsError,
    refetch: refetchAddons,
  } = useAddons();

  // Class schedules hook
  const { schedules } = useClassSchedules();

  // Fetch activity details (class or event)
  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      setError(null);
      try {
        const isClass = id.startsWith("class_");
        const activityRes = isClass
          ? await getClassById(id)
          : await getEventById(id);
        setActivity(activityRes.data);
      } catch (err) {
        console.error("Error fetching activity:", err);
        setError(`Failed to fetch activity: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchActivity();
  }, [id]);

  // Fetch trainer details if available
  useEffect(() => {
    if (!activity?.trainerId) return;

    const fetchTrainer = async () => {
      setTrainerLoading(true);
      setTrainerError(null);
      try {
        const res = await axiosInstance.get(`/trainers/${activity.trainerId}`);
        setTrainer(res.data);
      } catch (err) {
        setTrainerError("Failed to fetch trainer data.");
        console.error(err);
      } finally {
        setTrainerLoading(false);
      }
    };

    fetchTrainer();
    // console.log("Trainer fetched:", trainer);
  }, [activity?.trainerId]);

  const spotsLeft = activity ? activity.maxSpots - activity.bookedSpots : 0;

  const getPlaceNameFromUrl = (url) => {
    try {
      const placeMatch = url.match(/2s([^!]+)/);
      if (placeMatch) {
        return decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
      }

      const nameInQuery = url.match(/!1s([^!]+)/);
      if (nameInQuery) {
        return decodeURIComponent(nameInQuery[1]).replace(/\+/g, " ");
      }

      const urlObj = new URL(url);
      const query = urlObj.searchParams.get("q");
      if (query) {
        return decodeURIComponent(query).replace(/\+/g, " ");
      }

      const readableMatch = url.match(/!2s([^!&]+)/);
      if (readableMatch) {
        return decodeURIComponent(readableMatch[1]).replace(/\+/g, " ");
      }

      return "Location Available";
    } catch (error) {
      console.error("Error extracting place name:", error);
      return "Location Available";
    }
  };

  const placeName = activity?.location
    ? getPlaceNameFromUrl(activity.location)
    : null;

  const handleRegisterSubmit = async (data) => {
    // console.log("Register submit:", data);

    try {
      setToken(data.accessToken, data.refreshToken);

      setUser({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        phone: data.user.phone,
      });

      await refetchAddons();

      setRegisterOpen(false);
    } catch (err) {
      console.error("Failed to handle post-registration:", err);
    }
  };

  if (loading) {
    return (
      <Box
        minHeight={500}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minHeight={500}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box
        minHeight={500}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography>No activity found.</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Hero Section with Brand Colors */}
      <Box
        position="relative"
        sx={{
          width: "100%",
          height: "70vh",
          overflow: "hidden",
          mb: 6,
          background: "linear-gradient(135deg, #4E2916 0%, #B15324 100%)",
        }}
      >
        {/* Background Image with Overlay */}
        <Box
          component="img"
          src={activity.thumbnail}
          alt={`${activity.title} thumbnail`}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(30%) sepia(30%) hue-rotate(20deg)",
            zIndex: 1,
          }}
        />

        {/* Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(227, 222, 211, 0.1)",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(177, 83, 36, 0.15)",
            zIndex: 2,
          }}
        />

        {/* Content Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="end"
          pb={2}
          alignItems="center"
          sx={{
            background:
              "linear-gradient(45deg, rgba(78, 41, 22, 0.7) 0%, rgba(177, 83, 36, 0.5) 100%)",
            zIndex: 3,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              fontWeight: 800,
              color: "#E3DED3",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: { xs: 2, md: 4 },
              textShadow: "3px 3px 15px rgba(78, 41, 22, 0.8)",
              mb: 2,
            }}
          >
            {activity.title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(227, 222, 211, 0.95)",
              textAlign: "center",
              mb: 4,
              maxWidth: 600,
              px: 2,
              fontWeight: 300,
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            Transform your fitness journey with our expertly designed programs
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setRegisterOpen(true)}
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: 700,
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              borderRadius: "50px",
              background: "linear-gradient(45deg, #B15324 30%, #D4763A 90%)",
              border: 0,
              color: "#E3DED3",
              boxShadow: "0 8px 32px rgba(177, 83, 36, 0.4)",
              textTransform: "uppercase",
              letterSpacing: 1,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 40px rgba(177, 83, 36, 0.5)",
                background: "linear-gradient(45deg, #D4763A 30%, #B15324 90%)",
              },
              "&:active": {
                transform: "translateY(-1px)",
              },
            }}
          >
            Join Now
          </Button>
        </Box>
      </Box>

      {/* At a Glance - Brand Color Design */}
      <Box
        px={{ xs: 2, sm: 3, md: 8 }}
        py={6}
        sx={{
          background: "linear-gradient(135deg, #E3DED3 0%, #F5F2EB 100%)",
          borderRadius: { xs: 3, md: 6 },
          mx: { xs: 2, sm: 3, md: 6 },
          mb: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box display="flex" alignItems="center" mb={4}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#4E2916",
              textTransform: "uppercase",
              letterSpacing: 2,
              mr: 2,
            }}
          >
            At a Glance
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Available Spots Card */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Box
              sx={{
                height: 140,
                background: "linear-gradient(135deg, #B15324 0%, #D4763A 100%)",
                borderRadius: 4,
                p: 3,
                color: "#E3DED3",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 20px 40px rgba(177, 83, 36, 0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(227, 222, 211, 0.15)",
                },
              }}
            >
              <Typography variant="h3" fontWeight={900} mb={1}>
                {spotsLeft}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Available Spots
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: "#E3DED3",
                }}
              >
                SPOTS
              </Box>
            </Box>
          </Grid>

          {/* Status Card */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Box
              sx={{
                height: 140,
                background: "linear-gradient(135deg, #4E2916 0%, #703F28 100%)",
                borderRadius: 4,
                p: 3,
                color: "#E3DED3",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 20px 40px rgba(78, 41, 22, 0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(227, 222, 211, 0.1)",
                },
              }}
            >
              {(() => {
                const isClass = id.startsWith("class_");
                let status = "unknown";

                if (isClass && activity.classScheduleIds) {
                  try {
                    const scheduleIds = JSON.parse(activity.classScheduleIds);
                    const activitySchedules = scheduleIds
                      .map((id) => schedules.find((s) => s.id === id))
                      .filter(Boolean);
                    status = getClassStatus(activitySchedules);
                  } catch (e) {
                    status = "unknown";
                  }
                } else if (!isClass && activity.startDateTime) {
                  status = getEventStatus(
                    activity.startDateTime,
                    activity.endDateTime
                  );
                }

                const statusEmojis = {
                  upcoming: "UPCOMING",
                  ongoing: "LIVE",
                  completed: "DONE",
                  unknown: "TBD",
                };

                return (
                  <>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      textTransform="capitalize"
                      mb={1}
                    >
                      {status}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Current Status
                    </Typography>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "#E3DED3",
                      }}
                    >
                      {statusEmojis[status]}
                    </Box>
                  </>
                );
              })()}
            </Box>
          </Grid>

          {/* Date & Time Card */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Box
              sx={{
                height: 140,
                background: "linear-gradient(135deg, #C49A7B 0%, #E8C5A0 100%)",
                borderRadius: 4,
                p: 3,
                color: "#4E2916",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 20px 40px rgba(196, 154, 123, 0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(78, 41, 22, 0.1)",
                },
              }}
            >
              {(() => {
                const isClass = id.startsWith("class_");

                if (isClass && activity.classScheduleIds) {
                  try {
                    const scheduleIds = JSON.parse(activity.classScheduleIds);
                    const activitySchedules = scheduleIds
                      .map((id) => schedules.find((s) => s.id === id))
                      .filter(Boolean);

                    if (activitySchedules.length > 0) {
                      const days = [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                      ];
                      const schedule = activitySchedules[0];

                      return (
                        <>
                          <Typography variant="h5" fontWeight={700} mb={1}>
                            {days[schedule.dayOfWeek]}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {schedule.startTime} - {schedule.endTime}
                          </Typography>
                          {activitySchedules.length > 1 && (
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              +{activitySchedules.length - 1} more
                            </Typography>
                          )}
                        </>
                      );
                    }
                  } catch (e) {
                    // Handle parsing error
                  }

                  return (
                    <>
                      <Typography variant="h6" fontWeight={600}>
                        TBD
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Schedule
                      </Typography>
                    </>
                  );
                } else if (!isClass && activity.startDateTime) {
                  return (
                    <>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        {new Date(activity.startDateTime).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {new Date(activity.startDateTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </>
                  );
                }

                return (
                  <>
                    <Typography variant="h6" fontWeight={600}>
                      TBD
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Date & Time
                    </Typography>
                  </>
                );
              })()}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: "#4E2916",
                }}
              >
                TIME
              </Box>
            </Box>
          </Grid>

          {/* Location Card */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Box
              component={activity.location ? "button" : "div"}
              onClick={
                activity.location
                  ? () => {
                      const embedUrl = activity.location;
                      let mapsUrl = embedUrl;

                      const coordMatch = embedUrl.match(
                        /!2d([\d.-]+)!3d([\d.-]+)/
                      );
                      const placeMatch = embedUrl.match(/!1s([^!]+)/);

                      if (coordMatch) {
                        const lng = coordMatch[1];
                        const lat = coordMatch[2];
                        mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                      } else if (placeMatch) {
                        const placeId = placeMatch[1];
                        mapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
                      } else if (placeName) {
                        mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
                          placeName
                        )}`;
                      }

                      window.open(mapsUrl, "_blank");
                    }
                  : undefined
              }
              sx={{
                height: 140,
                background: "linear-gradient(135deg, #A67E5B 0%, #C49A7B 100%)",
                borderRadius: 4,
                p: 3,
                color: "#E3DED3",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: activity.location ? "pointer" : "default",
                border: "none",
                width: "100%",
                "&:hover": activity.location
                  ? {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 20px 40px rgba(166, 126, 91, 0.4)",
                    }
                  : {},
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(227, 222, 211, 0.2)",
                },
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={1} color="#4E2916">
                {trainer ? trainer.name : "Expert Trainer"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }} color="#4E2916">
                {trainer &&
                trainer.specializations &&
                trainer.specializations.length > 0
                  ? trainer.specializations.join(" • ")
                  : "Fitness Specialist"}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: "#4E2916",
                }}
              >
                TRAINER
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Add-ons Preview - Brand Design */}
        {addons && addons.length > 0 && (
          <Box
            mt={4}
            p={4}
            sx={{
              background: "rgba(227, 222, 211, 0.9)",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(177, 83, 36, 0.2)",
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight={700} color="#4E2916" mr={2}>
                Available Add-ons
              </Typography>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: "#B15324",
                  color: "#E3DED3",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {addons.length} OPTIONS
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {addons.slice(0, 4).map((addon, index) => (
                <Box
                  key={addon.id}
                  sx={{
                    px: 3,
                    py: 1.5,
                    background: `linear-gradient(45deg, ${
                      index % 4 === 0
                        ? "#B15324 30%, #D4763A 90%"
                        : index % 4 === 1
                        ? "#4E2916 30%, #703F28 90%"
                        : index % 4 === 2
                        ? "#A67E5B 30%, #C49A7B 90%"
                        : "#C49A7B 30%, #E8C5A0 90%"
                    })`,
                    color: "#E3DED3",
                    borderRadius: "25px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(177, 83, 36, 0.3)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(177, 83, 36, 0.4)",
                    },
                  }}
                >
                  {addon.name} • ₹{addon.price}
                </Box>
              ))}
              {addons.length > 4 && (
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: "rgba(78, 41, 22, 0.1)",
                    color: "#4E2916",
                    borderRadius: "25px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    border: "2px dashed #B15324",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  +{addons.length - 4} more available
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Main Content - Enhanced Layout */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={4}
        px={{ xs: 2, sm: 3, md: 8 }}
        mb={6}
      >
        {/* Content Section */}
        <Box width={isMobile ? "100%" : "65%"}>
          {/* Description Card */}
          <Box
            mb={4}
            p={4}
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              border: "1px solid rgba(102, 126, 234, 0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Typography
                variant="h4"
                fontWeight={800}
                color="primary.main"
                mr={2}
              >
                Description
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: "text.primary",
                fontSize: "1.1rem",
                "& ul": {
                  marginLeft: 2,
                  paddingLeft: 2,
                  "& li": {
                    marginBottom: 1,
                    position: "relative",
                    "&::marker": {
                      color: "primary.main",
                    },
                  },
                },
                "& ul ul": {
                  marginLeft: 3,
                  paddingLeft: 3,
                },
                "& p": {
                  marginBottom: 2,
                },
              }}
              dangerouslySetInnerHTML={{
                __html:
                  activity.description ||
                  "<p>Discover an amazing fitness experience designed just for you!</p>",
              }}
            />
          </Box>

          {/* Instructions Card */}
          <Box
            p={4}
            sx={{
              background: "linear-gradient(135deg, #fff5f5 0%, #ffe0e6 100%)",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255, 107, 107, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Typography
                variant="h4"
                fontWeight={800}
                color="primary.main"
                mr={2}
              >
                Instructions
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: "text.primary",
                fontSize: "1.1rem",
                whiteSpace: "pre-line",
                "& ul": {
                  marginLeft: 2,
                  paddingLeft: 2,
                  "& li": {
                    marginBottom: 1,
                    position: "relative",
                    "&::marker": {
                      color: "primary.main",
                    },
                  },
                },
                "& ul ul": {
                  marginLeft: 3,
                  paddingLeft: 3,
                },
                "& p": {
                  marginBottom: 2,
                },
              }}
              dangerouslySetInnerHTML={{
                __html:
                  activity.instructions ||
                  "<p>Get ready for an incredible journey! Detailed instructions will be provided.</p>",
              }}
            />
          </Box>
        </Box>

        {/* Trainer Spotlight */}
        <Box width={isMobile ? "100%" : "35%"}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #B15324 0%, #D4763A 100%)",
              borderRadius: 6,
              p: 4,
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              position: "sticky",
              top: 20,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(177, 83, 36, 0.4)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(227, 222, 211, 0.1)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -50,
                left: -50,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(227, 222, 211, 0.05)",
              },
            }}
          >
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#E3DED3",
                mb: 3,
                textTransform: "uppercase",
                letterSpacing: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              Your Expert Trainer
            </Typography>

            {trainerLoading && (
              <CircularProgress sx={{ color: "#E3DED3", mb: 2 }} />
            )}

            {trainerError && (
              <Typography
                color="error"
                sx={{ position: "relative", zIndex: 1 }}
              >
                {trainerError}
              </Typography>
            )}

            {trainer ? (
              <>
                <Box
                  component="img"
                  src={trainer.profileImage || "/default-trainer.png"}
                  alt={`${trainer.name} photo`}
                  sx={{
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    objectFit: "cover",
                    mb: 3,
                    border: "4px solid rgba(227, 222, 211, 0.3)",
                    boxShadow: "0 8px 32px rgba(78, 41, 22, 0.3)",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: "#E3DED3", position: "relative", zIndex: 1 }}
                >
                  {trainer.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(227, 222, 211, 0.9)",
                    whiteSpace: "pre-line",
                    position: "relative",
                    zIndex: 1,
                    lineHeight: 1.6,
                  }}
                >
                  {trainer.bio ||
                    "Professional fitness expert dedicated to your success!"}
                </Typography>
              </>
            ) : !trainerLoading && !trainerError ? (
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "rgba(227, 222, 211, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    mb: 2,
                    color: "#E3DED3",
                    fontWeight: "bold",
                  }}
                >
                  T
                </Box>
                <Typography variant="h6" sx={{ color: "#E3DED3" }}>
                  Expert trainer will be assigned
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Stack>

      {/* Gallery Section - Enhanced */}
      {activity.gallery && activity.gallery.length > 0 && (
        <Box px={{ xs: 2, sm: 3, md: 8 }} mb={6}>
          <Box display="flex" alignItems="center" mb={4}>
            <Typography
              variant="h3"
              fontWeight={800}
              color="primary.main"
              mr={2}
            >
              Gallery
            </Typography>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {activity.gallery.length} PHOTOS
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 3,
            }}
          >
            {activity.gallery.map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 4,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px) scale(.95)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    "& img": {
                      transform: "scale(1.1)",
                    },
                    "&::after": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`${activity.title} gallery ${idx + 1}`}
                  sx={{
                    width: "100%",
                    height: 280,
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Location Map - Enhanced */}
      <Box px={{ xs: 2, sm: 3, md: 8 }} mb={6}>
        <Box display="flex" alignItems="center" mb={4}>
          <Typography variant="h3" fontWeight={800} color="primary.main" mr={2}>
            Location
          </Typography>
          {placeName && (
            <Box
              sx={{
                px: 2,
                py: 0.5,
                bgcolor: "success.main",
                color: "white",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {placeName}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: "4px solid white",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
            },
          }}
        >
          <Box
            component="iframe"
            src={activity.location}
            title="Location Map"
            width="100%"
            height={450}
            sx={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
          />
        </Box>
      </Box>

      {/* Register Form Dialog - Enhanced */}
      <Dialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
            color: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          {/* Decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <RegisterForm
            activity={activity}
            addons={addons}
            onClose={() => setRegisterOpen(false)}
            onSubmit={handleRegisterSubmit}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default ActivityInternal;
