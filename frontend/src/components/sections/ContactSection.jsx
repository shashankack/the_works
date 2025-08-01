import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";

const ContactSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const [phoneFocused, setPhoneFocused] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form data submitted:", formData);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={isMobile ? "column" : "row-reverse"}
    >
      <Box
        width={isMobile ? "100%" : "50vw"}
        height={isMobile ? "auto" : "80vh"}
        p={isMobile ? 1 : 6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems={isMobile ? "center" : "start"}
      >
        <Typography
          fontSize={isMobile ? "8vw" : "3vw"}
          fontWeight={700}
          textAlign={isMobile ? "center" : "start"}
          mb={isMobile ? 0 : 1}
          width={isMobile ? "100%" : "auto"}
          sx={{ letterSpacing: 1 }}
        >
          CONTACT US
        </Typography>
        <Typography
          variant="h6"
          mb={4}
          sx={{ fontWeight: 500 }}
          width={isMobile ? "100%" : "auto"}
          textAlign={isMobile ? "center" : "start"}
        >
          Reach Out, Level Up!
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={3}
          width={isMobile ? "100%" : "30vw"}
        >
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "tel" },
          ].map(({ label, name, type }) => (
            <TextField
              key={name}
              label={label}
              name={name}
              type={type}
              autoComplete="off"
              value={formData[name]}
              onChange={handleChange}
              onFocus={
                name === "phone" ? () => setPhoneFocused(true) : undefined
              }
              onBlur={
                name === "phone" ? () => setPhoneFocused(false) : undefined
              }
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: 2,
                  },
                  "&:hover fieldset": {},
                  "&.Mui-focused fieldset": {},
                },
              }}
              componentsProps={{
                input: {
                  style: {
                    textAlign: "right",
                  },
                },
                ...(name === "phone" && {
                  root: {
                    sx: {
                      "& .MuiInputAdornment-root": {
                        mr: 1,
                      },
                    },
                  },
                }),
              }}
              InputProps={
                name === "phone" && phoneFocused
                  ? {
                      startAdornment: (
                        <InputAdornment position="start">+91</InputAdornment>
                      ),
                    }
                  : undefined
              }
            />
          ))}

          <TextField
            label="Message"
            name="comment"
            multiline
            required
            rows={2}
            value={formData.comment}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiInputLabel-root": {},
              "& .MuiInputLabel-root.Mui-focused": {},
              "& .MuiInputBase-input": {},
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: 2,
                },
                "&:hover fieldset": {},
                "&.Mui-focused fieldset": {},
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              alignSelf: isMobile ? "center" : "flex-start",
              fontWeight: 700,
              letterSpacing: 1,
              px: 4,
              py: 1,
              textTransform: "uppercase",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            SEND
          </Button>
        </Box>
      </Box>

      <Box
        width={isMobile ? "100%" : "50vw"}
        height={isMobile ? "250px" : "100vh"}
        mt={isMobile ? 4 : 0}
      >
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
    </Box>
  );
};

export default ContactSection;
