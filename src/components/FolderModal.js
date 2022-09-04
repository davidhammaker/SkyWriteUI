import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Save from "@mui/icons-material/Save";
import Collapse from "@mui/material/Collapse";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import axios from "axios";
import DrawerSliding from "./DrawerSliding";
import DrawerPermanent from "./DrawerPermanent";
import AddItems from "./AddItems";
import { StyledTextField } from "./CustomTextField";
import theme, { drawerWidth } from "./utils/theme";
import { backendOrigin } from "./utils/navTools";

const FolderModal = (props) => {
  const folderState = props.folderState;
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      sx={{
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <StyledTextField
              defaultValue={folderState.newName}
              placeholder="Folder name"
              sx={{
                width: "300px",
                boxShadow: 5,
              }}
              onChange={(event) => {
                folderState.setNewName(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.code === "Enter" || event.code === "NumpadEnter") {
                  props.onSave();
                }
              }}
            />
          </Grid>
          <Grid item>
            <IconButton
              sx={{
                backgroundColor: theme.primaryLight,
                color: theme.primaryDark,
                boxShadow: 5,
                "&:hover": {
                  backgroundColor: theme.primary,
                },
              }}
              onClick={() => {
                props.onSave();
              }}
            >
              <Save />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default FolderModal;
