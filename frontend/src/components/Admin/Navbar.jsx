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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const drawerWidth = 240;

const navLinks = [
  { label: "Home", to: "/admin/dashboard" },
  { label: "Trainers", to: "/admin/trainers" },
  { label: "Activites", to: "/admin/manage-activities" },
  { label: "Bookings", to: "/admin/bookings", showBadge: true },
  { label: "Enquiries", to: "/admin/enquiries" },
];

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0); // TODO: fetch count

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  const renderLink = ({ label, to, showBadge }) => (
    <Button
      key={label}
      component={RouterLink}
      to={to}
      sx={{ color: "text.white" }}
    >
      {showBadge ? (
        <Badge
          badgeContent={pendingCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.75rem",
              minWidth: 20,
              height: 20,
              padding: "0 6px",
              animation: pendingCount > 0 ? "pulse 1.5s infinite" : "none",
            },
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.15)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <NotificationsIcon color="inherit" sx={{ mr: 1 }} />
        </Badge>
      ) : null}
      {label}
    </Button>
  );

  const renderDrawerItem = ({ label, to, showBadge }) => (
    <ListItemButton key={label} component={RouterLink} to={to}>
      <ListItemText primary={label} />
      {showBadge && (
        <Badge
          badgeContent={pendingCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.75rem",
              minWidth: 20,
              height: 20,
              padding: "0 6px",
              animation: pendingCount > 0 ? "pulse 1.5s infinite" : "none",
            },
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.15)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <NotificationsIcon color="action" />
        </Badge>
      )}
    </ListItemButton>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.orange,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile ? (
            <IconButton color="inherit" onClick={toggleDrawer} edge="start">
              <MenuIcon />
            </IconButton>
          ) : (
            <Typography
              variant="h6"
              sx={{ color: theme.palette.beige, fontWeight: "bold" }}
            >
              The Works
            </Typography>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {navLinks.map(renderLink)}
            </Box>
          )}

          <IconButton color="inherit" onClick={logout}>
            Logout
          </IconButton>
        </Toolbar>
      </AppBar>

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
              borderColor: theme.palette.brown,
              backgroundColor: theme.palette.beige,
            },
          }}
        >
          <Box sx={{ p: 2, backgroundColor: theme.palette.orange }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.palette.beige}
            >
              The Works
            </Typography>
          </Box>
          <List>{navLinks.map(renderDrawerItem)}</List>
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
