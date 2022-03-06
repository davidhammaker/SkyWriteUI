import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SkySlateBox from "./components/SkySlateBox";

const theme = createTheme({
  palette: {
    primary: {
      dark: "#2f323a",
      main: "#342796",
      light: "#5a7fc4",
    },
    secondary: {
      dark: "#495166",
      main: "#8ad4b4",
      light: "#defaee",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          padding: "2em",
          height: "100%",
          backgroundColor: "secondary.dark",
        }}
      >
        <Paper>
          <Box sx={{ padding: "1em" }}>
            <SkySlateBox />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default App;
