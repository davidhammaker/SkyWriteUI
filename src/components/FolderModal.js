import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Save from "@mui/icons-material/Save";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import Modal from "@mui/material/Modal";
import ReorderModal from "./ReorderModal";
import { StyledTextField } from "./CustomTextField";
import CustomFormButton from "./CustomFormButton";
import theme from "./utils/theme";
import { setUpNewFile } from "./utils/skyWriteUtils";

const FolderModal = (props) => {
  const obj = props.obj;
  const appState = props.appState;
  const folderState = props.folderState;

  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [reorderDisabled, setReorderDisabled] = useState(true);

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
          width: 500,
        }}
      >
        <Typography
          fontSize={"Larger"}
          color={theme.primaryLightest}
          sx={{ ml: { xs: 12, sm: 3 } }}
        >
          Folder Name
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Grid item>
            <StyledTextField
              defaultValue={folderState.folderName}
              placeholder="Folder name"
              sx={{
                width: { xs: 250, sm: 400 },
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
            <Tooltip title="Save Folder">
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
            </Tooltip>
          </Grid>
        </Grid>
        {!props.newFolder && (
          <Grid container justifyContent="center">
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ textAlign: "center", mb: { xs: 2 } }}
            >
              <Tooltip title="Add New File to this Folder">
                <CustomFormButton
                  sx={{
                    backgroundColor: theme.primaryLight,
                    color: theme.primaryDark,
                    boxShadow: 5,
                    "&:hover": {
                      backgroundColor: theme.primary,
                    },
                  }}
                  onClick={() => {
                    setUpNewFile(appState);
                    if (obj !== undefined && obj !== null) {
                      appState.setFilePath([obj.id, null]); // Here, `obj.id` is the folder ID for the POST request.
                      folderState.setOpen(true);
                    }
                    appState.setSaving(true);
                    folderState.setEditName(false);
                  }}
                  startIcon={<NoteAddIcon />}
                >
                  Add New File
                </CustomFormButton>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ textAlign: "center", mb: { xs: 2 } }}
            >
              <Tooltip title="Re-order Items in this Folder">
                <div>
                  <CustomFormButton
                    sx={{
                      backgroundColor: theme.primaryLight,
                      color: theme.primaryDark,
                      boxShadow: 5,
                      "&:hover": {
                        backgroundColor: theme.primary,
                      },
                    }}
                    onClick={() => {
                      setReorderModalOpen(true);
                    }}
                    startIcon={<LowPriorityIcon />}
                    disabled={reorderDisabled}
                  >
                    Re-order
                  </CustomFormButton>
                </div>
              </Tooltip>
            </Grid>
          </Grid>
        )}
        {obj && (
          <ReorderModal
            open={reorderModalOpen}
            onClose={() => {
              setReorderModalOpen(false);
              appState.setStorageObjects(null);
            }}
            appState={appState}
            setReorderDisabled={setReorderDisabled}
            setReorderModalOpen={setReorderModalOpen}
            folderId={obj.id}
          />
        )}
      </Box>
    </Modal>
  );
};

export default FolderModal;
