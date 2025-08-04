import { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  Container,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import TextAnimation from "./TextAnimation";
import { isAuthenticated, logout, getUser } from "../utils/auth";

import logo from "../assets/images/beige_logo.png";

const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const scrollThreshold = 10;
    const triggerLimit = 1000;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);

      if (diff < scrollThreshold) return;

      // Only trigger hide/show behavior after scrolling past the limit
      if (currentScrollY > triggerLimit) {
        // Show/hide header based on scroll direction
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        // Always show header when above the trigger limit
        setIsVisible(true);
      }

      // Set scrolled state for styling
      setIsScrolled(currentScrollY > 50);

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = isAuthenticated();
      setUserAuthenticated(authenticated);
      if (authenticated) {
        const user = getUser();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    };

    // Check on component mount
    checkAuthStatus();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navItems = [
    { name: "HOME", sectionId: "hero-section" },
    { name: "ABOUT US", sectionId: "about-section" },
    { name: "ACTIVITIES", sectionId: "activities-section" },
    { name: "OUR TEAM", sectionId: "team-section" },
    { name: "CONTACT US", sectionId: "contact-section" },
  ];

  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // If we're on home page, scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setIsDrawerOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setUserAuthenticated(false);
    setCurrentUser(null);
    setIsDrawerOpen(false);
  };

  // Handle hash navigation on page load
  useEffect(() => {
    if (location.hash && location.pathname === "/") {
      const sectionId = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 100,
          backgroundColor: "rgba(177, 83, 36, 1)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ minHeight: "70px" }}
          >
            {/* Logo Section */}
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
              onClick={() => scrollToSection("hero-section")}
            >
              <Box
                sx={{
                  height: 100,
                  width: 100,
                }}
              >
                <Box
                  component="img"
                  src={logo}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" spacing={4} alignItems="center">
                {navItems.map((item) => (
                  <TextAnimation
                    key={item.name}
                    text={item.name}
                    color="background.default"
                    animatedColor="secondary.main"
                    linkHref={`/#${item.sectionId}`}
                  />
                ))}
                
                {/* Sign Out Button for Desktop */}
                {userAuthenticated && (
                  <Button
                    onClick={handleSignOut}
                    startIcon={<LogoutIcon />}
                    sx={{
                      color: "background.default",
                      textTransform: "none",
                      fontFamily: "Average Sans, sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "background.default",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "background.default",
                        color: "primary.main",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {currentUser?.firstName ? `Sign Out (${currentUser.firstName})` : "Sign Out"}
                  </Button>
                )}
              </Stack>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setIsDrawerOpen(true)}
                sx={{
                  color: "text.secondary",
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "white",
            width: "280px",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Drawer Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                fontFamily: "Hind Siliguri, sans-serif",
                fontWeight: "bold",
              }}
            >
              Menu
            </Typography>
            <IconButton
              onClick={() => setIsDrawerOpen(false)}
              sx={{ color: "text.primary" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Navigation Items */}
          <Stack spacing={3} mb={4}>
            {navItems.map((item) => (
              <Typography
                key={item.name}
                variant="body1"
                sx={{
                  color: "background.default",
                  fontFamily: "Average Sans, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "28px",
                  "&:hover": {
                    color: "background.default",
                  },
                }}
                onClick={() => scrollToSection(item.sectionId)}
              >
                {item.name}
              </Typography>
            ))}
            
            {/* Sign Out Button for Mobile */}
            {userAuthenticated && (
              <Button
                onClick={handleSignOut}
                startIcon={<LogoutIcon />}
                sx={{
                  color: "primary.main",
                  textTransform: "none",
                  fontFamily: "Average Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  py: 1.5,
                  mt: 2,
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: "primary.main",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "background.default",
                  },
                }}
                fullWidth
              >
                {currentUser?.firstName ? `Sign Out (${currentUser.firstName})` : "Sign Out"}
              </Button>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
