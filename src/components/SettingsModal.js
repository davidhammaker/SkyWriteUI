import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Save from "@mui/icons-material/Save";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { StyledTextField } from "./CustomTextField";
import theme from "./utils/theme";
import Dropbox_Tab_32 from "../Dropbox_Tab_32.svg";

const SettingsModal = (props) => {
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
            <Button
              variant="contained"
              startIcon={
                <img src={Dropbox_Tab_32} height="24px" width="24px" />
              }
              sx={{
                backgroundColor: theme.primaryLight,
                color: theme.primaryDark,
                boxShadow: 5,
                "&:hover": {
                  backgroundColor: theme.primary,
                },
              }}
              href={props.dropboxUrl}
            >
              Connect Dropbox
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
