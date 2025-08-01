import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import {
  FitnessCenter as FitnessCenterIcon,
  Schedule as ScheduleIcon,
  AddBox as AddBoxIcon,
} from "@mui/icons-material";
import { useState } from "react";
import ClassPackManager from "../../components/Admin/ClassPackManager";
import ClassScheduleManager from "../../components/Admin/ClassScheduleManager";
import AddonManager from "../../components/Admin/AddonManager";

const ActivitesManagePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabData = [
    {
      label: "Class Packs",
      icon: <FitnessCenterIcon />,
      component: <ClassPackManager />,
      description: "Manage fitness class packages and pricing"
    },
    {
      label: "Class Schedules", 
      icon: <ScheduleIcon />,
      component: <ClassScheduleManager />,
      description: "Schedule and organize fitness classes"
    },
    {
      label: "Add-ons",
      icon: <AddBoxIcon />,
      component: <AddonManager />,
      description: "Manage additional services and extras"
    }
  ];

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
                <FitnessCenterIcon sx={{ color: "text.white", fontSize: 28 }} />
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
                  Activities Management
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: "16px",
                    fontFamily: "Average Sans, sans-serif",
                  }}
                >
                  Manage your fitness offerings, schedules, and additional services
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Navigation Tabs */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            backgroundColor: "white",
            border: "2px solid rgba(177, 83, 36, 0.1)",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 3,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontFamily: "Average Sans, sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                color: "text.secondary",
                minHeight: 72,
                "&.Mui-selected": {
                  color: "primary.main",
                },
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(177, 83, 36, 0.05)",
                },
              },
            }}
          >
            {tabData.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "Hind Siliguri, sans-serif",
                      }}
                    >
                      {tab.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "12px",
                        fontFamily: "Average Sans, sans-serif",
                        color: "text.secondary",
                      }}
                    >
                      {tab.description}
                    </Typography>
                  </Box>
                }
                iconPosition="top"
                sx={{
                  flex: 1,
                  maxWidth: "none",
                  px: 3,
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            backgroundColor: "white",
            border: "2px solid rgba(177, 83, 36, 0.1)",
            boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 4 }}>
            {tabData[activeTab].component}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ActivitesManagePage;
