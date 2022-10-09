import React, { useEffect, useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import theme from "./utils/theme";
import { decryptDataFromBytes } from "./utils/encryption";

const DrawerFile = (props) => {
  const appState = props.appState;
  const obj = props.obj;
  const depth = props.depth;

  const [drawerFilename, setDrawerFilename] = useState("");
  const [draggingOver, setDraggingOver] = useState(false);

  // After the key has been set, decrypt the file name.
  useEffect(() => {
    decryptDataFromBytes(
      appState.key,
      window.atob(obj.name_iv),
      window.atob(obj.name)
    )
      .then((decryptedFileName) => {
        setDrawerFilename(decryptedFileName);
      })
      .catch((error) => {});
  }, [appState.key]);

  useEffect(() => {
    if (appState.fileId === obj.id) {
      appState.setFilePath([...props.currentPath, obj.id]);
      if (drawerFilename !== "") {
        appState.setFilename(drawerFilename);
      }
    }
  }, [appState.fileId]);

  useEffect(() => {
    if (appState.filePath.includes(obj.id)) {
      setDrawerFilename(appState.filename);
    }
  }, [appState.filename]);

  useEffect(() => {
    setDraggingOver(false);
  }, [appState.fileDragging]);

  /**
   * Set the filename in the editor's filename box and load/decrypt file content.
   */
  const loadFile = () => {
    appState.setFilePath([...props.currentPath, obj.id]);
    appState.setFilename(drawerFilename);
    appState.setEditorVisibility("hidden"); // To prevent old content from flashing before new content
    appState.setLoadId(obj.id);
  };

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

  return (
    <ListItemButton
      className="drawer-object"
      objid={obj.id}
      sx={{ pl: depth + 1, pr: 3, position: "relative", ...borderObj }}
      onClick={(event) => {
        event.preventDefault;
        if (!appState.fileDragging) {
          loadFile();
        }
      }}
      onPointerEnter={() => {
        if (appState.fileDragging !== null) {
          setDraggingOver(true);
          // TODO: Set an appState object that stores all this files properties (file ID, folder ID, etc.), so we can update the moved object.
          //       Also, save the file when we stop dragging!
        }
      }}
      onPointerLeave={() => {
        if (appState.fileDragging !== null) {
          setDraggingOver(false);
        }
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: "30px",
          color: appState.filePath.includes(obj.id)
            ? theme.primaryDarkest
            : theme.primaryDark,
        }}
      >
        <ArticleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={drawerFilename}
        primaryTypographyProps={{
          sx: {
            color: theme.primaryDarkest,
            fontSize: "smaller",
            fontWeight: appState.filePath.includes(obj.id) ? "bold" : "inherit",
            wordWrap: "break-word",
            pr: 2,
            pl: 0.5,
          },
        }}
      />
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        style={{
          width: "20px",
          height: "20px",
        }}
      >
        <ListItemIcon id={`drag-handle-${obj.id}`}>
          <UnfoldMoreIcon />
        </ListItemIcon>
      </div>
    </ListItemButton>
  );
};

export default DrawerFile;
