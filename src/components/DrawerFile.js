import React, { useEffect, useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import Cookies from "js-cookie";
import axios from "axios";
import { backendOrigin } from "./utils/navTools";
import theme from "./utils/theme";
import { decryptDataFromBytes } from "./utils/encryption";

const defaultFilename = "";

const DrawerFile = (props) => {
  const appState = props.appState;
  const obj = props.obj;
  const depth = props.depth;

  const [drawerFilename, setDrawerFilename] = useState(defaultFilename);

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
      if (drawerFilename !== defaultFilename) {
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
    if (
      appState.lastOpenedData.id === obj.id &&
      appState.lastOpenedData.ready &&
      drawerFilename !== defaultFilename
    ) {
      loadFile();
    }
  }, [appState.lastOpenedData, drawerFilename]);

  /**
   * Set the filename in the editor's filename box and load/decrypt file content.
   */
  const loadFile = () => {
    appState.setFilePath([...props.currentPath, obj.id]);
    appState.setFilename(drawerFilename);
    appState.setEditorVisibility("hidden"); // To prevent old content from flashing before new content
    appState.setLoadId(obj.id);
    appState.setLoading(true);
    if (appState.lastOpenedData.id !== null) {
      axios
        .patch(
          `${backendOrigin}/config/`,
          { last_file: obj.id },
          {
            headers: {
              Authorization: `token ${Cookies.get("token")}`,
            },
          }
        )
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    }
  };

  /**
   * Confirm loading a file before actually loading it.
   */
  const confirmLoad = () => {
    const continueLoad = window.confirm(
      "You have unsaved changes. Are you sure you want to switch files?"
    );
    if (continueLoad) {
      appState.setUnsaved(false);
      loadFile();
    }
  };

  return (
    <ListItemButton
      className="drawer-object"
      objid={obj.id}
      sx={{ pl: depth * 1.5 + 1, pr: 3 }}
      onClick={(event) => {
        event.preventDefault;
        if (!appState.unsaved) {
          loadFile();
        } else {
          confirmLoad();
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
    </ListItemButton>
  );
};

export default DrawerFile;
