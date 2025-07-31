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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TrainerForm from "../../components/forms/TrainersForm";
import useTrainers from "../../hooks/useTrainers";
import { useState } from "react";

const TrainersManagePage = () => {
  const {
    trainers,
    loading,
    error,
    addTrainer,
    updateTrainer,
    deactivateTrainer,
    fetchTrainers,
  } = useTrainers();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?"))
      return;
    await deactivateTrainer(id);
  };

  const handleFormSuccess = () => {
    setOpen(false);
    setSelected(null);
    fetchTrainers();
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
    <Box p={4} mt={10}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={800}>
          {trainers.length === 0 && !loading
            ? "No Trainers Found, Add Trainer"
            : "Manage Trainers"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpen(true);
            setSelected(null);
          }}
        >
          Add Trainer
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Stack justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Stack>
      ) : (
        <Grid container spacing={3}>
          {trainers.length === 0 ? (
            <Grid size={12}>
              <Typography align="center">No trainers found.</Typography>
            </Grid>
          ) : (
            trainers.map((trainer) => (
              <Grid
                key={trainer.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={trainer.profileImage || "/placeholder.jpg"}
                    alt={trainer.name}
                    sx={{ objectFit: "cover", height: 300, width: "100%" }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                      {trainer.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      <Link color="secondary" href={`tel:${trainer.phone}`}>
                        +91{trainer.phone}
                      </Link>
                    </Typography>
                    <Typography variant="body2">
                      <Link href={`mailto:${trainer.email}`}>
                        {trainer.email}
                      </Link>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setSelected(trainer);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(trainer.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
      <TrainerForm
        open={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        onSuccess={handleFormSuccess}
        initialData={selected}
        onSubmit={handleFormSubmit} // 👈 REQUIRED FOR ADD/EDIT
      />
    </Box>
  );
};

export default TrainersManagePage;
