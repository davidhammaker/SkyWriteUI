import React from "react";
import Drawer from "@mui/material/Drawer";
import { drawerWidth } from "./utils/theme";

const DrawerPermanent = (props) => {
  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: props.bgcolor,
          border: 0,
        },
      }}
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
      open
    >
      {props.children}
    </Drawer>
  );
};

export default DrawerPermanent;
