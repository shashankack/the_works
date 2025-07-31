import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";

const DetailsModal = ({ open, onClose, item, type }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {type === "class" ? "Class Details" : "Event Details"}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" fontWeight="bold">
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {item.description}
        </Typography>

        <Box mt={2}>
          <Typography variant="subtitle2">Instructions:</Typography>
          <Typography variant="body2">{item.instructions}</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle2">Start Time:</Typography>
          <Typography variant="body2">
            {new Date(item.startTime).toLocaleString("en-IN")}
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="subtitle2">End Time:</Typography>
          <Typography variant="body2">
            {new Date(item.endTime).toLocaleString("en-IN")}
          </Typography>
        </Box>

        {item.maxSpots !== undefined && (
          <Box mt={2}>
            <Typography variant="subtitle2">Max Spots:</Typography>
            <Typography variant="body2">{item.maxSpots}</Typography>
          </Box>
        )}

        <Box mt={2}>
          <Typography variant="subtitle2">Location:</Typography>
          <Typography variant="body2">
            <a href={item.location} target="_blank" rel="noreferrer">
              {item.location}
            </a>
          </Typography>
        </Box>

        {item.gallery?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Gallery:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {item.gallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  width={100}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: 6 }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {/* Future: Add Edit button here */}
      </DialogActions>
    </Dialog>
  );
};

export default DetailsModal;
