import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Save from "@mui/icons-material/Save";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import axios from "axios";
import ReorderModal from "./ReorderModal";
import { StyledTextField } from "./CustomTextField";
import CustomFormButton from "./CustomFormButton";
import FolderDeleteConfirm from "./FolderDeleteConfirm";
import theme from "./utils/theme";
import { setUpNewFile, deleteObj } from "./utils/skyWriteUtils";
import { encryptDataToBytes } from "./utils/encryption";
import { defaultFilename } from "../settings";
import { backendOrigin } from "./utils/navTools";

const FolderModal = (props) => {
  const obj = props.obj;
  const appState = props.appState;
  const folderState = props.folderState;

  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [reorderDisabled, setReorderDisabled] = useState(true);
  const [saveFolder, setSaveFolder] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const newFolderInFolder = () => {
    encryptDataToBytes(`${defaultFilename} folder`, appState.key)
      .then((ret) => {
        axios
          .post(
            `${backendOrigin}/storage_objects/`,
            {
              name: window.btoa(ret.ciphertext),
              name_iv: window.btoa(ret.iv),
              is_file: false,
              folder_id: obj.id,
            },
            {
              headers: {
                Authorization: `token ${Cookies.get("token")}`,
              },
            }
          )
          .then(function (response) {
            // Close the modal
            folderState.setEditName(false);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
            }
          });
      })
      .then(() => {
        // Get storage objects again
        props.getUser();
      });
  };

  useEffect(() => {
    if (saveFolder) {
      setSaveFolder(false);
      newFolderInFolder();
    }
  }, [saveFolder]);

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
                width: { xs: 220, sm: 370 },
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
                    backgroundColor: theme.primaryDark,
                    color: theme.primaryLight,
                  },
                }}
                onClick={() => {
                  props.onSave();
                }}
              >
                <Save />
              </IconButton>
            </Tooltip>
            {!props.newFolder && (
              <Tooltip title="Delete Folder">
                <IconButton
                  sx={{
                    ml: 1,
                    backgroundColor: theme.errorDark,
                    color: theme.errorLight,
                    boxShadow: 5,
                    "&:hover": {
                      backgroundColor: theme.error,
                    },
                  }}
                  onClick={() => {
                    setDeleting(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
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
              <Tooltip title="Add New Folder to this Folder">
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
                    if (obj !== undefined && obj !== null) {
                      setSaveFolder(true);
                      folderState.setOpen(true);
                    }
                  }}
                  startIcon={<CreateNewFolderIcon />}
                >
                  New Folder
                </CustomFormButton>
              </Tooltip>
            </Grid>
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
                      backgroundColor: theme.primaryDark,
                      color: theme.primaryLight,
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
                  New File
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
                        backgroundColor: theme.primaryDark,
                        color: theme.primaryLight,
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
          <>
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
            <FolderDeleteConfirm
              open={deleting}
              onclose={() => {
                setDeleting(false);
              }}
              obj={obj}
              folderState={folderState}
              appState={appState}
              setDeleting={setDeleting}
            />
          </>
        )}
      </Box>
    </Modal>
  );
};

export default FolderModal;
