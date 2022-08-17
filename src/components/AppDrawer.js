import React from "react";
import Box from "@mui/material/Box";
import DrawerSliding from "./DrawerSliding";
import DrawerPermanent from "./DrawerPermanent";
import { drawerWidth } from "./utils/theme";

const AppDrawer = (props) => {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <DrawerSliding
        container={props.container}
        open={props.open} // mobileOpen
        onClose={props.onClose} // toggleDrawer
      >
        {props.children}
      </DrawerSliding>
      <DrawerPermanent>{props.children}</DrawerPermanent>
    </Box>
  );
};

export default AppDrawer;
