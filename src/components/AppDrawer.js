import React, { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import DrawerSliding from "./DrawerSliding";
import DrawerPermanent from "./DrawerPermanent";
import theme, { drawerWidth } from "./utils/theme";
import { cutOffString } from "./utils/elementTools";

const SkyWriteFolder = ({ obj, depth }) => {
  const [open, setOpen] = useState(false);
  const maxStringLength = 24 - depth * 2;

  const makeNewList = () => {
    if (obj.folders.length !== 0) {
      return makeList(obj.folders, depth);
    } else if (obj.files.length !== 0) {
      return makeList(obj.files, depth);
    } else {
      return <></>;
    }
  };

  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)} sx={{ pl: depth + 1 }}>
        <ListItemIcon sx={{ color: theme.primaryDarkest }}>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText
          primary={cutOffString(obj.name, maxStringLength)}
          primaryTypographyProps={{
            color: theme.primaryDarkest,
          }}
        />
        {open ? (
          <ExpandLess
            sx={{
              color: theme.primaryDarkest,
            }}
          />
        ) : (
          <ExpandMore
            sx={{
              color: theme.primaryDarkest,
            }}
          />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {makeNewList()}
      </Collapse>
    </>
  );
};

const SkyWriteFile = ({ obj, depth }) => {
  const maxStringLength = 24 - depth * 2;

  return (
    <ListItemButton sx={{ pl: depth + 1 }}>
      <ListItemIcon sx={{ color: theme.primaryDarkest }}>
        <ArticleIcon />
      </ListItemIcon>
      <ListItemText
        primary={cutOffString(obj.name, maxStringLength)}
        primaryTypographyProps={{
          color: theme.primaryDarkest,
        }}
      />
    </ListItemButton>
  );
};

const makeList = (storageObjects, depth) => {
  // const newWidth = drawerWidth - depth * 16;
  const newDepth = depth + 1;

  let folders = [];
  let files = [];
  for (let i = 0; i < storageObjects.length; i++) {
    console.log(storageObjects[i]);
    if (storageObjects[i].is_file) {
      folders.push(storageObjects[i]);
    } else {
      files.push(storageObjects[i]);
    }
  }
  let sortedObjects = [...files, ...folders];
  console.log(sortedObjects);

  return (
    <>
      {sortedObjects.map((obj) => (
        <List
          key={obj.id}
          sx={{ width: `${drawerWidth}px`, bgcolor: theme.primaryLight }}
          component="div"
          disablePadding
        >
          <Divider sx={{ borderColor: theme.primary }} />
          {!obj.is_file && <SkyWriteFolder obj={obj} depth={newDepth} />}
          {obj.is_file && <SkyWriteFile obj={obj} depth={newDepth} />}
        </List>
      ))}
    </>
  );
};

const AppDrawer = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
  const container =
    props.window !== undefined ? () => props.window().document.body : undefined;

  const drawerContents = (
    <>
      {makeList(props.storageObjects, 0)}
      <Divider sx={{ borderColor: theme.primary }} />
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <DrawerSliding
        container={container}
        open={mobileOpen}
        onClose={toggleDrawer}
        bgcolor={theme.primary}
      >
        {drawerContents}
      </DrawerSliding>
      <DrawerPermanent bgcolor={theme.primary}>
        {drawerContents}
      </DrawerPermanent>
    </Box>
  );
};

export default AppDrawer;
