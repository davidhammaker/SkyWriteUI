import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Save from "@mui/icons-material/Save";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import axios from "axios";
import ReorderModal from "./ReorderModal";
import { StyledTextField } from "./CustomTextField";
import CustomFormButton from "./CustomFormButton";
import theme from "./utils/theme";
import { setUpNewFile, deleteObj } from "./utils/skyWriteUtils";
import { encryptDataToBytes } from "./utils/encryption";
import { defaultFilename } from "../settings";
import { backendOrigin } from "./utils/navTools";

const FolderDeleteConfirm = (props) => {
  const obj = props.obj;
  const folderState = props.folderState;
  const appState = props.appState;

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
          width: { xs: 300, sm: 500 },
          backgroundColor: theme.primary,
          padding: "10px",
          borderStyle: "solid",
          borderWidth: 0,
          borderRadius: 5,
          boxShadow: 5,
        }}
      >
        <Typography
          fontSize={"Larger"}
          color={theme.primaryLightest}
          sx={{ ml: { xs: 12, sm: 3 }, mb: 2 }}
        >
          Deleting "{folderState.newName}"
        </Typography>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Grid item>
            <CustomFormButton
              sx={{
                backgroundColor: theme.errorLight,
                color: theme.errorDark,
                boxShadow: 5,
                "&:hover": {
                  backgroundColor: theme.errorDark,
                  color: theme.errorLight,
                },
              }}
              onClick={() => {
                deleteObj(obj.id, false);
                props.setDeleting(false);
                folderState.setEditName(false);
                appState.setStorageObjects(null);
              }}
              startIcon={<FolderIcon />}
              endIcon={<DeleteIcon />}
            >
              Delete Folder Only (Keep Contents)
            </CustomFormButton>
          </Grid>
          <Grid item>
            <CustomFormButton
              sx={{
                backgroundColor: theme.errorLight,
                color: theme.errorDark,
                boxShadow: 5,
                "&:hover": {
                  backgroundColor: theme.errorDark,
                  color: theme.errorLight,
                },
              }}
              onClick={() => {
                if (obj !== undefined && obj !== null) {
                  deleteObj(obj.id, true);
                  props.setDeleting(false);
                  folderState.setEditName(false);
                  appState.setStorageObjects(null);
                }
              }}
              startIcon={<FolderCopyIcon />}
              endIcon={<DeleteIcon />}
            >
              Delete Folder and Contents
            </CustomFormButton>
          </Grid>
          <Grid item>
            <CustomFormButton
              sx={{
                backgroundColor: theme.primaryLight,
                color: theme.primaryDark,
                boxShadow: 5,
                "&:hover": {
                  backgroundColor: theme.primaryDark,
                  color: theme.primaryLight,
                },
              }}
              onClick={() => {
                props.setDeleting(false);
              }}
              startIcon={<CloseIcon />}
            >
              Cancel
            </CustomFormButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default FolderDeleteConfirm;
