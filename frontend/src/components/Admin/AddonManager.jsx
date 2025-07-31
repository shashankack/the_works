import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import useAddons from "../../hooks/useAddons";

const AddonForm = ({ open, onClose, onSubmit, initialValues }) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [price, setPrice] = useState(initialValues?.price || 0);

  const handleSubmit = () => {
    if (!name || price < 0) return;
    onSubmit({ name, description, price });
  };

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setPrice(initialValues.price || 0);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
    }
  }, [initialValues]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? "Edit Addon" : "Add Addon"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          margin="normal"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          margin="normal"
          label="Price"
          type="number"
          inputProps={{ min: 0 }}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialValues ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddonManager = () => {
  const {
    addons,
    loading,
    error,
    fetchAddons,
    addAddon,
    updateAddon,
    toggleActiveAddon,
    deleteAddon,
  } = useAddons();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);

  // For delete confirmation dialog
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState(null);

  // Open add/edit dialog
  const handleEdit = (addon) => {
    setEditingAddon(addon);
    setDialogOpen(true);
  };

  // Close add/edit dialog
  const handleClose = () => {
    setEditingAddon(null);
    setDialogOpen(false);
  };

  // Toggle active status and refetch addons after success
  const handleToggleActive = async (addon) => {
    await toggleActiveAddon(addon.id, !addon.isActive);
    await fetchAddons();
  };

  // Open confirm delete dialog
  const handleDelete = (addon) => {
    setAddonToDelete(addon);
    setConfirmDeleteOpen(true);
  };

  // Confirm deletion and refetch after success
  const confirmDelete = async () => {
    if (addonToDelete) {
      await deleteAddon(addonToDelete.id);
      setConfirmDeleteOpen(false);
      setAddonToDelete(null);
      await fetchAddons();
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setAddonToDelete(null);
  };

  // After add/update, refetch addons to keep UI synced
  const handleFormSubmit = async (data) => {
    if (editingAddon) {
      await updateAddon(editingAddon.id, data);
    } else {
      await addAddon(data);
    }
    handleClose();
    await fetchAddons();
  };

  // Fetch addons initially if not already fetched or for manual refresh
  useEffect(() => {
    if (addons.length === 0) {
      fetchAddons();
    }
  }, []);

  return (
    <>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold">
            Add-ons
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Add-on
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : addons.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No add-ons available.
          </Alert>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 600 }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addons.map((addon) => (
                  <TableRow key={addon.id} hover>
                    <TableCell>{addon.name}</TableCell>
                    <TableCell>{addon.description || "-"}</TableCell>
                    <TableCell align="left">&#8377; {addon.price}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Switch
                          checked={addon.isActive}
                          onChange={() => handleToggleActive(addon)}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={addon.isActive ? "Active" : "Inactive"}
                          color={addon.isActive ? "success" : "default"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(addon)}
                          size="small"
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(addon)}
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

        <AddonForm
          open={dialogOpen}
          onClose={handleClose}
          onSubmit={handleFormSubmit}
          initialValues={editingAddon}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogTitle id="delete-confirm-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-confirm-dialog-description">
            Are you sure you want to delete this add-on? This action is
            irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddonManager;
