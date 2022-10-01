import React, { useEffect, useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import Cookies from "js-cookie";
import axios from "axios";
import theme from "./utils/theme";
import { backendOrigin } from "./utils/navTools";
import { encryptDataToBytes, decryptDataFromBytes } from "./utils/encryption";

const DrawerFile = (props) => {
  // TODO: Decrypt filename
  const appState = props.appState;
  const obj = props.obj;
  const depth = props.depth;

  const [drawerFilename, setDrawerFilename] = useState("");

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

  /**
   * Set the filename in the editor's filename box and load/decrypt file content.
   */
  const loadFile = () => {
    appState.setFilePath([...props.currentPath, obj.id]);
    appState.setFilename(drawerFilename);
    axios
      .get(`${backendOrigin}/storage_objects/${obj.id}/`, {
        headers: {
          Authorization: `token ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        decryptDataFromBytes(
          appState.key,
          window.atob(response.data.content_iv),
          window.atob(response.data.content)
        ).then((decryptedContent) => {
          appState.setEditorValue(JSON.parse(decryptedContent));
        });
      });
  };

  return (
    <ListItemButton
      sx={{ pl: depth + 1 }}
      onClick={(event) => {
        event.preventDefault;
        loadFile();
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
          },
        }}
      />
    </ListItemButton>
  );
};

export default DrawerFile;
