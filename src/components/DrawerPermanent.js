import React from "react";
import Drawer from "@mui/material/Drawer";
import theme, { drawerWidth } from "./utils/theme";

const DrawerPermanent = (props) => {
  return (
    <Drawer
      PaperProps={{
        sx: {
          mt: "5.5em",
          backgroundColor: theme.secondaryDark,
          border: 0,
        },
      }}
      variant="permanent"
      sx={{
        display: { xs: "none", sm: "block" },
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
