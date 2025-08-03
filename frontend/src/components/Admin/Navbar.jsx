import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Badge,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { logout } from "../../utils/auth";
import useEnquiries from "../../hooks/useEnquiries";
import useBookings from "../../hooks/useBookings";

const drawerWidth = 240;

const navLinks = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: DashboardIcon,
  },
  {
    label: "Trainers",
    to: "/admin/trainers",
    icon: PeopleIcon,
  },
  {
    label: "Activities",
    to: "/admin/manage-activities",
    icon: FitnessCenterIcon,
  },
  {
    label: "Bookings",
    to: "/admin/bookings",
    showBadge: true,
    icon: BookOnlineIcon,
  },
  {
    label: "Enquiries",
    to: "/admin/enquiries",
    showBadge: true,
    icon: ContactMailIcon,
  },
];

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { enquiries, fetchEnquiries } = useEnquiries();
  const { bookings, fetchData: fetchBookings } = useBookings({
    adminMode: true,
  });

  // Calculate pending enquiries count (new enquiries without status)
  const pendingEnquiriesCount = enquiries.filter(
    (enquiry) => !enquiry.status || enquiry.status === "new"
  ).length;

  // Calculate pending bookings count (bookings with pending status)
  const pendingBookingsCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  useEffect(() => {
    // Fetch enquiries and bookings to get count for badges
    fetchEnquiries();
    fetchBookings();
  }, []);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const renderLink = ({ label, to, showBadge, icon: Icon }) => {
    const badgeCount =
      showBadge && label === "Enquiries"
        ? pendingEnquiriesCount
        : showBadge && label === "Bookings"
        ? pendingBookingsCount
        : 0;

    return (
      <Button
        key={label}
        component={RouterLink}
        to={to}
        startIcon={<Icon />}
        sx={{
          color: "text.white",
          textTransform: "none",
          fontFamily: "Average Sans, sans-serif",
          fontWeight: 500,
          fontSize: "16px",
          px: 2,
          py: 1,
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(227, 222, 211, 0.1)",
            transform: "translateY(-1px)",
          },
        }}
      >
        {showBadge && badgeCount > 0 ? (
          <Badge
            badgeContent={badgeCount}
            color="error"
            sx={{
              ml: 1,
              "& .MuiBadge-badge": {
                fontSize: "0.75rem",
                minWidth: 18,
                height: 18,
                backgroundColor: "#ff4444",
                color: "white",
                fontWeight: "bold",
                animation: badgeCount > 0 ? "pulse 1.5s infinite" : "none",
              },
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.2)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          >
            <NotificationsIcon sx={{ fontSize: 18 }} />
          </Badge>
        ) : null}
        {label}
      </Button>
    );
  };

  const renderDrawerItem = ({ label, to, showBadge, icon: Icon }) => {
    const badgeCount =
      showBadge && label === "Enquiries"
        ? pendingEnquiriesCount
        : showBadge && label === "Bookings"
        ? pendingBookingsCount
        : 0;

    return (
      <ListItemButton
        key={label}
        component={RouterLink}
        to={to}
        sx={{
          py: 1.5,
          px: 3,
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(177, 83, 36, 0.1)",
            transform: "translateX(4px)",
          },
        }}
      >
        <Icon sx={{ mr: 2, color: "primary.main", fontSize: 22 }} />
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontFamily: "Average Sans, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            color: "text.primary",
          }}
        />
        {showBadge && badgeCount > 0 && (
          <Badge
            badgeContent={badgeCount}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.75rem",
                minWidth: 18,
                height: 18,
                backgroundColor: "#ff4444",
                color: "white",
                fontWeight: "bold",
                animation: badgeCount > 0 ? "pulse 1.5s infinite" : "none",
              },
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.2)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          >
            <NotificationsIcon sx={{ color: "primary.main", fontSize: 20 }} />
          </Badge>
        )}
      </ListItemButton>
    );
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "primary.main",
          borderBottom: "3px solid",
          borderBottomColor: "secondary.main",
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: "0 4px 20px rgba(177, 83, 36, 0.25)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile ? (
              <IconButton
                color="inherit"
                onClick={toggleDrawer}
                edge="start"
                sx={{
                  mr: 2,
                  color: "text.white",
                  "&:hover": {
                    backgroundColor: "rgba(227, 222, 211, 0.1)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : null}

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "text.white",
                  color: "primary.main",
                  fontWeight: "bold",
                  fontSize: "18px",
                  mr: 2,
                }}
              >
                TW
              </Avatar>
              <Typography
                variant="h1"
                sx={{
                  color: "text.white",
                  fontWeight: "bold",
                  fontSize: "24px",
                  fontFamily: "Hind Siliguri, sans-serif",
                }}
              >
                The Works Admin
              </Typography>
            </Box>
          </Box>

          {/* Center Navigation (Desktop) */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                backgroundColor: "rgba(227, 222, 211, 0.05)",
                borderRadius: 3,
                p: 1,
              }}
            >
              {navLinks.map(renderLink)}
            </Box>
          )}

          {/* Right Section */}
          <Button
            onClick={() => logout()}
            startIcon={<LogoutIcon />}
            sx={{
              color: "text.white",
              textTransform: "none",
              fontFamily: "Average Sans, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              px: 3,
              py: 1,
              borderRadius: 2,
              border: "2px solid",
              borderColor: "text.white",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "text.white",
                color: "primary.main",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(227, 222, 211, 0.3)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "background.default",
              borderRight: "3px solid",
              borderRightColor: "primary.main",
            },
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              p: 3,
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "text.white",
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "14px",
                mr: 1.5,
              }}
            >
              TW
            </Avatar>
            <Typography
              variant="h1"
              fontWeight="bold"
              sx={{
                color: "text.white",
                fontSize: "20px",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              The Works
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(177, 83, 36, 0.2)" }} />

          {/* Navigation Links */}
          <Box sx={{ p: 1, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                px: 3,
                py: 2,
                color: "text.secondary",
                fontWeight: "bold",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Navigation
            </Typography>
            <List sx={{ p: 0 }}>{navLinks.map(renderDrawerItem)}</List>
          </Box>

          <Divider sx={{ borderColor: "rgba(177, 83, 36, 0.2)" }} />

          {/* Logout Button in Drawer */}
          <Box sx={{ p: 2 }}>
            <Button
              onClick={logout}
              startIcon={<LogoutIcon />}
              fullWidth
              sx={{
                color: "primary.main",
                textTransform: "none",
                fontFamily: "Average Sans, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                py: 1.5,
                borderRadius: 2,
                border: "2px solid",
                borderColor: "primary.main",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "text.white",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
