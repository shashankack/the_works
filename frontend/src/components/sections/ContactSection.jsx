import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Container,
  Grid,
  Avatar,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  FitnessCenter as FitnessCenterIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import useEnquiries from "../../hooks/useEnquiries";

const ContactSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { createEnquiry, loading: enquiryLoading } = useEnquiries();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const [formStatus, setFormStatus] = useState(null);

  // Auto-hide success/error messages after 4 seconds
  useEffect(() => {
    if (formStatus) {
      const timer = setTimeout(() => {
        setFormStatus(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);

    try {
      await createEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.comment.trim(),
      });

      setFormStatus("success");
      setFormData({ name: "", email: "", phone: "", comment: "" });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      setFormStatus("error");
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: "Email Us",
      value: "hello@theworks.fitness",
      subtitle: "We'll get back to you within 24 hours",
      action: "mailto:hello@theworks.fitness",
    },
    {
      icon: <PhoneIcon />,
      title: "Call Us",
      value: "+91 98765 43210",
      subtitle: "Available Mon-Sat, 6 AM - 10 PM",
      action: "tel:+919876543210",
    },
    {
      icon: <LocationIcon />,
      title: "Visit Us",
      value: "Mount Blue, Bangalore",
      subtitle: "Come experience our state-of-the-art facility",
      action:
        "https://www.google.com/maps/place/Mount+Blue/@12.9706874,77.6058609,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae16807d7b900b:0xba7b97b63f0ea410!8m2!3d12.9706822!4d77.6084358!16s%2Fg%2F1tgw8bs2?entry=ttu&g_ep=EgoyMDI1MDcyOS4wIKXMDSoASAFQAw%3D%3D",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        py: 8,
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
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "primary.main",
              mx: "auto",
              mb: 3,
            }}
          >
            <FitnessCenterIcon sx={{ color: "text.white", fontSize: 40 }} />
          </Avatar>

          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              fontSize: { xs: "32px", md: "48px" },
              fontFamily: "Hind Siliguri, sans-serif",
              mb: 2,
              letterSpacing: 1,
            }}
          >
            Let's Connect & Elevate
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              fontSize: { xs: "18px", md: "24px" },
              fontFamily: "Average Sans, sans-serif",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Ready to transform your fitness journey? We're here to guide you
            every step of the way.
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* Contact Information Cards */}
          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Stack spacing={3}>
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  component={info.action ? "a" : "div"}
                  href={info.action}
                  sx={{
                    borderRadius: 3,
                    border: "2px solid transparent",
                    boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    cursor: info.action ? "pointer" : "default",
                    "&:hover": info.action
                      ? {
                          borderColor: "primary.main",
                          boxShadow: "0 8px 30px rgba(177, 83, 36, 0.15)",
                          transform: "translateY(-2px)",
                        }
                      : {},
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor:
                            index === 0
                              ? "primary.main"
                              : index === 1
                              ? "secondary.main"
                              : "rgba(177, 83, 36, 0.1)",
                          color: index === 2 ? "primary.main" : "white",
                        }}
                      >
                        {info.icon}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "text.primary",
                            fontFamily: "Hind Siliguri, sans-serif",
                            mb: 0.5,
                          }}
                        >
                          {info.title}
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: info.action
                              ? "primary.main"
                              : "text.primary",
                            fontFamily: "Average Sans, sans-serif",
                            mb: 0.5,
                          }}
                        >
                          {info.value}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily: "Average Sans, sans-serif",
                            fontSize: "14px",
                          }}
                        >
                          {info.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Contact Form */}
          <Grid
            size={{
              xs: 12,
              md: 7,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: "white",
                border: "2px solid rgba(177, 83, 36, 0.1)",
                boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontFamily: "Hind Siliguri, sans-serif",
                  mb: 2,
                }}
              >
                Send us a Message
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontFamily: "Average Sans, sans-serif",
                  mb: 4,
                }}
              >
                Have questions about our programs? Need a personalized fitness
                plan? We're excited to hear from you and help you achieve your
                goals!
              </Typography>

              {formStatus === "success" && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "success.main",
                      fontFamily: "Average Sans, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Thanks for reaching out! We'll get back to you within 24
                    hours.
                  </Typography>
                </Paper>
              )}

              {formStatus === "error" && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    border: "1px solid rgba(244, 67, 54, 0.3)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "error.main",
                      fontFamily: "Average Sans, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Sorry, there was an error submitting your enquiry. Please
                    try again.
                  </Typography>
                </Paper>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={enquiryLoading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "rgba(177, 83, 36, 0.02)",
                          "& fieldset": {
                            borderColor: "rgba(177, 83, 36, 0.3)",
                            borderWidth: 2,
                          },
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: "Average Sans, sans-serif",
                          "&.Mui-focused": {
                            color: "primary.main",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={enquiryLoading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "rgba(177, 83, 36, 0.02)",
                          "& fieldset": {
                            borderColor: "rgba(177, 83, 36, 0.3)",
                            borderWidth: 2,
                          },
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: "Average Sans, sans-serif",
                          "&.Mui-focused": {
                            color: "primary.main",
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={enquiryLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ color: "text.secondary", fontWeight: 600 }}
                        >
                          +91
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(177, 83, 36, 0.02)",
                      "& fieldset": {
                        borderColor: "rgba(177, 83, 36, 0.3)",
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "Average Sans, sans-serif",
                      "&.Mui-focused": {
                        color: "primary.main",
                      },
                    },
                  }}
                />

                <TextField
                  label="How can we help you?"
                  name="comment"
                  multiline
                  rows={4}
                  value={formData.comment}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={enquiryLoading}
                  placeholder="Tell us about your fitness goals, questions about our programs, or anything else you'd like to know..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(177, 83, 36, 0.02)",
                      "& fieldset": {
                        borderColor: "rgba(177, 83, 36, 0.3)",
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "Average Sans, sans-serif",
                      "&.Mui-focused": {
                        color: "primary.main",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={enquiryLoading}
                  startIcon={<SendIcon />}
                  sx={{
                    alignSelf: "flex-start",
                    backgroundColor: "primary.main",
                    color: "text.white",
                    textTransform: "none",
                    fontFamily: "Average Sans, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(177, 83, 36, 0.3)",
                    "&:hover": {
                      backgroundColor: "#9d4a20",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 30px rgba(177, 83, 36, 0.4)",
                    },
                    "&:disabled": {
                      backgroundColor: "rgba(177, 83, 36, 0.5)",
                    },
                  }}
                >
                  {enquiryLoading ? "Sending..." : "Send Message"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            borderRadius: 4,
            overflow: "hidden",
            border: "2px solid rgba(177, 83, 36, 0.1)",
            boxShadow: "0 4px 20px rgba(78, 41, 22, 0.08)",
          }}
        >
          <Box sx={{ p: 3, backgroundColor: "white" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                fontFamily: "Hind Siliguri, sans-serif",
                mb: 1,
              }}
            >
              Find Us Here
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontFamily: "Average Sans, sans-serif",
              }}
            >
              Located in the heart of Bangalore, easily accessible by public
              transport
            </Typography>
          </Box>

          <Box sx={{ height: { xs: "300px", md: "400px" } }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0181955842!2d77.60586087590207!3d12.970687414896672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16807d7b900b%3A0xba7b97b63f0ea410!2sMount%20Blue!5e0!3m2!1sen!2sin!4v1747412058414!5m2!1sen!2sin"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactSection;
