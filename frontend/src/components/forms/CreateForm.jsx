import { useState, useEffect } from "react";
import {
  Dialog,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Zoom,
  Tooltip,
  Box,
  MenuItem,
} from "@mui/material";
import UploadImage from "../UploadImage.jsx";
import { createClass } from "../../api/classService";
import { createEvent } from "../../api/eventService";
import axiosInstance from "../../api/axiosInstance";
import RTEWrapper from "../RichTextEditor";
import useTrainers from "../../hooks/useTrainers.js";
import useClassPacks from "../../hooks/useClassPacks";
import useClassSchedules from "../../hooks/useClassSchedules";

const defaultValues = {
  title: "",
  description: "",
  instructions: "",
  location:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0181960939412!2d77.60356488538241!3d12.970687382283348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16807d7b900b%3A0xba7b97b63f0ea410!2sMount%20Blue!5e0!3m2!1sen!2sin!4v1753001136826!5m2!1sen!2sin",
  thumbnail: "",
  gallery: [],
  maxSpots: 10,
  startDateTime: "",
  endDateTime: "",
  trainerId: "",
  classPackIds: [],
  classScheduleIds: [],
};

const convertToOffsetISO = (localStr) => {
  if (!localStr) return undefined;
  const date = new Date(localStr);
  return date.toISOString();
};

async function uploadSingleFile(file, url) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

async function uploadMultipleFiles(files, url) {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  const { data } = await axiosInstance.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.urls;
}

const CreateForm = ({ open, onClose, type, onSuccess }) => {
  const { packs } = useClassPacks();
  const { schedules } = useClassSchedules();
  const { trainers } = useTrainers();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({ ...defaultValues });

  useEffect(() => {
    if (open) setFields({ ...defaultValues });
  }, [open]);

  // Compose list of required fields
  const requiredKeys = [
    "title",
    "description",
    "instructions",
    "location",
    "thumbnail",
    "maxSpots",
  ];
  if (type === "event") {
    requiredKeys.push("startDateTime");
  }
  // Always require at least one gallery image
  requiredKeys.push("gallery");

  // Utility: check if all required fields are filled
  const isReady = () => {
    for (const key of requiredKeys) {
      if (key === "gallery") {
        if (!fields.gallery || fields.gallery.length === 0) return false;
      } else if (
        !fields[key] ||
        (typeof fields[key] === "string" && !fields[key].trim())
      ) {
        return false;
      }
    }
    return true;
  };

  // Field change handler for controlled state
  const handleField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  // Submit handler
  const handleCreate = async () => {
    setLoading(true);
    try {
      const finalData = { ...fields };

      // Upload thumbnail
      if (finalData.thumbnail && finalData.thumbnail instanceof File) {
        finalData.thumbnail = await uploadSingleFile(
          finalData.thumbnail,
          "/uploads/thumbnail"
        );
      }
      // Upload gallery images
      if (
        Array.isArray(finalData.gallery) &&
        finalData.gallery.some((g) => g instanceof File)
      ) {
        const files = finalData.gallery.filter((g) => g instanceof File);
        const urls = finalData.gallery.filter((g) => typeof g === "string");
        let uploaded = [];
        if (files.length) {
          uploaded = await uploadMultipleFiles(files, "/uploads/gallery");
        }
        finalData.gallery = [...urls, ...uploaded];
      }

      // Event/class API call
      if (type === "event") {
        finalData.startDateTime = convertToOffsetISO(finalData.startDateTime);
        finalData.endDateTime = convertToOffsetISO(finalData.endDateTime);
        delete finalData.classPackIds;
        delete finalData.classScheduleIds;
        await createEvent(finalData);
      } else {
        delete finalData.startDateTime;
        delete finalData.endDateTime;
        await createClass(finalData);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      alert("Create failed. Try again.");
      // Optionally log: console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create {type === "class" ? "Class" : "Event"}</DialogTitle>
      <DialogContent dividers sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              label="Title"
              fullWidth
              required
              value={fields.title}
              onChange={(e) => handleField("title", e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <RTEWrapper
              label="Description"
              value={fields.description}
              onChange={(val) => handleField("description", val)}
            />
          </Grid>
          <Grid size={12}>
            <RTEWrapper
              label="Instructions"
              value={fields.instructions}
              onChange={(val) => handleField("instructions", val)}
              placeholder="Optional instructions for participants"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Tooltip
              arrow
              followCursor
              title="This is the default location. Change only if you have a different location URL."
              leaveDelay={100}
              slots={{ transition: Zoom }}
              slotProps={{
                transition: { timeout: 300 },
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: { offset: [0, 2] },
                    },
                  ],
                },
              }}
            >
              <TextField
                fullWidth
                label={
                  <Box display="flex" alignItems="center">
                    Location URL*
                  </Box>
                }
                value={fields.location}
                onChange={(e) => handleField("location", e.target.value)}
              />
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Max Spots"
              type="number"
              fullWidth
              required
              value={fields.maxSpots}
              onChange={(e) =>
                handleField(
                  "maxSpots",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Grid>
          {type === "event" && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="subtitle2"
                  color="primary.main"
                  gutterBottom
                >
                  Start Date & Time
                </Typography>
                <TextField
                  type="datetime-local"
                  fullWidth
                  required
                  value={fields.startDateTime}
                  onChange={(e) => handleField("startDateTime", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="subtitle2"
                  color="primary.main"
                  gutterBottom
                >
                  End Date & Time
                </Typography>
                <TextField
                  type="datetime-local"
                  fullWidth
                  value={fields.endDateTime}
                  onChange={(e) => handleField("endDateTime", e.target.value)}
                />
              </Grid>
            </>
          )}
          <Grid size={12}>
            <UploadImage
              label="Thumbnail"
              single
              value={fields.thumbnail}
              onChange={(val) => handleField("thumbnail", val)}
            />
          </Grid>
          <Grid size={12}>
            <UploadImage
              label="Gallery"
              value={fields.gallery}
              onChange={(vals) => handleField("gallery", vals)}
            />
          </Grid>
          {type === "class" && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Assign Trainer"
                  value={fields.trainerId}
                  onChange={(e) => handleField("trainerId", e.target.value)}
                  required
                >
                  {trainers.map((trainer) => (
                    <MenuItem key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Assign Packs"
                  SelectProps={{ multiple: true }}
                  value={fields.classPackIds}
                  onChange={(e) => handleField("classPackIds", e.target.value)}
                >
                  {packs.map((pack) => (
                    <MenuItem key={pack.id} value={pack.id}>
                      {pack.title} ({pack.classType})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Assign Schedules"
                  SelectProps={{ multiple: true }}
                  value={fields.classScheduleIds}
                  onChange={(e) =>
                    handleField("classScheduleIds", e.target.value)
                  }
                >
                  {schedules.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                          s.dayOfWeek
                        ]
                      }{" "}
                      {s.startTime} to {s.endTime}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          disabled={loading || !isReady()}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateForm;
