import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CustomFormButton from "./CustomFormButton";
import SelectDefaultStorage from "./SelectDefaultStorage";
import theme from "./utils/theme";
import Dropbox_Tab_32 from "../Dropbox_Tab_32.svg";

const SettingsModal = (props) => {
  const dropboxButtonText = props.config.dropbox_connected
    ? "Reconnect Dropbox"
    : "Connect Dropbox";

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
        <Typography fontSize={"Larger"} color={theme.primaryLightest}>
          Settings
        </Typography>
        <Box
          sx={{
            backgroundColor: theme.primaryLightest,
            padding: 2,
            boxShadow: 5,
            borderRadius: 4,
            width: { xs: 300, sm: 500 },
          }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography>File Storage</Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <CustomFormButton
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
                href={props.config.dropbox_auth_url}
              >
                {dropboxButtonText}
              </CustomFormButton>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <SelectDefaultStorage
                config={props.config}
                setConfig={props.setConfig}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
