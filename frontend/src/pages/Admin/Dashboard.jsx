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
} from "@mui/material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { useClasses } from "../../hooks/useClasses";
import { useEvents } from "../../hooks/useEvents";
import useClassPacks from "../../hooks/useClassPacks";
import useClassSchedules from "../../hooks/useClassSchedules";
import { getClassStatus, getEventStatus } from "../../utils/helpers";

// Forms
import EditForm from "../../components/forms/EditForm";
import CreateForm from "../../components/forms/CreateForm";
import DetailsModal from "../../components/Admin/DetailsModal";

// Components
import LoadingScreen from "../../components/Loader";
import axiosInstance from "../../api/axiosInstance";

const StatusTabs = ({ value, onChange, counts }) => (
  <Paper
    sx={{
      backgroundColor: "white",
      borderRadius: 3,
      p: 1,
      mb: 4,
      boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
      border: "1px solid rgba(177, 83, 36, 0.1)",
    }}
  >
    <Tabs
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      sx={{
        "& .MuiTabs-indicator": {
          backgroundColor: "primary.main",
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
        "& .MuiTab-root": {
          textTransform: "none",
          fontFamily: "Average Sans, sans-serif",
          fontWeight: 500,
          fontSize: "16px",
          color: "text.primary",
          minHeight: 48,
          borderRadius: 2,
          mr: 1,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(177, 83, 36, 0.05)",
          },
          "&.Mui-selected": {
            color: "primary.main",
            fontWeight: 600,
          },
        },
      }}
    >
      <Tab
        value="upcoming"
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ScheduleIcon fontSize="small" />
            <span>Upcoming</span>
            <Chip
              label={counts.upcoming || 0}
              size="small"
              sx={{
                backgroundColor: "#2196f3",
                color: "white",
                height: 20,
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            />
          </Box>
        }
      />
      <Tab
        value="ongoing"
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FitnessCenterIcon fontSize="small" />
            <span>Ongoing</span>
            <Chip
              label={counts.ongoing || 0}
              size="small"
              sx={{
                backgroundColor: "#4caf50",
                color: "white",
                height: 20,
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            />
          </Box>
        }
      />
      <Tab
        value="completed"
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalOfferIcon fontSize="small" />
            <span>Completed</span>
            <Chip
              label={counts.completed || 0}
              size="small"
              sx={{
                backgroundColor: "secondary.main",
                color: "text.white",
                height: 20,
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            />
          </Box>
        }
      />
    </Tabs>
  </Paper>
);

const ItemCard = ({
  item,
  onEdit,
  onDelete,
  classPacks = [],
  classSchedules = [],
}) => {
  const isClass = item?.id?.startsWith("class_");
  const status = item.status;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "#2196f3";
      case "ongoing":
        return "#4caf50";
      case "completed":
        return "#78909c";
      default:
        return "#78909c";
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        item.id.startsWith("event_")
          ? `/events/${item.id}`
          : `/classes/${item.id}`
      );
      onDelete?.();
      setConfirmOpen(false);
    } catch (err) {
      setError("Failed to delete. Please try again.");
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
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
          height="180"
          image={item.thumbnail}
          alt={item.title || item.name}
          sx={{
            objectFit: "cover",
          }}
        />
        {status && (
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: getStatusColor(status),
              color: "white",
              fontWeight: "bold",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "rgba(78, 41, 22, 0.8)",
            borderRadius: "50%",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isClass ? (
            <FitnessCenterIcon sx={{ color: "text.white", fontSize: 20 }} />
          ) : (
            <EventIcon sx={{ color: "text.white", fontSize: 20 }} />
          )}
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 1.5,
            color: "text.primary",
            fontSize: "18px",
            fontFamily: "Hind Siliguri, sans-serif",
            lineHeight: 1.3,
          }}
        >
          {item.title || item.name}
        </Typography>

        {item.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
            sx={{
              mb: 2,
              fontSize: "14px",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              "& p": {
                margin: 0,
              },
              "& br": {
                display: "none",
              },
              "& *": {
                fontSize: "inherit !important",
                lineHeight: "inherit !important",
              },
            }}
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}

        {classPacks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                mb: 1,
                color: "primary.main",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Class Packs
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={0.5}>
              {classPacks.slice(0, 2).map((pack) => (
                <Chip
                  key={pack.id}
                  label={pack.title || pack.name}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(177, 83, 36, 0.1)",
                    color: "primary.main",
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
              ))}
              {classPacks.length > 2 && (
                <Chip
                  label={`+${classPacks.length - 2} more`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(177, 83, 36, 0.1)",
                    color: "primary.main",
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        {classSchedules.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                mb: 1,
                color: "secondary.main",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Schedules
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={0.5}>
              {classSchedules.slice(0, 2).map((schedule) => (
                <Chip
                  key={schedule.id}
                  label={`${days[schedule.dayOfWeek]} ${schedule.startTime}–${
                    schedule.endTime
                  }`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(78, 41, 22, 0.1)",
                    color: "secondary.main",
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
              ))}
              {classSchedules.length > 2 && (
                <Chip
                  label={`+${classSchedules.length - 2} more`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(78, 41, 22, 0.1)",
                    color: "secondary.main",
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          {isClass && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
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
          )}
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
            sx={{
              flex: isClass ? 1 : "auto",
              textTransform: "none",
              fontFamily: "Average Sans, sans-serif",
              fontWeight: 500,
              borderRadius: 2,
            }}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
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
            Are you sure you want to permanently delete this{" "}
            {item.id.startsWith("event_") ? "event" : "class"}?
          </Typography>
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 2,
                backgroundColor: "rgba(244, 67, 54, 0.05)",
                border: "1px solid rgba(244, 67, 54, 0.2)",
              }}
            >
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "background.default", p: 3 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              textTransform: "none",
              fontFamily: "Average Sans, sans-serif",
              color: "text.primary",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
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
    </Card>
  );
};

const Section = ({
  title,
  items,
  tab,
  setTab,
  onEdit,
  onDelete,
  packs = [],
  schedules = [],
  onCreate,
  createLabel = "",
}) => {
  const counts = {
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  };

  const itemsWithStatus = items.map((item) => {
    let status = "completed";
    if (item.id.startsWith("event_")) {
      status = getEventStatus(item.startTime, item.endTime);
    } else if (item.classScheduleIds) {
      try {
        const scheduleIds = JSON.parse(item.classScheduleIds || "[]");
        const itemSchedules = scheduleIds
          .map((id) => schedules.find((s) => s.id === id))
          .filter(Boolean);

        status = getClassStatus(itemSchedules);
      } catch {
        status = "completed";
      }
    }
    counts[status]++;
    return { ...item, status };
  });

  const filtered = itemsWithStatus.filter((item) => item.status === tab);

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 6,
        p: 4,
        borderRadius: 4,
        backgroundColor: "background.default",
        border: "2px solid rgba(177, 83, 36, 0.1)",
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          pb: 2,
          borderBottom: "2px solid",
          borderBottomColor:
            title === "Classes" ? "primary.main" : "secondary.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor:
                title === "Classes" ? "primary.main" : "secondary.main",
              mr: 2,
            }}
          >
            {title === "Classes" ? (
              <FitnessCenterIcon sx={{ color: "text.white" }} />
            ) : (
              <EventIcon sx={{ color: "text.white" }} />
            )}
          </Avatar>
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                color: title === "Classes" ? "primary.main" : "secondary.main",
                fontSize: "28px",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: "16px",
                fontFamily: "Average Sans, sans-serif",
              }}
            >
              Manage your {title.toLowerCase()} and their schedules
            </Typography>
          </Box>
        </Box>

        {onCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{
              backgroundColor:
                title === "Classes" ? "primary.main" : "secondary.main",
              color: "text.white",
              textTransform: "none",
              fontFamily: "Average Sans, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              px: 3,
              py: 1.5,
              borderRadius: 3,
              boxShadow:
                title === "Classes"
                  ? "0 4px 20px rgba(177, 83, 36, 0.3)"
                  : "0 4px 20px rgba(78, 41, 22, 0.3)",
              "&:hover": {
                backgroundColor: title === "Classes" ? "#9d4a20" : "#3d1f11",
                transform: "translateY(-2px)",
                boxShadow:
                  title === "Classes"
                    ? "0 8px 30px rgba(177, 83, 36, 0.4)"
                    : "0 8px 30px rgba(78, 41, 22, 0.4)",
              },
            }}
          >
            {createLabel}
          </Button>
        )}
      </Box>

      {/* Status Tabs */}
      <StatusTabs value={tab} onChange={setTab} counts={counts} />

      {/* Content Grid */}
      <Grid container spacing={3}>
        {filtered.length === 0 ? (
          <Grid size={12}>
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 3,
                backgroundColor: "white",
                border: "2px dashed rgba(177, 83, 36, 0.2)",
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: "rgba(177, 83, 36, 0.1)",
                  color: "primary.main",
                  mx: "auto",
                  mb: 2,
                }}
              >
                {title === "Classes" ? (
                  <FitnessCenterIcon sx={{ fontSize: 32 }} />
                ) : (
                  <EventIcon sx={{ fontSize: 32 }} />
                )}
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",
                  fontFamily: "Hind Siliguri, sans-serif",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                No {tab} {title.toLowerCase()} found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontFamily: "Average Sans, sans-serif",
                }}
              >
                Create your first {title.toLowerCase().slice(0, -1)} to get
                started
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filtered.map((item) => {
            const classPacks = (() => {
              try {
                const ids = JSON.parse(item.classPackIds || "[]");
                return ids
                  .map((id) => packs.find((p) => p.id === id))
                  .filter(Boolean);
              } catch {
                return [];
              }
            })();

            const classSchedules = (() => {
              try {
                const ids = JSON.parse(item.classScheduleIds || "[]");
                return ids
                  .map((id) => schedules.find((s) => s.id === id))
                  .filter(Boolean);
              } catch {
                return [];
              }
            })();

            return (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
                key={item.id}
              >
                <ItemCard
                  item={item}
                  onEdit={
                    title.toLowerCase().includes("class") ? onEdit : undefined
                  }
                  onDelete={onDelete}
                  classPacks={classPacks}
                  classSchedules={classSchedules}
                />
              </Grid>
            );
          })
        )}
      </Grid>
    </Paper>
  );
};

