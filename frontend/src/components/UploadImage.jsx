import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardMedia,
  Paper,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const getPreviewUrl = (file) => {
  if (typeof file === "string") return file;
  return URL.createObjectURL(file);
};

const UploadImage = ({
  label = "Upload Image",
  value = [],
  onChange,
  single = false,
}) => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setImages(Array.isArray(value) ? value : value ? [value] : []);
  }, [value]);

  const handleAddFiles = (files) => {
    if (!files.length) return;
    let newImages;
    if (single) {
      newImages = [files[0]];
      setImages(newImages);
      onChange?.(files[0]);
    } else {
      newImages = [...images, ...files];
      setImages(newImages);
      onChange?.(newImages);
    }
  };

  const handleFileInput = (e) => {
    handleAddFiles(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleAddFiles(Array.from(e.dataTransfer.files));
  };

  const handleRemove = (file) => {
    const updated = images.filter((img) => img !== file);
    setImages(updated);
    if (single) {
      onChange?.("");
    } else {
      onChange?.(updated);
    }
  };

  return (
    <Box border={1} p={2} borderColor="grey.700" borderRadius={2} mt={2}>
      <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
        {label}
      </Typography>
      <Paper
        variant="outlined"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        sx={{
          p: 4,
          textAlign: "center",
          borderStyle: isDragging ? "solid" : "dashed",
          borderColor: isDragging ? "primary.main" : "grey.400",
          backgroundColor: isDragging ? "grey.100" : "transparent",
          cursor: "pointer",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          multiple={!single}
          onChange={handleFileInput}
        />
        <Typography variant="body2">
          Click or drag {single ? "an image" : "images"} here to upload{" "}
          {single ? "(one image)" : "(multiple images)"}
        </Typography>
      </Paper>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((img, idx) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
            key={idx + (typeof img === "string" ? img : "")}
          >
            <Card
              sx={{
                position: "relative",
                height: 200,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                image={getPreviewUrl(img)}
                sx={{
                  height: 200,
                  objectFit: "cover",
                }}
              />

              <IconButton
                color="error"
                size="large"
                sx={{ position: "absolute", top: 0, right: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(img);
                }}
              >
                <CloseIcon
                  fontSize="large"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2) rotate(90deg)",
                      bgcolor: "rgba(255, 255, 255, 0)",
                      color: "error.main",
                    },
                  }}
                />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UploadImage;
