import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Stack,
  Avatar,
  Divider,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Reply as ReplyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import useEnquiries from "../../hooks/useEnquiries";

const EnquiriesManager = () => {
  const { enquiries, loading, error, fetchEnquiries, deleteEnquiry } =
    useEnquiries();
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Filter enquiries based on search and status
  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "new" && !enquiry.status) ||
      (statusFilter === "replied" && enquiry.status === "replied") ||
      (statusFilter === "resolved" && enquiry.status === "resolved");

    return matchesSearch && matchesStatus;
  });

  const handleViewEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEnquiry) return;

    setDeleteLoading(true);
    try {
      await deleteEnquiry(selectedEnquiry.id);
      setDeleteDialogOpen(false);
      setSelectedEnquiry(null);
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "replied":
        return "warning";
      case "resolved":
        return "success";
      default:
        return "error";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "replied":
        return "Replied";
      case "resolved":
        return "Resolved";
      default:
        return "New";
    }
  };

  if (loading && enquiries.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress size={40} />
        <Typography ml={2} color="text.secondary">
          Loading enquiries...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading enquiries: {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with Search and Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: "white",
          border: "2px solid rgba(177, 83, 36, 0.1)",
          borderRadius: 3,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(177, 83, 36, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(177, 83, 36, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <MenuItem value="all">All Enquiries</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="replied">Replied</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              {filteredEnquiries.length} of {enquiries.length} enquiries
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "white",
            border: "2px solid rgba(177, 83, 36, 0.1)",
            borderRadius: 3,
          }}
        >
          <MessageIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            {searchTerm || statusFilter !== "all"
              ? "No matching enquiries found"
              : "No enquiries yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Customer enquiries will appear here when submitted"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredEnquiries.map((enquiry) => (
            <Grid size={12} key={enquiry.id}>
              <Card
                elevation={0}
                sx={{
                  border: "2px solid rgba(177, 83, 36, 0.1)",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 8px 30px rgba(177, 83, 36, 0.15)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: "primary.main",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {enquiry.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="text.primary"
                          sx={{ fontFamily: "Hind Siliguri, sans-serif" }}
                        >
                          {enquiry.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(enquiry.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={getStatusLabel(enquiry.status)}
                        color={getStatusColor(enquiry.status)}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                  </Box>

                  <Grid container spacing={2} mb={2}>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <EmailIcon
                          sx={{ fontSize: 16, color: "primary.main" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {enquiry.email}
                        </Typography>
                      </Box>
                    </Grid>
                    {enquiry.phone && (
                      <Grid
                        size={{
                          xs: 12,
                          md: 6,
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <PhoneIcon
                            sx={{ fontSize: 16, color: "primary.main" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {enquiry.phone}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.5,
                    }}
                  >
                    {enquiry.message}
                  </Typography>

                  <Box display="flex" gap={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewEnquiry(enquiry)}
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: "rgba(177, 83, 36, 0.04)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(enquiry)}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.04)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* View Enquiry Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "2px solid rgba(177, 83, 36, 0.1)",
          },
        }}
      >
        {selectedEnquiry && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    {selectedEnquiry.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ fontFamily: "Hind Siliguri, sans-serif" }}
                    >
                      {selectedEnquiry.name}
                    </Typography>
                    <Chip
                      label={getStatusLabel(selectedEnquiry.status)}
                      color={getStatusColor(selectedEnquiry.status)}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setViewDialogOpen(false)}
                  sx={{ color: "text.secondary" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(177, 83, 36, 0.04)",
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <EmailIcon sx={{ color: "primary.main" }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Email Address
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {selectedEnquiry.email}
                    </Typography>
                  </Paper>
                </Grid>
                {selectedEnquiry.phone && (
                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: "rgba(177, 83, 36, 0.04)",
                        borderRadius: 2,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <PhoneIcon sx={{ color: "primary.main" }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Phone Number
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {selectedEnquiry.phone}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                <Grid size={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(177, 83, 36, 0.04)",
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <MessageIcon sx={{ color: "primary.main" }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Message
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                        color: "text.primary",
                      }}
                    >
                      {selectedEnquiry.message}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Submitted:</strong>{" "}
                    {formatDate(selectedEnquiry.createdAt)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={() => setViewDialogOpen(false)}
                sx={{ color: "text.secondary" }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<ReplyIcon />}
                onClick={() => {
                  window.location.href = `mailto:${selectedEnquiry.email}?subject=Re: Your enquiry&body=Hi ${selectedEnquiry.name},%0D%0A%0D%0AThank you for your enquiry. `;
                }}
                sx={{
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "#9d4a20",
                  },
                }}
              >
                Reply via Email
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "2px solid rgba(244, 67, 54, 0.2)",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold" color="error.main">
            Delete Enquiry
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.primary">
            Are you sure you want to delete this enquiry from{" "}
            <strong>{selectedEnquiry?.name}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnquiriesManager;
