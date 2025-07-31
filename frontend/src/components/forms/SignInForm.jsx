import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { setToken, setUser } from "../../utils/auth";
import { getCurrentUser } from "../../api/userService";
import { useNavigate } from "react-router-dom";

const SignInForm = ({ onSuccess, onError }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Login and get tokens
      const res = await axiosInstance.post("/auth/token", form);

      // 2. Save tokens
      setToken(res.data.accessToken, res.data.refreshToken);

      // 3. Fetch user data using the token
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (userError) {
        console.error("Failed to fetch user data:", userError);
        // Continue anyway since login was successful
      }

      if (onSuccess) {
        onSuccess(res.data);
      }

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
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please check your credentials and try again.";
      setError(errMsg);
      if (onError) onError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to continue your fitness journey
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

        {/* Password Field */}
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          autoComplete="current-password"
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
            mb: 4,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Login />}
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
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </Box>
    </Box>
  );
};

export default SignInForm;
