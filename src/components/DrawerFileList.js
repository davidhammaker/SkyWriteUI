import React from "react";
import List from "@mui/material/List";
import DrawerFile from "./DrawerFile";
import DrawerFolder from "./DrawerFolder";
import Draggable from "react-draggable";
import { drawerWidth } from "../settings";

const DrawerFileList = (props) => {
  const storageObjects = props.storageObjects ? props.storageObjects : [];
  const depth = props.depth;
  const appState = props.appState;
  const path = props.path;
  const newDepth = depth + 1;
  const currentPath = path === undefined ? [] : path;

  return (
    <>
      {storageObjects.map((obj) => (
        <List
          key={obj.id}
          sx={{
            width: `${drawerWidth}px`,
          }}
          component="div"
          disablePadding
        >
          <div
            style={{
              pointerEvents: appState.fileDragging === obj.id ? "none" : "auto",
            }}
          >
            {!obj.is_file && (
              <DrawerFolder
                obj={obj}
                depth={newDepth}
                currentPath={currentPath}
                appState={appState}
                getUser={props.getUser}
                folderId={props.folderId}
              />
            )}
            {obj.is_file && (
              <DrawerFile
                obj={obj}
                depth={newDepth}
                currentPath={currentPath}
                appState={appState}
                getUser={props.getUser}
                folderId={props.folderId}
              />
            )}
          </div>
        </List>
      ))}
    </>
  );
};

export default DrawerFileList;
