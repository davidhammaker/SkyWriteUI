import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Save from "@mui/icons-material/Save";
import Modal from "@mui/material/Modal";
import { StyledTextField } from "./CustomTextField";
import theme from "./utils/theme";

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
              defaultValue={folderState.folderName}
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
