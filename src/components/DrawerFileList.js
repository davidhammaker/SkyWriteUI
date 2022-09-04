import React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import DrawerFile from "./DrawerFile";
import DrawerFolder from "./DrawerFolder";
import theme, { drawerWidth } from "./utils/theme";

const DrawerFileList = (storageObjects, depth, appState, path) => {
  const newDepth = depth + 1;
  const currentPath = path === undefined ? [] : path;

  let folders = [];
  let files = [];
  for (let i = 0; i < storageObjects.length; i++) {
    if (storageObjects[i].is_file) {
      folders.push(storageObjects[i]);
    } else {
      files.push(storageObjects[i]);
    }
  }
  let sortedObjects = [...files, ...folders];

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
          {!obj.is_file && (
            <DrawerFolder
              obj={obj}
              depth={newDepth}
              currentPath={currentPath}
              appState={appState}
            />
          )}
          {obj.is_file && (
            <DrawerFile
              obj={obj}
              depth={newDepth}
              currentPath={currentPath}
              appState={appState}
            />
          )}
        </List>
      ))}
    </>
  );
};

export default DrawerFileList;
