import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  Box,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import UploadImage from "../UploadImage";
import axiosInstance from "../../api/axiosInstance";
import RTEWrapper from "../RichTextEditor";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useClassPacks from "../../hooks/useClassPacks";
import useClassSchedules from "../../hooks/useClassSchedules";
import useTrainers from "../../hooks/useTrainers";
import { updateClass } from "../../api/classService";
import { useState, useEffect } from "react";

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

const forbiddenKeys = ["id", "bookedSpots", "createdAt", "status"];

const EditForm = ({ open, onClose, classData, onSuccess }) => {
  const { packs } = useClassPacks();
  const { schedules } = useClassSchedules();
  const { trainers } = useTrainers();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    title: "",
    description: "",
    instructions: "",
    location: "",
    thumbnail: "",
    gallery: [],
    maxSpots: 10,
    isActive: true,
    classPackIds: [],
    classScheduleIds: [],
    trainerId: "", // <-- NEW field
  });

  // Store originals to know when deleting
  const [originalThumb, setOriginalThumb] = useState("");
  const [originalGallery, setOriginalGallery] = useState([]);

  useEffect(() => {
    if (open && classData) {
      setFields({
        ...classData,
        classPackIds: Array.isArray(classData.classPackIds)
          ? classData.classPackIds
          : (() => {
              try {
                return JSON.parse(classData.classPackIds || "[]");
              } catch {
                return [];
              }
            })(),
        classScheduleIds: Array.isArray(classData.classScheduleIds)
          ? classData.classScheduleIds
          : (() => {
              try {
                return JSON.parse(classData.classScheduleIds || "[]");
              } catch {
                return [];
              }
            })(),
        // Default for trainerId (optional: fallbacks to empty string)
        trainerId: classData.trainerId || "",
      });
      setOriginalThumb(classData.thumbnail || "");
      setOriginalGallery(
        Array.isArray(classData.gallery) ? classData.gallery : []
      );
    }
  }, [open, classData]);

  const handleField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  // Required fields logic
  const requiredKeys = [
    "title",
    "description",
    "instructions",
    "location",
    "thumbnail",
    "maxSpots",
    "gallery",
    "trainerId", // <-- Make trainer required
  ];
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const finalData = { ...fields };

      // CLEAN FORBIDDEN KEYS
      forbiddenKeys.forEach((k) => delete finalData[k]);

      // If thumbnail changes, delete the old one before uploading new
      if (
        finalData.thumbnail &&
        finalData.thumbnail !== originalThumb &&
        typeof originalThumb === "string" &&
        originalThumb !== "" &&
        !(finalData.thumbnail instanceof File)
      ) {
        await axiosInstance.delete(
          `/uploads/${encodeURIComponent(originalThumb)}`
        );
      }

      if (finalData.thumbnail && finalData.thumbnail instanceof File) {
        if (
          originalThumb &&
          typeof originalThumb === "string" &&
          originalThumb !== ""
        ) {
          await axiosInstance.delete(
            `/uploads/${encodeURIComponent(originalThumb)}`
          );
        }
        finalData.thumbnail = await uploadSingleFile(
          finalData.thumbnail,
          "/uploads/thumbnail"
        );
      }

      // GALLERY: delete removed URLs, upload new files
      const prevGallery = Array.isArray(originalGallery) ? originalGallery : [];
      const toDelete = prevGallery.filter(
        (url) => typeof url === "string" && !finalData.gallery.includes(url)
      );
      for (const url of toDelete) {
        await axiosInstance.delete(`/uploads/${encodeURIComponent(url)}`);
      }
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

      await updateClass(classData.id, finalData);
      onSuccess?.();
      onClose();
    } catch (err) {
      alert("Edit failed (see console)");
      // Optionally also: console.error(err);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Class</DialogTitle>
      <DialogContent dividers sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Title"
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
          <Grid size={12}>
            <TextField
              fullWidth
              label={
                <Box display="flex" alignItems="center">
                  Location URL
                  <Tooltip title="This is the default location. Only change it if the session is at a different venue.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              required
              value={fields.location}
              onChange={(e) => handleField("location", e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              type="number"
              label="Max Spots"
              required
              value={fields.maxSpots}
              onChange={(e) => handleField("maxSpots", e.target.value)}
            />
          </Grid>
          {/* Trainer selection here */}
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
                  {trainer.name} {trainer.email && `(${trainer.email})`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* ---- End trainer selection ---- */}
          <Grid size={12}>
            <UploadImage
              label="Thumbnail"
              value={fields.thumbnail}
              single
              uploadUrl="/uploads/thumbnail"
              onChange={(url) => handleField("thumbnail", url)}
              onDelete={(url) =>
                axiosInstance.delete(`/uploads/${encodeURIComponent(url)}`)
              }
            />
          </Grid>
          <Grid size={12}>
            <UploadImage
              label="Gallery"
              value={fields.gallery}
              uploadUrl="/uploads/gallery"
              onChange={(urls) => handleField("gallery", urls)}
              onDelete={(url) =>
                axiosInstance.delete(`/uploads/${encodeURIComponent(url)}`)
              }
            />
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
              onChange={(e) => handleField("classScheduleIds", e.target.value)}
            >
              {schedules.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {
                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                      s.dayOfWeek
                    ]
                  }{" "}
                  {s.startTime}-{s.endTime}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !isReady()}
        >
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditForm;
