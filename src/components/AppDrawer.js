import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DrawerSliding from "./DrawerSliding";
import DrawerPermanent from "./DrawerPermanent";
import AddItems from "./AddItems";
import DrawerFileList from "./DrawerFileList";
import theme from "./utils/theme";
import { drawerWidth } from "../settings";

const AppDrawer = (props) => {
  const appState = props.appState;

  const container =
    props.window !== undefined ? () => props.window().document.body : undefined;

  const drawerContents = (
    <>
      <DrawerFileList
        storageObjects={appState.storageObjects}
        depth={0}
        appState={appState}
        getUser={props.getUser}
      />
      <Divider sx={{ borderColor: theme.primary }} />
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <DrawerSliding
        container={container}
        open={appState.fileDrawerOpen}
        onClose={props.toggleFileDrawer}
        bgcolor={theme.primary}
        getUser={props.getUser}
      >
        <AddItems appState={appState} getUser={props.getUser} />
        {drawerContents}
      </DrawerSliding>
      <DrawerPermanent bgcolor={theme.primary} getUser={props.getUser}>
        <AddItems appState={appState} getUser={props.getUser} />
        {drawerContents}
      </DrawerPermanent>
    </Box>
  );
};

export default AppDrawer;
