import { Box, Typography } from "@mui/material";
import EnquiriesManager from "../../components/Admin/EnquiriesManager";

const EnquiriesManagePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary.main"
        mb={3}
        sx={{
          fontFamily: "Hind Siliguri, sans-serif",
        }}
      >
        Enquiries Management
      </Typography>
      <EnquiriesManager />
    </Box>
  );
};

export default EnquiriesManagePage;
