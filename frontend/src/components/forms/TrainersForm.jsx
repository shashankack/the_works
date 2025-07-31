import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import UploadImage from "../UploadImage";
import axiosInstance from "../../api/axiosInstance";
import { useState, useEffect } from "react";

const defaultValues = {
  name: "",
  bio: "",
  phone: "",
  email: "",
  profileImage: "",
  specializations: [],
};

async function uploadSingleFile(file, url) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

const TrainerForm = ({ open, onClose, initialData, onSubmit }) => {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(defaultValues);
  const [specInput, setSpecInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const data = initialData || defaultValues;
      setForm({
        ...data,
        specializations: Array.isArray(data.specializations)
          ? data.specializations
          : [],
      });
      setSpecInput((data.specializations || []).join(", "));
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.bio) newErrors.bio = "Bio is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.profileImage)
      newErrors.profileImage = "Profile image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let finalData = { ...form };

      // Remove id and createdAt if present — unrecognized by API
      delete finalData.id;
      delete finalData.createdAt;

      // Handle file upload if profileImage is a File object
      if (finalData.profileImage instanceof File) {
        finalData.profileImage = await uploadSingleFile(
          finalData.profileImage,
          "/uploads/thumbnail"
        );
      }

      if (onSubmit) {
        await onSubmit(finalData);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      alert("Trainer save failed. Please try again.");
      // Optionally: console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Trainer" : "Add Trainer"}</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={form.name}
                onChange={handleChange("name")}
                required
                error={!!errors.name}
                helperText={errors.name}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                fullWidth
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={3}
                value={form.bio}
                onChange={handleChange("bio")}
                required
                error={!!errors.bio}
                helperText={errors.bio}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={form.email}
                onChange={handleChange("email")}
                required
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <UploadImage
                label="Profile Image"
                value={form.profileImage}
                single
                uploadUrl="/uploads/thumbnail"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, profileImage: val }))
                }
                onDelete={(url) =>
                  axiosInstance.delete(`/uploads/${encodeURIComponent(url)}`)
                }
              />
              {errors.profileImage && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {errors.profileImage}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Specializations (comma-separated)"
                fullWidth
                value={specInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  setSpecInput(raw);
                  const parsed = raw
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0);
                  setForm((prev) => ({ ...prev, specializations: parsed }));
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update"
              : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TrainerForm;