const Dashboard = () => {
  const {
    classes,
    loading: loadingClasses,
    refetch: refetchClasses,
  } = useClasses();
  const {
    events,
    loading: loadingEvents,
    refetch: refetchEvents,
  } = useEvents();
  const { packs } = useClassPacks();
  const { schedules } = useClassSchedules();

  const [classTab, setClassTab] = useState("upcoming");
  const [eventTab, setEventTab] = useState("upcoming");

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState("class");
  const [editOpen, setEditOpen] = useState(false);
  const [editClass, setEditClass] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loadingClasses || loadingEvents) {
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
        {/* Dashboard Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "secondary.main",
              fontSize: "36px",
              fontFamily: "Hind Siliguri, sans-serif",
              mb: 2,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: "18px",
              fontFamily: "Average Sans, sans-serif",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Manage your fitness classes and events from one central location
          </Typography>
        </Box>

        {/* Classes Section */}
        <Section
          title="Classes"
          items={classes}
          tab={classTab}
          setTab={setClassTab}
          onEdit={(classItem) => {
            setEditClass(classItem);
            setEditOpen(true);
          }}
          packs={packs}
          schedules={schedules}
          onDelete={refetchClasses}
          onCreate={() => {
            setCreateType("class");
            setCreateOpen(true);
          }}
          createLabel="Create New Class"
        />

        {/* Events Section */}
        <Section
          title="Events"
          items={events}
          tab={eventTab}
          setTab={setEventTab}
          onDelete={refetchEvents}
          onCreate={() => {
            setCreateType("event");
            setCreateOpen(true);
          }}
          createLabel="Create New Event"
        />
      </Container>

      {/* Modals */}
      <DetailsModal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        type={selectedType}
      />

      <CreateForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        type={createType}
        onSuccess={() => {
          if (createType === "class") refetchClasses();
          else refetchEvents();
        }}
      />

      <EditForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        classData={editClass}
        onSuccess={() => {
          refetchClasses();
          setEditOpen(false);
        }}
      />
    </Box>
  );
};

export default Dashboard;
