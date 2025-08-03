import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Switch,
  Chip,
  TableContainer,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import useClassSchedules from "../../hooks/useClassSchedules";
import { useAdminRefresh } from "../../hooks/useAdminRefresh";
import ClassScheduleDialog from "../forms/ClassScheduleDialog";

const ClassScheduleManager = () => {
  const {
    schedules,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deactivateSchedule,
    toggleActiveSchedule,
    refetch: fetchSchedules,
  } = useClassSchedules(); // no classId

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Listen for global refresh events from navbar
  useAdminRefresh(() => {
    console.log('ClassScheduleManager: Received admin refresh event');
    fetchSchedules();
  });

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setEditingSchedule(null);
    setDialogOpen(false);
  };

  const handleToggleActive = async (schedule) => {
    await toggleActiveSchedule(schedule.id, !schedule.isActive);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight="bold">
          Class Schedules
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Schedule
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : schedules.length === 0 ? (
        <Alert severity="info">No class schedules available.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.200" }}>
                <TableCell sx={{ fontWeight: 600 }}>Day</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>End Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id} hover>
                  <TableCell>
                    {
                      [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ][schedule.dayOfWeek]
                    }
                  </TableCell>
                  <TableCell>{schedule.startTime}</TableCell>
                  <TableCell>{schedule.endTime}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={schedule.isActive}
                        onChange={() => handleToggleActive(schedule)}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={schedule.isActive ? "Active" : "Inactive"}
                        color={schedule.isActive ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleEdit(schedule)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => deactivateSchedule(schedule.id)}
                        size="small"
                        color="primary"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ClassScheduleDialog
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={async (data) => {
          if (editingSchedule) await updateSchedule(editingSchedule.id, data);
          else await addSchedule(data);
          handleClose();
        }}
        initialValues={editingSchedule}
      />
    </Box>
  );
};

export default ClassScheduleManager;
