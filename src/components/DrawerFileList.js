import React, { useState } from "react";
import List from "@mui/material/List";
import DrawerFile from "./DrawerFile";
import DrawerFolder from "./DrawerFolder";
import Draggable from "react-draggable";
import { drawerWidth } from "../settings";

const DrawerFileList = (props) => {
  const storageObjects = props.storageObjects;
  const depth = props.depth;
  const appState = props.appState;
  const path = props.path;
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
          sx={{
            width: `${drawerWidth}px`,
          }}
          component="div"
          disablePadding
        >
          <Draggable
            axis="y"
            handle={`#drag-handle-${obj.id}`}
            onStart={() => {
              appState.setFileDragging(obj.id);
            }}
            onStop={() => {
              appState.setFileDragging(null);
            }}
          >
            <div
              style={{
                pointerEvents:
                  appState.fileDragging === obj.id ? "none" : "auto",
              }}
            >
              {!obj.is_file && (
                <DrawerFolder
                  obj={obj}
                  depth={newDepth}
                  currentPath={currentPath}
                  appState={appState}
                  getUser={props.getUser}
                />
              )}
              {obj.is_file && (
                <DrawerFile
                  obj={obj}
                  depth={newDepth}
                  currentPath={currentPath}
                  appState={appState}
                  getUser={props.getUser}
                />
              )}
            </div>
          </Draggable>
        </List>
      ))}
    </>
  );
};

export default DrawerFileList;
