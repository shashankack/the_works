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
} from "@mui/material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  <Tabs
    value={value}
    onChange={(e, newValue) => onChange(newValue)}
    textColor="primary"
    indicatorColor="primary"
    sx={{ mb: 3 }}
  >
    <Tab value="upcoming" label={`Upcoming (${counts.upcoming || 0})`} />
    <Tab value="ongoing" label={`Ongoing (${counts.ongoing || 0})`} />
    <Tab value="completed" label={`Completed (${counts.completed || 0})`} />
  </Tabs>
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
      setError("Failed to delete class. Please try again.");
    }
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        boxShadow: "0 2px 16px 0 rgba(24,40,74,0.06)",
        border: "1px solid #f2f3f5",
        backgroundColor: "#fff",
        transition: "box-shadow 0.25s, transform 0.25s",
        "&:hover": {
          boxShadow: "0 8px 32px 0 rgba(24,40,74,0.10)",
          transform: "translateY(-4px) scale(1.025)",
          borderColor: "primary.light",
        },
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image={item.thumbnail}
        alt={item.title}
      />

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" fontWeight="bold">
            {item.title}
          </Typography>
          {status && (
            <Chip
              label={status}
              size="small"
              color={
                status === "upcoming"
                  ? "info"
                  : status === "ongoing"
                  ? "success"
                  : "default"
              }
            />
          )}
        </Box>

        {classPacks.length > 0 && (
          <Box mt={1}>
            <Typography variant="body1" color="text.secondary">
              Packs
            </Typography>
            <Grid container spacing={1} mt={0.5}>
              {classPacks.map((pack) => (
                <Grid size={6} key={pack.id}>
                  <Chip
                    key={pack.id}
                    label={`${pack.title} (${pack.classType})`}
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {classSchedules.length > 0 && (
          <Box mt={1}>
            <Typography variant="body1" color="text.secondary">
              Schedules
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1} mt={0.5}>
              {classSchedules.map((s) => (
                <Chip
                  key={s.id}
                  label={`${days[s.dayOfWeek]} ${s.startTime}–${s.endTime}`}
                  size="small"
                  color="default"
                />
              ))}
            </Stack>
          </Box>
        )}

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          {isClass && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              Edit
            </Button>
          )}
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete this{" "}
            {item.id.startsWith("event_") ? "event" : "class"}?
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
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
    <Box mb={10} maxWidth="lg" mx="auto">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ letterSpacing: 0.2, color: "primary.main" }}
        >
          {title}
        </Typography>
        {onCreate && (
          <Button
            variant="contained"
            startIcon={
              title === "Classes" ? <FitnessCenterIcon /> : <EventIcon />
            }
            onClick={onCreate}
          >
            {createLabel}
          </Button>
        )}
      </Box>
      <StatusTabs
        value={tab}
        onChange={setTab}
        counts={counts}
        sx={{ mb: 4 }}
      />
      <Grid container spacing={3}>
        {filtered.length === 0 ? (
          <Grid size={12}>
            <Typography>
              No {tab} {title.toLowerCase()} found.
            </Typography>
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
                  onDelete={onDelete} // Always pass!
                  classPacks={classPacks}
                  classSchedules={classSchedules}
                />
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
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
    <Box p={isMobile ? 2 : 4} mt={8} overflow="hidden">
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
        createLabel="Create Class"
      />
      <Section
        title="Events"
        items={events}
        tab={eventTab}
        setTab={setEventTab}
        onDelete={refetchEvents} // ADD THIS FOR REFRESH ON EVENT DELETE!
        onCreate={() => {
          setCreateType("event");
          setCreateOpen(true);
        }}
        createLabel="Create Event"
      />

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
