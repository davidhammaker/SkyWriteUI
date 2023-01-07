import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import theme from "./utils/theme";
import { deleteObj } from "./utils/skyWriteUtils";

const FileModal = (props) => {
  const obj = props.obj;
  const filename = props.filename;
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
          width: { xs: 200 },
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
          {filename}
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
            <Tooltip title="Delete File">
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
                  const deleteYes = window.confirm(
                    `Are you sure you want to delete "${filename}"?`
                  );
                  if (deleteYes) {
                    deleteObj(obj.id, false).then(() => {
                      appState.setStorageObjects(null);
                    });
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default FileModal;
