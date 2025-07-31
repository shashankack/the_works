import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Custom hooks
import { useClasses } from "../../hooks/useClasses";
import { useEvents } from "../../hooks/useEvents";

// MUI components
import {
  Box,
  Typography,
  Stack,
  Button,
  ButtonGroup,
  useTheme,
  useMediaQuery,
  Dialog,
} from "@mui/material";

// MUI icons
import { ArrowForward, ArrowBack } from "@mui/icons-material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

// Import Register Form
import RegisterForm from "../forms/RegisterForm";
import useAddons from "../../hooks/useAddons";
import { isAuthenticated } from "../../utils/auth";

const SwiperSection = ({ data, onRegisterClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const slugify = (text) =>
    text
      .toString()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={100}
      slidesPerView={isMobile ? 1 : 3}
    >
      {data.map((item, index) => (
        <SwiperSlide key={index}>
          <Box
            bgcolor="rgba(255, 255, 255, 0.4)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            border={3}
            borderColor="primary.main"
            borderRadius={4}
            overflow="hidden"
            minHeight={600}
          >
            <Box
              component="img"
              src={item.thumbnail}
              alt={item.title}
              sx={{
                borderRadius: "0 0 20px 20px",
                height: 300,
                width: "100%",
                objectFit: "cover",
              }}
            />

            <Box width="95%" p={2}>
              <Typography
                mt={2}
                mb={1}
                variant="h1"
                textTransform="uppercase"
                fontWeight={600}
                color="primary.main"
              >
                {item.title}
              </Typography>

              <Typography
                dangerouslySetInnerHTML={{ __html: item.description }}
                variant="body1"
                color="text.primary"
              />
              <Stack
                direction={"row"}
                sx={{ justifyContent: "flex-end", width: "100%" }}
                gap={2}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/activity/${slugify(item.id)}`)}
                >
                  Learn More
                </Button>
                <Button
                  variant="contained"
                  onClick={() => onRegisterClick(item)}
                >
                  Register
                </Button>
              </Stack>
            </Box>
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const ActivitesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { classes, loading: classesLoading, error: classesError } = useClasses();
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { addons } = useAddons();
  const navigate = useNavigate();

  // New state to toggle between "classes" and "events"
  const [activityType, setActivityType] = useState("classes");

  // Register form state
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Listen for pending registration trigger
  useEffect(() => {
    const handleTriggerRegistration = (event) => {
      const activity = event.detail;
      if (activity && isAuthenticated()) {
        setSelectedActivity(activity);
        setRegisterOpen(true);
      }
    };

    window.addEventListener("triggerRegistration", handleTriggerRegistration);

    return () => {
      window.removeEventListener(
        "triggerRegistration",
        handleTriggerRegistration
      );
    };
  }, []);

  useEffect(() => {
    console.log("Classes:", classes);
    console.log("Classes Loading:", classesLoading);
    console.log("Classes Error:", classesError);
  }, [classes, classesLoading, classesError]);

  useEffect(() => {
    console.log("Events:", events);
    console.log("Events Loading:", eventsLoading);
    console.log("Events Error:", eventsError);
  }, [events, eventsLoading, eventsError]);

  // Handler to toggle activity type
  const handleToggle = () => {
    setActivityType((prev) => (prev === "classes" ? "events" : "classes"));
  };

  // Handler for register button click
  const handleRegisterClick = (activity) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Store the selected activity in sessionStorage for after login
      sessionStorage.setItem("pendingRegistration", JSON.stringify(activity));
      // Redirect to auth page
      navigate("/login");
      return;
    }

    // User is authenticated, open registration form
    setSelectedActivity(activity);
    setRegisterOpen(true);
  };

  // Handler for register form close
  const handleRegisterClose = () => {
    setRegisterOpen(false);
    setSelectedActivity(null);
  };

  // Handler for register form submit
  const handleRegisterSubmit = (bookingData) => {
    console.log("Proceeding to payment with data:", bookingData);

    // Store booking data in sessionStorage for payment page
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

    // Navigate to payment page (we'll create this route)
    navigate("/payment");

    // Close the form
    setRegisterOpen(false);
    setSelectedActivity(null);
  };

  return (
    <Box px={isMobile ? 1 : 8} minHeight={"100vh"} py={isMobile ? 10 : 4}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          variant={isMobile ? "h5" : "h3"}
          fontWeight={700}
          textTransform="uppercase"
        >
          Upcoming {activityType === "classes" ? "Classes" : "Events"}
        </Typography>

        <Box display="flex" alignItems="center" gap={4}>
          <Button onClick={handleToggle} size="large">
            {activityType === "classes" ? "Show Events" : "Show Classes"}
          </Button>
          <ButtonGroup variant="text">
            <Button>
              <ArrowBack />
            </Button>
            <Button>
              <ArrowForward />
            </Button>
          </ButtonGroup>
        </Box>
      </Stack>

      <Box width="100%" mt={4}>
        {activityType === "classes" ? (
          classesLoading ? (
            <Typography
              variant="h6"
              color="text.secondary"
              align="center"
              py={8}
            >
              Loading classes...
            </Typography>
          ) : classesError ? (
            <Typography
              variant="h6"
              color="error"
              align="center"
              py={8}
            >
              Error loading classes: {classesError.message}
            </Typography>
          ) : classes.length === 0 ? (
            <Typography
              variant="h6"
              color="text.secondary"
              align="center"
              py={8}
            >
              No classes available at the moment.
            </Typography>
          ) : (
            <SwiperSection
              data={classes}
              onRegisterClick={handleRegisterClick}
            />
          )
        ) : eventsLoading ? (
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            py={8}
          >
            Loading events...
          </Typography>
        ) : eventsError ? (
          <Typography
            variant="h6"
            color="error"
            align="center"
            py={8}
          >
            Error loading events: {eventsError.message}
          </Typography>
        ) : events.length === 0 ? (
          <Typography variant="h6" color="text.secondary" align="center" py={8}>
            No events available at the moment.
          </Typography>
        ) : (
          <SwiperSection data={events} onRegisterClick={handleRegisterClick} />
        )}
      </Box>

      {/* Register Form Dialog */}
      <Dialog
        open={registerOpen}
        onClose={handleRegisterClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
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
          {selectedActivity && (
            <RegisterForm
              activity={selectedActivity}
              addons={addons}
              onClose={handleRegisterClose}
              onSubmit={handleRegisterSubmit}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default ActivitesSection;
