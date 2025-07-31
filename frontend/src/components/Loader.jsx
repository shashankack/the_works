import { Box, LinearProgress, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <LinearProgress color="warning" />

      <Box
        sx={{
          mt: 4,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography mt={2} color="text.secondary">
          Loading, please wait...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
