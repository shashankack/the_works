import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
  Link,
  Divider,
  Container,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { Instagram as InstagramIcon } from "@mui/icons-material";

import beigeLogo from "../assets/images/beige_logo.png";
import TextAnimation from "./TextAnimation";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navLinks = [
    { name: "HOME", sectionId: "hero-section" },
    { name: "ABOUT US", sectionId: "about-section" },
    { name: "ACTIVITIES", sectionId: "activities-section" },
    { name: "OUR TEAM", sectionId: "team-section" },
    { name: "CONTACT US", sectionId: "contact-section" },
  ];

  return ( 
    <Box
      sx={{
        backgroundColor: "primary.main",
        borderTop: "3px solid",
        borderColor: "secondary.main",
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            py: { xs: 4, md: 6 },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Logo and Tagline Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 60, md: 100 },
                      height: { xs: 60, md: 100 },
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={beigeLogo}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "background.default",
                        fontFamily: "Hind Siliguri, sans-serif",
                        fontSize: { xs: "20px", md: "24px" },
                      }}
                    >
                      The Works
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "background.default",
                        fontFamily: "Average Sans, sans-serif",
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: 500,
                      }}
                    >
                      Build What Moves You.
                    </Typography>
                  </Box>
                </Box>

                {/* Contact Info */}
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "background.default",
                      fontFamily: "Average Sans, sans-serif",
                      fontSize: { xs: "12px", md: "14px" },
                    }}
                  >
                    📍 Mount Blue, Bangalore
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "background.default",
                      fontFamily: "Average Sans, sans-serif",
                      fontSize: { xs: "12px", md: "14px" },
                    }}
                  >
                    📞 +91 98765 43210
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "background.default",
                      fontFamily: "Average Sans, sans-serif",
                      fontSize: { xs: "12px", md: "14px" },
                    }}
                  >
                    ✉️ hello@theworks.fitness
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Navigation and Social Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                alignItems={{ xs: "flex-start", md: "flex-start" }}
                justifyContent={{ xs: "flex-start", md: "space-between" }}
              >
                {/* Navigation Links */}
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "background.default",
                      fontFamily: "Hind Siliguri, sans-serif",
                      fontSize: { xs: "16px", md: "18px" },
                      mb: 1,
                    }}
                  >
                    Quick Links
                  </Typography>

                  <Stack spacing={1.5}>
                    {navLinks.map((link, index) => (
                      <Link key={index} href={link.path} underline="none">
                        <TextAnimation
                          text={link.name}
                          color="background.default"
                          animatedColor="primary.main"
                        />
                      </Link>
                    ))}
                  </Stack>
                </Stack>

                {/* Social Media */}
                <Stack
                  spacing={2}
                  alignItems={{ xs: "flex-start", md: "center" }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "background.default",
                      fontFamily: "Hind Siliguri, sans-serif",
                      fontSize: { xs: "16px", md: "18px" },
                    }}
                  >
                    Follow Us
                  </Typography>

                  <IconButton
                    component="a"
                    href="https://www.instagram.com/theworks.fitness"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: "rgba(177, 83, 36, 0.1)",
                      color: "background.default",
                      width: 58,
                      height: 58,
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "background.default",
                        color: "primary.main",
                        borderColor: "background.default",
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(177, 83, 36, 0.3)",
                      },
                    }}
                  >
                    <InstagramIcon fontSize="large" />
                  </IconButton>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "background.default",
                      fontFamily: "Average Sans, sans-serif",
                      fontSize: { xs: "12px", md: "14px" },
                      textAlign: { xs: "left", md: "center" },
                    }}
                  >
                    @theworks.fitness
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider
            sx={{
              my: 4,
              borderColor: "rgba(177, 83, 36, 0.2)",
              borderWidth: 1,
            }}
          />

          {/* Bottom Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "background.default",
                fontFamily: "Average Sans, sans-serif",
                fontSize: { xs: "12px", md: "14px" },
              }}
            >
              © 2025 The Works. All rights reserved.
            </Typography>

            <Stack
              direction="row"
              spacing={3}
              sx={{
                fontSize: { xs: "12px", md: "14px" },
              }}
            >
              <Link href="/privacy" underline="none">
                <TextAnimation
                  text="PRIVACY POLICY"
                  color="background.default"
                  animatedColor="primary.main"
                />
              </Link>
              <Link href="/terms" underline="none">
                <TextAnimation
                  text="TERMS OF SERVICE"
                  color="background.default"
                  animatedColor="primary.main"
                />
              </Link>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Footer;
