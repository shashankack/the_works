import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
  Link,
  Divider,
} from "@mui/material";

import orangeLogo from "../assets/images/orange_logo.png";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Classes", path: "/classes" },
    { name: "Events", path: "/events" },
  ];

  const socialLinks = [
    { name: "YouTube", path: "https://www.youtube.com" },
    { name: "LinkedIn", path: "https://www.linkedin.com" },
    { name: "Facebook", path: "https://www.facebook.com" },
    { name: "Instagram", path: "https://www.instagram.com" },
  ];

  const linkStyles = {
    textTransform: "uppercase",

    fontWeight: 400,
    textAlign: "end",
    fontSize: isMobile ? "3vw" : "1.2vw",
    color: theme.palette.orange,
    textDecoration: "none",
    display: "block",
    cursor: "pointer",
    transition: "all 0.3s ease",

    "&:hover": {
      color: theme.palette.brown,
      transform: "scale(1.05)",
    },
  };

  return (
    <Stack
      height={isMobile ? "auto" : "40vh"}
      width="100%"
      display="flex"
      justifyContent="start"
      alignItems="start"
      bgcolor={theme.palette.beige}
      px={isMobile ? 2 : 10}
      py={isMobile ? 2 : 4}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="end"
        width="100%"
        gap={isMobile ? 2 : 6}
        height={30}
      >
        {navLinks.map((link, index) => (
          <Link key={index} to={link.path} sx={linkStyles}>
            {link.name}
          </Link>
        ))}
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <Stack direction="column">
          <Box width={isMobile ? "26vw" : "12vw"} height="auto">
            <Box
              component="img"
              src={orangeLogo}
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            color={theme.palette.orange}
            fontSize={isMobile ? "3vw" : "1.2vw"}
          >
            Build What Moves You.
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="end"
          mt={isMobile ? 0 : 4}
          borderColor={theme.palette.brown}
        >
          {socialLinks.map((link, index) => (
            <Link key={index} href={link.path} sx={linkStyles}>
              {link.name}
            </Link>
          ))}
        </Stack>
      </Stack>

      <Divider
        sx={{
          width: "100%",
          border: `1px solid ${theme.palette.brown}`,
          mt: isMobile ? 2 : 4,
          mb: 1,
        }}
      />
      <Typography
        fontSize={isMobile ? "3vw" : "1.2vw"}
        color={theme.palette.orange}
        textAlign="center"
        width="100%"
      >
        @2025Theworks. All rights reserved
      </Typography>
    </Stack>
  );
};

export default Footer;
