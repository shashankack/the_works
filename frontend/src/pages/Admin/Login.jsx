import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { setToken, setUser } from "../../utils/auth";
import { getCurrentUser } from "../../api/userService";
import logo from "../../assets/images/orange_logo.png";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Login | The Works";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and Password is required");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Login and get tokens
      const response = await axiosInstance.post("/auth/token", {
        email,
        password,
      });

      // 2. Save tokens
      setToken(response.data.accessToken, response.data.refreshToken);

      // 3. Fetch user data to get role information
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        // 4. Check if user is actually an admin
        if (userData.role !== "admin") {
          setError("Oops! 🕵️‍♂️ Looks like you're trying to sneak into the admin's secret lair. Nice try, but this area is for gym bosses only! 💪");
          return;
        }
      } catch (userError) {
        console.error("Failed to fetch user data:", userError);
        setError("Failed to verify admin privileges. Please try again.");
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={theme.palette.beige}
    >
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          mb: 2,
          color: theme.palette.orange,
          borderColor: theme.palette.orange,
          fontWeight: "bold",
          textTransform: "none",
          "&:hover": {
            borderColor: theme.palette.brown,
            color: theme.palette.brown,
            backgroundColor: theme.palette.beige,
          },
        }}
      >
        ← Go Back
      </Button>

      <Paper
        elevation={3}
        sx={{
          m: 1,
          p: 4,
          maxWidth: 500,
          width: "100%",
          bgcolor: theme.palette.beige,
          border: `2px solid ${theme.palette.orange}`,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Box mb={2} display="flex" justifyContent="center">
          <Box
            component="img"
            src={logo}
            alt="The Works Logo"
            sx={{ height: 150, objectFit: "contain" }}
          />
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: theme.palette.beige,
              color: theme.palette.orange,
              border: `1px solid ${theme.palette.orange}`,
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            autoComplete="off"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{
              input: { color: theme.palette.orange },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: theme.palette.orange },
                "&:hover fieldset": { borderColor: theme.palette.brown },
                "&.Mui-focused fieldset": { borderColor: theme.palette.orange },
              },
              "& label.Mui-focused": { color: theme.palette.orange },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    sx={{ color: theme.palette.orange }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              input: { color: theme.palette.orange },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: theme.palette.orange },
                "&:hover fieldset": { borderColor: theme.palette.brown },
                "&.Mui-focused fieldset": { borderColor: theme.palette.orange },
              },
              "& label.Mui-focused": { color: theme.palette.orange },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              bgcolor: theme.palette.orange,
              color: theme.palette.beige,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: theme.palette.brown,
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{ color: theme.palette.orange }}
              />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
