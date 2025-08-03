import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Link,
  Stack,
  CircularProgress,
  Alert,
  Container,
  Paper,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrainerForm from "../../components/forms/TrainersForm";
import { useCachedTrainers } from "../../hooks/useCachedTrainers";
import { useState } from "react";

const TrainersManagePage = () => {
  const {
    trainers,
    loading,
    error,
    refetch: fetchTrainers,
    updateTrainers,
    clearTrainersCache,
    isStale,
    isCached,
  } = useCachedTrainers({
    adminMode: true,
    ttl: 10 * 60 * 1000, // 10 minutes cache for trainer data
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);

  const handleDelete = async (trainer) => {
    setTrainerToDelete(trainer);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (trainerToDelete) {
      await deactivateTrainer(trainerToDelete.id);
      setDeleteOpen(false);
      setTrainerToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setOpen(false);
    setSelected(null);
    fetchTrainersForAdmin();
  };

  // 🔑 This handles both add and edit
  const handleFormSubmit = async (data) => {
    try {
      if (selected) {
        await updateTrainer(selected.id, data);
      } else {
        await addTrainer(data);
      }
      handleFormSuccess();
    } catch (err) {
      // Optionally handle error feedback
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        pt: 10,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 6,
            p: 4,
            borderRadius: 4,
            backgroundColor: "white",
            border: "2px solid rgba(177, 83, 36, 0.1)",
            boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: "primary.main",
                  mr: 3,
                }}
              >
                <PersonIcon sx={{ color: "text.white", fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    fontSize: "32px",
                    fontFamily: "Hind Siliguri, sans-serif",
                    mb: 0.5,
                  }}
                >
                  Trainer Management
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: "16px",
                    fontFamily: "Average Sans, sans-serif",
                  }}
                >
                  {trainers.length === 0 && !loading
                    ? "Build your team - Add your first trainer to get started"
                    : `Manage your team of ${
                        trainers.length
                      } professional trainer${
                        trainers.length !== 1 ? "s" : ""
                      }`}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setOpen(true);
                setSelected(null);
              }}
              sx={{
                backgroundColor: "primary.main",
                color: "text.white",
                textTransform: "none",
                fontFamily: "Average Sans, sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                px: 3,
                py: 1.5,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(177, 83, 36, 0.3)",
                "&:hover": {
                  backgroundColor: "#9d4a20",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(177, 83, 36, 0.4)",
                },
              }}
            >
              Add New Trainer
            </Button>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: 3,
              backgroundColor: "rgba(244, 67, 54, 0.05)",
              border: "1px solid rgba(244, 67, 54, 0.2)",
              fontFamily: "Average Sans, sans-serif",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Paper
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "white",
              border: "2px solid rgba(177, 83, 36, 0.1)",
            }}
          >
            <CircularProgress
              size={60}
              sx={{
                color: "primary.main",
                mb: 3,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontFamily: "Hind Siliguri, sans-serif",
                fontWeight: "bold",
              }}
            >
              Loading Trainers...
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Stats Section */}
            <Paper
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 3,
                backgroundColor: "rgba(177, 83, 36, 0.05)",
                border: "1px solid rgba(177, 83, 36, 0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FitnessCenterIcon
                  sx={{ color: "primary.main", fontSize: 24 }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "Average Sans, sans-serif",
                    fontWeight: 500,
                    color: "primary.main",
                  }}
                >
                  Total Active Trainers:
                </Typography>
                <Chip
                  label={trainers.length}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "text.white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                />
              </Box>
            </Paper>

            {/* Trainers Grid */}
            <Grid container spacing={3}>
              {trainers.length === 0 ? (
                <Grid size={12}>
                  <Paper
                    sx={{
                      p: 8,
                      textAlign: "center",
                      borderRadius: 4,
                      backgroundColor: "white",
                      border: "2px dashed rgba(177, 83, 36, 0.2)",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: "rgba(177, 83, 36, 0.1)",
                        color: "primary.main",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "text.primary",
                        fontFamily: "Hind Siliguri, sans-serif",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      No Trainers Found
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        fontFamily: "Average Sans, sans-serif",
                        mb: 3,
                        maxWidth: "400px",
                        mx: "auto",
                      }}
                    >
                      Start building your team by adding your first professional
                      trainer. They'll help deliver amazing fitness experiences
                      to your clients.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpen(true);
                        setSelected(null);
                      }}
                      sx={{
                        backgroundColor: "primary.main",
                        color: "text.white",
                        textTransform: "none",
                        fontFamily: "Average Sans, sans-serif",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                      }}
                    >
                      Add Your First Trainer
                    </Button>
                  </Paper>
                </Grid>
              ) : (
                trainers.map((trainer) => (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 3,
                    }}
                    key={trainer.id}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        backgroundColor: "white",
                        border: "2px solid transparent",
                        boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: "0 8px 30px rgba(177, 83, 36, 0.15)",
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          image={trainer.profileImage || "/placeholder.jpg"}
                          alt={trainer.name}
                          sx={{
                            objectFit: "cover",
                            height: 250,
                            width: "100%",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            backgroundColor: "rgba(177, 83, 36, 0.9)",
                            borderRadius: "50%",
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <PersonIcon
                            sx={{ color: "text.white", fontSize: 20 }}
                          />
                        </Box>
                      </Box>

                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "text.primary",
                            fontSize: "20px",
                            fontFamily: "Hind Siliguri, sans-serif",
                            mb: 2,
                            textAlign: "center",
                          }}
                        >
                          {trainer.name}
                        </Typography>

                        <Stack spacing={1.5}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <PhoneIcon
                              sx={{ color: "primary.main", fontSize: 18 }}
                            />
                            <Link
                              href={`tel:${trainer.phone}`}
                              sx={{
                                color: "primary.main",
                                textDecoration: "none",
                                fontFamily: "Average Sans, sans-serif",
                                fontWeight: 500,
                                fontSize: "14px",
                                "&:hover": {
                                  textDecoration: "underline",
                                  color: "secondary.main",
                                },
                              }}
                            >
                              +91 {trainer.phone}
                            </Link>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <EmailIcon
                              sx={{ color: "secondary.main", fontSize: 18 }}
                            />
                            <Link
                              href={`mailto:${trainer.email}`}
                              sx={{
                                color: "secondary.main",
                                textDecoration: "none",
                                fontFamily: "Average Sans, sans-serif",
                                fontWeight: 500,
                                fontSize: "14px",
                                "&:hover": {
                                  textDecoration: "underline",
                                  color: "primary.main",
                                },
                              }}
                            >
                              {trainer.email}
                            </Link>
                          </Box>
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ width: "100%" }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => {
                              setSelected(trainer);
                              setOpen(true);
                            }}
                            sx={{
                              flex: 1,
                              textTransform: "none",
                              fontFamily: "Average Sans, sans-serif",
                              fontWeight: 500,
                              borderColor: "primary.main",
                              color: "primary.main",
                              borderRadius: 2,
                              "&:hover": {
                                backgroundColor: "rgba(177, 83, 36, 0.05)",
                                borderColor: "primary.main",
                              },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(trainer)}
                            sx={{
                              flex: 1,
                              textTransform: "none",
                              fontFamily: "Average Sans, sans-serif",
                              fontWeight: 500,
                              borderRadius: 2,
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "background.default",
            color: "text.primary",
            fontFamily: "Hind Siliguri, sans-serif",
            fontWeight: "bold",
          }}
        >
          Confirm Trainer Removal
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "background.default", pt: 2 }}>
          <Typography sx={{ fontFamily: "Average Sans, sans-serif" }}>
            Are you sure you want to remove{" "}
            <strong>{trainerToDelete?.name}</strong> from your team? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "background.default", p: 3 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{
              textTransform: "none",
              fontFamily: "Average Sans, sans-serif",
              color: "text.primary",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              fontFamily: "Average Sans, sans-serif",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Remove Trainer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Trainer Form */}
      <TrainerForm
        open={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        onSuccess={handleFormSuccess}
        initialData={selected}
        onSubmit={handleFormSubmit}
      />
    </Box>
  );
};

export default TrainersManagePage;
