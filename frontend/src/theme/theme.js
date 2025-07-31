import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    text: {
      primary: "#4E2916",
      secondary: "#B15324",
      white: "#E3DED3",
    },
    primary: {
      main: "#B15324",
    },
    secondary: {
      main: "#4E2916",
    },
    background: {
      default: "#E3DED3",
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",

    h1: {
      fontFamily: "Hind Siliguri, sans-serif",
      fontWeight: 700,
      fontSize: "28px",
    },
    body1: {
      fontFamily: "Average Sans, sans-serif",
      fontWeight: 500,
      fontSize: "18px",
      lineHeight: "1.4",
    },
  },
});

export default theme;
