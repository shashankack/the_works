// src/components/ClassScheduleDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ClassScheduleDialog = ({ open, onClose, onSubmit, initialValues }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      dayOfWeek: 0, // Sunday
      startTime: "",
      endTime: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Class Schedule</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Day of Week"
                {...register("dayOfWeek")}
                error={!!errors.dayOfWeek}
                helperText={errors.dayOfWeek?.message}
              >
                {days.map((day, index) => (
                  <MenuItem key={index} value={index}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                {...register("startTime")}
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="time"
                label="End Time"
                {...register("endTime")}
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClassScheduleDialog;
