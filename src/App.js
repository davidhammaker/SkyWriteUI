import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SkySlateBox from "./components/SkySlateBox";
import NavBarAndDrawer, { drawerWidth } from "./components/NavBarAndDrawer";

const App = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <NavBarAndDrawer />
      <Box
        sx={{
          flexGrow: 1,
          px: 3,
          py: 11,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Paper>
          <Box sx={{ p: 2 }}>
            <SkySlateBox />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default App;
