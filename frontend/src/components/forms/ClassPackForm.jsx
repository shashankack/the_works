// src/components/ClassPackDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const schema = z.object({
  title: z.string().min(1),
  numberOfSessions: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
  duration: z.coerce.number().min(1),
  classType: z.enum(["solo", "group"]),
  isActive: z.boolean().default(true),
});

const ClassPackDialog = ({ open, onClose, onSubmit, initialValues }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      title: "",
      numberOfSessions: 1,
      price: 0,
      duration: 30,
      classType: "group",
      isActive: true,
    },
  });

  const handleClose = () => {
    reset();
    setErrorMessage("");
    onClose();
  };

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (err) {
      setErrorMessage("Failed to save class pack. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? "Edit" : "Add"} Class Pack</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration (days)"
                type="number"
                {...register("duration")}
                error={!!errors.duration}
                helperText={errors.duration?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sessions"
                type="number"
                {...register("numberOfSessions")}
                error={!!errors.numberOfSessions}
                helperText={errors.numberOfSessions?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                {...register("price")}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Class Type"
                {...register("classType")}
                error={!!errors.classType}
                helperText={errors.classType?.message}
              >
                <MenuItem value="solo">Solo</MenuItem>
                <MenuItem value="group">Group</MenuItem>
              </TextField>
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

export default ClassPackDialog;
