import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { setToken, setUser } from "../../utils/auth";
import { getCurrentUser } from "../../api/userService";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ onSuccess, onError, disableNavigation = false }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all required fields.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      // 1. Register and get tokens
      const res = await axiosInstance.post("/auth/register", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      // 2. Save tokens
      setToken(res.data.accessToken, res.data.refreshToken);

      // 3. Fetch user data using the token
      let finalUserData;
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        finalUserData = userData;
      } catch (userError) {
        console.error("Failed to fetch user data:", userError);
        // Fallback to form data since registration was successful
        const fallbackUser = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        };
        setUser(fallbackUser);
        finalUserData = fallbackUser;
      }

      // Call onSuccess with the complete data structure expected by RegisterForm
      if (onSuccess) {
        onSuccess({
          ...res.data,
          user: finalUserData
        });
      }

      // Navigate only if navigation is not disabled
      if (!disableNavigation) {
        // Check if there's a pending registration
        const pendingRegistration = sessionStorage.getItem("pendingRegistration");
        if (pendingRegistration) {
          // Clear the pending registration
          sessionStorage.removeItem("pendingRegistration");
          // Navigate back to home and let the registration flow continue
          navigate("/");
        } else {
          // Default navigation
          navigate("/"); // Navigate to home instead of dashboard for users
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Please try again.";
      setError(msg);
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>
          Join Us Today
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create your account and start your fitness journey
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            "& .MuiAlert-message": {
              fontSize: "0.9rem",
            },
          }}
        >
          {error}
        </Alert>
      )}

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ width: "100%" }}
      >
        {/* Name Fields */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              }}
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
              value={form.lastName}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Email Field */}
        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          autoComplete="email"
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        {/* Phone Field */}
        <TextField
          label="Phone Number (Optional)"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          autoComplete="tel"
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        {/* Password Fields */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="new-password"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="new-password"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontSize: "1.1rem",
            fontWeight: 600,
            textTransform: "none",
            background: "linear-gradient(45deg, #B15324 30%, #D4621B 90%)",
            boxShadow: "0 4px 20px rgba(177, 83, 36, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #9A4A21 30%, #B15324 90%)",
              boxShadow: "0 6px 25px rgba(177, 83, 36, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: "rgba(177, 83, 36, 0.3)",
              color: "white",
            },
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </Box>
    </Box>
  );
};

export default SignUpForm;
