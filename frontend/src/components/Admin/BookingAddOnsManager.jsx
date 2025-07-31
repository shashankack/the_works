import React, { useEffect, useState } from "react";
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
  Chip,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import useBookingAddOns from "../../hooks/useBookingAddOns";
import useAddons from "../../hooks/useAddons";

const BookingAddOnsManager = ({ bookingId }) => {
  const { addons, loading: loadingAddons, error: errorAddons } = useAddons();
  const {
    loading: loadingBAO,
    error: errorBAO,
    addAddonsToBooking,
  } = useBookingAddOns();

  const [attachedAddons, setAttachedAddons] = useState([]); // list of addonIds for this booking
  const [selectedAddonId, setSelectedAddonId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch attached addons - this would typically be via an API endpoint
  // For simplicity, we assume a GET /api/bookings/:id/addons returns addons attached to booking

  const fetchAttachedAddons = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/addons`);
      if (!res.ok) throw new Error("Failed to fetch attached add-ons");
      const data = await res.json();
      setAttachedAddons(data); // assuming data is array of addon objects
    } catch (e) {
      setAttachedAddons([]);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchAttachedAddons();
    }
  }, [bookingId]);

  const handleAddAddon = async () => {
    if (!selectedAddonId) return;
    try {
      await addAddonsToBooking(bookingId, [selectedAddonId]);
      setSelectedAddonId("");
      setDialogOpen(false);
      fetchAttachedAddons();
    } catch {}
  };

  // Delete addon from booking: assuming you have an API to remove bookingAddOn (not shown in backend above)
  // If not implemented, this button can be disabled or removed

  const handleRemoveAddon = async (addonId) => {
    if (!window.confirm("Remove this add-on from booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/addons/${addonId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove addon");
      fetchAttachedAddons();
    } catch {}
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
          Booking Add-ons
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          disabled={loadingAddons}
        >
          Add Add-on
        </Button>
      </Box>

      {loadingAddons || loadingBAO ? (
        <CircularProgress />
      ) : errorAddons || errorBAO ? (
        <Alert severity="error">{errorAddons || errorBAO}</Alert>
      ) : attachedAddons.length === 0 ? (
        <Alert severity="info">No add-ons attached to this booking.</Alert>
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
                <TableCell align="left" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attachedAddons.map((addon) => (
                <TableRow key={addon.id} hover>
                  <TableCell>{addon.name}</TableCell>
                  <TableCell>{addon.description || "-"}</TableCell>
                  <TableCell align="left">&#8377; {addon.price}</TableCell>
                  <TableCell align="left">
                    <Tooltip title="Remove from booking">
                      <IconButton
                        onClick={() => handleRemoveAddon(addon.id)}
                        size="small"
                        color="error"
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Add-on to Booking</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="addon-select-label">Select Add-on</InputLabel>
            <Select
              labelId="addon-select-label"
              value={selectedAddonId}
              label="Select Add-on"
              onChange={(e) => setSelectedAddonId(e.target.value)}
            >
              {addons
                .filter(
                  (a) =>
                    !attachedAddons.some((attached) => attached.id === a.id)
                )
                .map((addon) => (
                  <MenuItem key={addon.id} value={addon.id}>
                    {addon.name} - &#8377; {addon.price}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddAddon}
            disabled={!selectedAddonId}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingAddOnsManager;
