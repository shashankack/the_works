import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Alert,
  Typography,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FitnessCenter, SportsGymnastics } from "@mui/icons-material";
import SignInForm from "../components/forms/SignInForm";
import SignUpForm from "../components/forms/SignUpForm";

const AuthPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [generalError, setGeneralError] = useState(null);
  const [showPendingMessage, setShowPendingMessage] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Check if user came here from a registration attempt
    const pendingRegistration = sessionStorage.getItem("pendingRegistration");
    if (pendingRegistration) {
      setShowPendingMessage(true);
    }
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setGeneralError(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, 
            rgba(177, 83, 36, 0.9) 0%, 
            rgba(78, 41, 22, 0.95) 35%,
            rgba(177, 83, 36, 0.9) 70%,
            rgba(212, 98, 27, 0.85) 100%
          ),
          linear-gradient(45deg, #E3DED3 0%, #F5F2E8 50%, #E3DED3 100%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: isMobile ? 80 : 120,
          height: isMobile ? 80 : 120,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          right: "10%",
          width: isMobile ? 60 : 100,
          height: isMobile ? 60 : 100,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          animation: "float 4s ease-in-out infinite reverse",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: isMobile ? 40 : 80,
          height: isMobile ? 40 : 80,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.06)",
          animation: "float 8s ease-in-out infinite",
        }}
      />

      {/* Fitness Icons */}
      <FitnessCenter
        sx={{
          position: "absolute",
          top: "20%",
          right: "15%",
          fontSize: isMobile ? 40 : 60,
          color: "rgba(255, 255, 255, 0.1)",
          animation: "pulse 3s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.1, transform: "scale(1)" },
            "50%": { opacity: 0.2, transform: "scale(1.1)" },
          },
        }}
      />
      <SportsGymnastics
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "20%",
          fontSize: isMobile ? 35 : 50,
          color: "rgba(255, 255, 255, 0.08)",
          animation: "pulse 4s ease-in-out infinite reverse",
        }}
      />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: 4,
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
              color: "white",
            }}
          ></Box>

          {/* Auth Card */}
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              boxShadow: `
                0 32px 64px rgba(0, 0, 0, 0.15),
                0 16px 32px rgba(177, 83, 36, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.6)
              `,
            }}
          >
            {/* Card Decorative Elements */}
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, rgba(177, 83, 36, 0.08) 30%, rgba(212, 98, 27, 0.05) 90%)",
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, rgba(78, 41, 22, 0.06) 30%, rgba(177, 83, 36, 0.04) 90%)",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1, p: isMobile ? 3 : 4 }}>
              {/* Enhanced Tabs */}
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="Authentication Tabs"
                variant="fullWidth"
                sx={{
                  mb: 4,
                  "& .MuiTabs-flexContainer": {
                    background: "rgba(177, 83, 36, 0.05)",
                    borderRadius: 3,
                    p: 0.5,
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "text.secondary",
                    borderRadius: 2.5,
                    transition: "all 0.3s ease",
                    "&.Mui-selected": {
                      color: "white",
                      background:
                        "linear-gradient(45deg, #B15324 30%, #D4621B 90%)",
                      boxShadow: "0 4px 12px rgba(177, 83, 36, 0.4)",
                    },
                    "&:hover": {
                      background: "rgba(177, 83, 36, 0.08)",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>

              {/* Messages */}
              {showPendingMessage && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: "rgba(2, 136, 209, 0.08)",
                    border: "1px solid rgba(2, 136, 209, 0.2)",
                    "& .MuiAlert-message": {
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    },
                    "& .MuiAlert-icon": {
                      color: "info.main",
                    },
                  }}
                >
                  Please sign in or create an account to continue with your
                  registration.
                </Alert>
              )}

              {generalError && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: "rgba(211, 47, 47, 0.08)",
                    border: "1px solid rgba(211, 47, 47, 0.2)",
                    "& .MuiAlert-message": {
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    },
                  }}
                >
                  {generalError}
                </Alert>
              )}

              {/* Forms */}
              <Box
                sx={{
                  "& .MuiTextField-root": {
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                        boxShadow: "0 0 0 3px rgba(177, 83, 36, 0.1)",
                      },
                    },
                  },
                }}
              >
                {tabIndex === 0 && (
                  <SignInForm
                    onSuccess={() => setGeneralError(null)}
                    onError={(msg) => setGeneralError(msg)}
                  />
                )}

                {tabIndex === 1 && (
                  <SignUpForm
                    onSuccess={() => setGeneralError(null)}
                    onError={(msg) => setGeneralError(msg)}
                  />
                )}
              </Box>
            </Box>
          </Paper>

          {/* Footer */}
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                fontWeight: 300,
              }}
            >
              Join our community of fitness enthusiasts
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;
