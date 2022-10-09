import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DrawerSliding from "./DrawerSliding";
import DrawerPermanent from "./DrawerPermanent";
import AddItems from "./AddItems";
import DrawerFileList from "./DrawerFileList";
import theme from "./utils/theme";
import { drawerWidth } from "../settings";

const AppDrawer = (props) => {
  const appState = props.appState;

  const [draggingOver, setDraggingOver] = useState(false);

  useEffect(() => {
    setDraggingOver(false);
  }, [appState.fileDragging]);

  const container =
    props.window !== undefined ? () => props.window().document.body : undefined;

  // Dragging style
  let borderObj;
  if (draggingOver) {
    borderObj = {
      borderTopWidth: "3px",
      borderTopStyle: "solid",
      borderTopColor: theme.primaryDark,
    };
  } else {
    borderObj = {};
  }

  const drawerContents = (
    <>
      <DrawerFileList
        storageObjects={appState.storageObjects}
        depth={0}
        appState={appState}
        getUser={props.getUser}
      />
      <ListItem
        sx={{ ...borderObj }}
        onPointerEnter={() => {
          if (appState.fileDragging !== null) {
            setDraggingOver(true);
          }
        }}
        onPointerLeave={() => {
          if (appState.fileDragging !== null) {
            setDraggingOver(false);
          }
        }}
      >
        <ListItemText />
      </ListItem>
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
      <DrawerPermanent getUser={props.getUser}>
        <AddItems appState={appState} getUser={props.getUser} />
        {drawerContents}
      </DrawerPermanent>
    </Box>
  );
};

export default AppDrawer;
