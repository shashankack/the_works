import {
  Container,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClassPackManager from "../../components/Admin/ClassPackManager";
import ClassScheduleManager from "../../components/Admin/ClassScheduleManager";
import AddonManager from "../../components/Admin/AddonManager";

const ActivitesManagePage = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 20 }}>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" mb={2} mt={2}>
                Manage Class Packs & Schedules
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Class Packs</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ClassPackManager />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Class Schedules</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ClassScheduleManager />
                </AccordionDetails>
              </Accordion>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid size={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Add-ons</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AddonManager />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ActivitesManagePage;
