import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  useMediaQuery,
  useTheme,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Container,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import RefreshIcon from "@mui/icons-material/Refresh";
import CachedIcon from "@mui/icons-material/Cached";

// Import the new cached hooks
import { useDashboard } from "../../hooks/useDashboard";
import { useCache } from "../../context/CacheContext";
import { getClassStatus, getEventStatus } from "../../utils/helpers";

// Forms
import EditForm from "../../components/forms/EditForm";
import CreateForm from "../../components/forms/CreateForm";
import DetailsModal from "../../components/Admin/DetailsModal";

// Components
import LoadingScreen from "../../components/Loader";
import axiosInstance from "../../api/axiosInstance";

const CacheIndicator = ({ isCached, isStale, onRefresh }) => (
  <Tooltip 
    title={
      isCached 
        ? `Data is ${isStale ? 'stale' : 'fresh'} and cached`
        : "Data not cached"
    }
  >
    <IconButton 
      size="small" 
      onClick={onRefresh}
      sx={{ 
        color: isCached ? (isStale ? "warning.main" : "success.main") : "text.secondary"
      }}
    >
      {isCached ? <CachedIcon /> : <RefreshIcon />}
    </IconButton>
  </Tooltip>
);

const StatusTabs = ({ value, onChange, counts, cacheStatus, onRefresh }) => (
  <Paper
    elevation={0}
    sx={{
      mb: 4,
      borderRadius: 3,
      backgroundColor: "white",
      border: "2px solid rgba(177, 83, 36, 0.1)",
      overflow: "hidden",
    }}
  >
    <Box sx={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      p: 2,
      borderBottom: "1px solid rgba(177, 83, 36, 0.1)"
    }}>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Hind Siliguri, sans-serif",
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        Dashboard Overview
      </Typography>
      
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CacheIndicator 
          isCached={cacheStatus.classes.isCached}
          isStale={cacheStatus.classes.isStale}
          onRefresh={() => onRefresh('classes')}
        />
        <CacheIndicator 
          isCached={cacheStatus.events.isCached}
          isStale={cacheStatus.events.isStale}
          onRefresh={() => onRefresh('events')}
        />
        <Tooltip title="Refresh all data">
          <IconButton onClick={() => onRefresh('all')} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
    
    <Tabs
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiTabs-indicator": {
          backgroundColor: "primary.main",
          height: 3,
        },
        "& .MuiTab-root": {
          textTransform: "none",
          fontFamily: "Average Sans, sans-serif",
          fontWeight: 600,
          fontSize: "16px",
          color: "text.secondary",
          minHeight: 72,
          "&.Mui-selected": {
            color: "primary.main",
          },
          "&:hover": {
            color: "primary.main",
            backgroundColor: "rgba(177, 83, 36, 0.05)",
          },
        },
      }}
    >
      <Tab
        icon={<FitnessCenterIcon />}
        label={
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Classes
            </Typography>
            <Chip
              label={counts.classes}
              size="small"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontSize: "12px",
                mt: 0.5,
              }}
            />
          </Box>
        }
        iconPosition="top"
      />
      <Tab
        icon={<EventIcon />}
        label={
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Events
            </Typography>
            <Chip
              label={counts.events}
              size="small"
              sx={{
                backgroundColor: "secondary.main",
                color: "white",
                fontSize: "12px",
                mt: 0.5,
              }}
            />
          </Box>
        }
        iconPosition="top"
      />
    </Tabs>
  </Paper>
);

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Use the new dashboard hook with caching
  const {
    classes,
    events,
    loading,
    errors,
    hasErrors,
    refreshAll,
    refreshClasses,
    refreshEvents,
    cacheStatus,
    hasStaleData,
    stats,
    invalidateRelatedCache
  } = useDashboard();

  const cache = useCache();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = async (type) => {
    switch (type) {
      case 'classes':
        await refreshClasses();
        break;
      case 'events':
        await refreshEvents();
        break;
      case 'all':
        await refreshAll();
        break;
      default:
        break;
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (itemToDelete) {
        const endpoint = tabValue === 0 ? `/classes/${itemToDelete.id}` : `/events/${itemToDelete.id}`;
        await axiosInstance.delete(endpoint);
        
        // Invalidate related cache and refresh
        invalidateRelatedCache(tabValue === 0 ? 'class' : 'event');
        if (tabValue === 0) {
          await refreshClasses();
        } else {
          await refreshEvents();
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleFormSuccess = async () => {
    // Invalidate cache and refresh data after successful form submission
    if (tabValue === 0) {
      invalidateRelatedCache('class');
      await refreshClasses();
    } else {
      invalidateRelatedCache('event');
      await refreshEvents();
    }
    
    setIsEditOpen(false);
    setIsCreateOpen(false);
    setSelectedItem(null);
  };

  const counts = {
    classes: stats.totalClasses,
    events: stats.totalEvents
  };

  const currentItems = tabValue === 0 ? classes : events;
  const currentType = tabValue === 0 ? "class" : "event";

  if (loading && (!classes?.length && !events?.length)) {
    return <LoadingScreen />;
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        pt: 10,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 6,
            p: 4,
            borderRadius: 4,
            backgroundColor: "white",
            border: "2px solid rgba(177, 83, 36, 0.1)",
            boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: "primary.main",
                  mr: 3,
                }}
              >
                <FitnessCenterIcon sx={{ color: "text.white", fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    fontSize: "32px",
                    fontFamily: "Hind Siliguri, sans-serif",
                    mb: 0.5,
                  }}
                >
                  Admin Dashboard
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: "16px",
                    fontFamily: "Average Sans, sans-serif",
                  }}
                >
                  {hasStaleData && (
                    <Chip 
                      size="small" 
                      label="Some data is stale" 
                      color="warning"
                      sx={{ mr: 2 }}
                    />
                  )}
                  Manage your fitness classes and events
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateOpen(true)}
              sx={{
                backgroundColor: "primary.main",
                color: "text.white",
                textTransform: "none",
                fontFamily: "Average Sans, sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                px: 3,
                py: 1.5,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(177, 83, 36, 0.3)",
                "&:hover": {
                  backgroundColor: "#9d4a20",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(177, 83, 36, 0.4)",
                },
              }}
            >
              Add New {tabValue === 0 ? "Class" : "Event"}
            </Button>
          </Box>
        </Paper>

        {/* Error Alert */}
        {hasErrors && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 3,
              backgroundColor: "rgba(244, 67, 54, 0.05)",
              border: "1px solid rgba(244, 67, 54, 0.2)",
            }}
          >
            {Object.entries(errors).map(([key, error]) => 
              error && <div key={key}>{key}: {error}</div>
            )}
          </Alert>
        )}

        {/* Status Tabs with Cache Indicators */}
        <StatusTabs
          value={tabValue}
          onChange={handleTabChange}
          counts={counts}
          cacheStatus={cacheStatus}
          onRefresh={handleRefresh}
        />

        {/* Content Grid */}
        <Grid container spacing={3}>
          {currentItems?.length === 0 ? (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 8,
                  textAlign: "center",
                  borderRadius: 4,
                  backgroundColor: "white",
                  border: "2px dashed rgba(177, 83, 36, 0.2)",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: "rgba(177, 83, 36, 0.1)",
                    color: "primary.main",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  {tabValue === 0 ? <FitnessCenterIcon sx={{ fontSize: 40 }} /> : <EventIcon sx={{ fontSize: 40 }} />}
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    color: "text.primary",
                    fontFamily: "Hind Siliguri, sans-serif",
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  No {tabValue === 0 ? "Classes" : "Events"} Found
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontFamily: "Average Sans, sans-serif",
                    mb: 3,
                  }}
                >
                  Start by creating your first {tabValue === 0 ? "fitness class" : "event"}.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsCreateOpen(true)}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "text.white",
                    textTransform: "none",
                    fontFamily: "Average Sans, sans-serif",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                  }}
                >
                  Create {tabValue === 0 ? "Class" : "Event"}
                </Button>
              </Paper>
            </Grid>
          ) : (
            currentItems?.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    backgroundColor: "white",
                    border: "2px solid transparent",
                    boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: "0 8px 30px rgba(177, 83, 36, 0.15)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={item.image || "/placeholder.jpg"}
                      alt={item.name || item.title}
                      sx={{ height: 200, objectFit: "cover" }}
                    />
                    <Chip
                      label={
                        tabValue === 0
                          ? getClassStatus(item)
                          : getEventStatus(item)
                      }
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "rgba(177, 83, 36, 0.9)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "text.primary",
                        fontSize: "18px",
                        fontFamily: "Hind Siliguri, sans-serif",
                        mb: 2,
                      }}
                    >
                      {item.name || item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: "Average Sans, sans-serif",
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: item.description || "No description available"
                      }}
                    />

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {tabValue === 0 && (
                        <Chip
                          icon={<LocalOfferIcon />}
                          label={`₹${item.price}`}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(177, 83, 36, 0.1)",
                            color: "primary.main",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                      {tabValue === 1 && item.date && (
                        <Chip
                          icon={<ScheduleIcon />}
                          label={new Date(item.date).toLocaleDateString()}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(78, 41, 22, 0.1)",
                            color: "secondary.main",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </Stack>
                  </CardContent>

                  <Box sx={{ p: 3, pt: 0 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(item)}
                        sx={{
                          flex: 1,
                          textTransform: "none",
                          fontFamily: "Average Sans, sans-serif",
                          fontWeight: 500,
                          borderColor: "primary.main",
                          color: "primary.main",
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "rgba(177, 83, 36, 0.05)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(item)}
                        sx={{
                          flex: 1,
                          textTransform: "none",
                          fontFamily: "Average Sans, sans-serif",
                          fontWeight: 500,
                          borderRadius: 2,
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Dialogs */}
      <CreateForm
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        type={currentType}
        onSuccess={handleFormSuccess}
      />

      <EditForm
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        item={selectedItem}
        type={currentType}
        onSuccess={handleFormSuccess}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "background.default",
            color: "text.primary",
            fontFamily: "Hind Siliguri, sans-serif",
            fontWeight: "bold",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "background.default", pt: 2 }}>
          <Typography sx={{ fontFamily: "Average Sans, sans-serif" }}>
            Are you sure you want to delete "{itemToDelete?.name || itemToDelete?.title}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "background.default", p: 3 }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{
              textTransform: "none",
              fontFamily: "Average Sans, sans-serif",
              color: "text.primary",
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
            sx={{
              textTransform: "none",
              fontFamily: "Average Sans, sans-serif",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
