import React from "react";
import Drawer from "@mui/material/Drawer";
import { drawerWidth } from "../settings";
import theme from "./utils/theme";

const DrawerPermanent = (props) => {
  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: theme.primaryLight,
          border: 0,
        },
      }}
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
          overflowX: "hidden",
        },
      }}
      open
    >
      {props.children}
    </Drawer>
  );
};

export default DrawerPermanent;
