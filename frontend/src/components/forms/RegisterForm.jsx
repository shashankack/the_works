import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  TextField,
  Checkbox,
  FormGroup,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import axiosInstance from "../../api/axiosInstance";
import { getCurrentUser } from "../../api/userService";
import { setToken, setUser, isAuthenticated } from "../../utils/auth";

import useClassPacks from "../../hooks/useClassPacks";
import useClassSchedules from "../../hooks/useClassSchedules";

// Import auth forms
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const dayOfWeekLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const RegisterForm = ({ addons = [], activity, onClose, onSubmit }) => {
  const { packs, loading: packsLoading, error: packsError } = useClassPacks();
  const {
    schedules,
    loading: schedulesLoading,
    error: schedulesError,
  } = useClassSchedules();

  const [selectedPack, setSelectedPack] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [formError, setFormError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState(0); // 0 for signin, 1 for signup

  // Check authentication status and auto-fill user details if authenticated
  useEffect(() => {
    const checkAuthAndFetchUserData = async () => {
      const authenticated = isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        setUserLoading(true);
        try {
          const userData = await getCurrentUser();
          setUserDetails({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setFormError("Failed to load user data. Please try again.");
        } finally {
          setUserLoading(false);
        }
      }
    };

    checkAuthAndFetchUserData();
  }, []);

  // Handle add-on checkbox toggle
  const handleAddOnChange = (addonId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Handle user detail field changes
  const handleUserDetailChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Handle successful authentication
  const handleAuthSuccess = async (data) => {
    try {
      // Store authentication data
      setToken(data.accessToken, data.refreshToken);
      setUser({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        phone: data.user.phone,
      });

      // Update local state
      setIsAuthenticated(true);
      setUserDetails({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
      });

      setFormError(null);
    } catch (err) {
      console.error("Failed to handle authentication:", err);
      setFormError("Authentication successful but failed to load user data.");
    }
  };

  // Validate form and submit registration + booking
  const handleProceedToPayment = async () => {
    setFormError(null);

    if (!selectedPack) {
      setFormError("Please select a class pack.");
      return;
    }

    // Calculate total price
    const selectedPackData = packs.find((pack) => pack.id === selectedPack);
    const selectedAddonDetails = selectedAddOns.map((addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return {
        id: addon.id,
        name: addon.name,
        price: addon.price,
      };
    });
    const addonPrices = selectedAddonDetails.reduce((total, addon) => {
      return total + (addon?.price || 0);
    }, 0);

    const totalPrice = (selectedPackData?.price || 0) + addonPrices;

    // Call onSubmit with booking data (without creating booking yet)
    if (onSubmit) {
      onSubmit({
        activity,
        selectedPack,
        selectedPackData, // Include pack details
        selectedSchedule,
        selectedAddons: selectedAddOns, // Keep IDs for backend
        selectedAddonDetails, // Include addon details for display
        userDetails,
        totalPrice,
      });
    }
  };

  return (
    <Box>
      {!isAuthenticated ? (
        // Show authentication forms if user is not authenticated
        <>
          <DialogTitle
            sx={{
              fontSize: "1rem",
            }}
          >
            Sign in or Sign up to Register for {activity?.title}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={authTab}
                onChange={(e, newValue) => setAuthTab(newValue)}
                centered
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>
            </Box>

            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            {authTab === 0 ? (
              <SignInForm
                onSuccess={handleAuthSuccess}
                onError={(error) => setFormError(error)}
                disableNavigation={true}
              />
            ) : (
              <SignUpForm
                onSuccess={handleAuthSuccess}
                onError={(error) => setFormError(error)}
                disableNavigation={true}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
          </DialogActions>
        </>
      ) : (
        // Show registration form if user is authenticated
        <>
          <DialogTitle>Register for {activity?.title}</DialogTitle>
          <DialogContent
            sx={{
              maxHeight: "70vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#c1c1c1",
                borderRadius: "4px",
                "&:hover": {
                  background: "#a8a8a8",
                },
              },
            }}
          >
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            {/* User Detail Inputs in Grid */}
            <Grid container spacing={2} mb={3}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  label="First Name"
                  name="firstName"
                  value={userDetails.firstName}
                  onChange={handleUserDetailChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={userDetails.lastName}
                  onChange={handleUserDetailChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={userDetails.email}
                  onChange={handleUserDetailChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  label="Phone"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleUserDetailChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Packs Accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Select a Pack
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {packsLoading ? (
                  <CircularProgress size={24} />
                ) : packsError ? (
                  <Alert severity="error">{packsError}</Alert>
                ) : packs.length > 0 ? (
                  <RadioGroup
                    name="pack"
                    value={selectedPack}
                    onChange={(e) => setSelectedPack(e.target.value)}
                  >
                    {packs.map((pack) => (
                      <FormControlLabel
                        key={pack.id}
                        value={pack.id}
                        control={<Radio />}
                        label={
                          <Stack>
                            <Typography fontWeight={600}>
                              {pack.title}({pack.classType}){" "}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ₹{pack.price} &nbsp;•&nbsp;{" "}
                              {pack.numberOfSessions} session
                              {pack.numberOfSessions > 1 ? "s" : ""}{" "}
                              &nbsp;•&nbsp;
                              {pack.duration} days
                            </Typography>
                          </Stack>
                        }
                        sx={{ alignItems: "flex-start", mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    No packs available.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Schedules Accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Select a Schedule
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {schedulesLoading ? (
                  <CircularProgress size={24} />
                ) : schedulesError ? (
                  <Alert severity="error">{schedulesError}</Alert>
                ) : schedules.length > 0 ? (
                  <RadioGroup
                    name="schedule"
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                  >
                    {schedules.map((sched) => (
                      <FormControlLabel
                        key={sched.id}
                        value={sched.id}
                        control={<Radio />}
                        label={`${dayOfWeekLabels[sched.dayOfWeek]}, ${
                          sched.startTime
                        } - ${sched.endTime}`}
                        sx={{ alignItems: "flex-start", mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    No schedules available.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Add-ons Accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Select Add-ons (optional)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {addons.length > 0 ? (
                  <FormGroup>
                    <Grid container spacing={1}>
                      {addons.map((addon) => (
                        <Grid
                          size={{
                            xs: 12,
                            sm: 6,
                          }}
                          md={4}
                          key={addon.id}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedAddOns.includes(addon.id)}
                                onChange={() => handleAddOnChange(addon.id)}
                              />
                            }
                            label={`${addon.name} - ₹${addon.price}`}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    No add-ons available.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={onClose}
              color="secondary"
              disabled={submitLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToPayment}
              variant="contained"
              disabled={!selectedPack || submitLoading}
            >
              {submitLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </DialogActions>
        </>
      )}
    </Box>
  );
};

export default RegisterForm;
