import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import theme from "./utils/theme";
import Dropbox_Tab_32 from "../Dropbox_Tab_32.svg";

const SettingsModal = (props) => {
  const dropboxConnected =
    props.dropboxAccess !== null ? props.dropboxAccess.connected : false;
  const useDropbox =
    props.dropboxAccess !== null ? props.dropboxAccess.use_dropbox : false;
  const authUrl =
    props.dropboxAccess !== null ? props.dropboxAccess.auth_url : false;

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
          backgroundColor: theme.primaryLightest,
          padding: 2,
          boxShadow: 5,
          borderRadius: 4,
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
                "&:hover": {
                  backgroundColor: theme.primary,
                },
              }}
              href={authUrl}
              disabled={dropboxConnected}
            >
              {dropboxConnected && <>Dropbox Connected</>}
              {dropboxConnected || <>Connect Dropbox</>}
            </Button>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Switch checked={useDropbox} />
              </Grid>
              <Grid item>
                <Typography>
                  {useDropbox && "Using Dropbox"}
                  {useDropbox || "Not using Dropbox"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
