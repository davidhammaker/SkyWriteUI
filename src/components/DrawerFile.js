import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import theme from "./utils/theme";

const DrawerFile = (props) => {
  // TODO: Decrypt filename
  const appState = props.appState;
  const obj = props.obj;
  const depth = props.depth;

  return (
    <ListItemButton
      sx={{ pl: depth + 1 }}
      onClick={(event) => {
        event.preventDefault;
        appState.setFilePath([...props.currentPath, obj.id]);
        appState.setFilename(obj.name);
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
        primary={obj.name}
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
