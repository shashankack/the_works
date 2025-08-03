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
import useClassPacks from "../../hooks/useClassPacks";
import { useAdminRefresh } from "../../hooks/useAdminRefresh";
import ClassPackDialog from "../forms/ClassPackForm";

const ClassPackManager = () => {
  const {
    packs,
    loading,
    error,
    addPack,
    updatePack,
    deactivatePack,
    toggleActivePack,
    refetch: fetchPacks,
  } = useClassPacks(); // no classId

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);

  // Listen for global refresh events from navbar
  useAdminRefresh(() => {
    console.log('ClassPackManager: Received admin refresh event');
    fetchPacks();
  });

  const handleEdit = (pack) => {
    setEditingPack(pack);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setEditingPack(null);
    setDialogOpen(false);
  };

  const handleToggleActive = async (pack) => {
    await toggleActivePack(pack.id, !pack.isActive);
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
          Class Packs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Pack
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : packs.length === 0 ? (
        <Alert severity="info">No class packs available.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell align="left" sx={{ fontWeight: 600 }}>
                  Sessions
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: 600 }}>
                  Duration
                </TableCell>
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
              {packs.map((pack) => (
                <TableRow key={pack.id} hover>
                  <TableCell>
                    {pack.title} ({pack.classType})
                  </TableCell>
                  <TableCell align="left">{pack.numberOfSessions}</TableCell>
                  <TableCell align="left">{pack.duration} days</TableCell>
                  <TableCell align="left">&#8377; {pack.price}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={pack.isActive}
                        onChange={() => handleToggleActive(pack)}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={pack.isActive ? "Active" : "Inactive"}
                        color={pack.isActive ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleEdit(pack)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => deactivatePack(pack.id)}
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

      <ClassPackDialog
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={async (data) => {
          if (editingPack) await updatePack(editingPack.id, data);
          else await addPack(data);
          handleClose();
        }}
        initialValues={editingPack}
      />
    </Box>
  );
};

export default ClassPackManager;
