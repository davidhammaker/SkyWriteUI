import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Cookies from "js-cookie";
import axios from "axios";
import CustomFormButton from "./CustomFormButton";
import SelectDefaultStorage from "./SelectDefaultStorage";
import { backendOrigin } from "./utils/navTools";
import theme from "./utils/theme";
import Dropbox_Tab_32 from "../Dropbox_Tab_32.svg";

const SettingsModal = (props) => {
  const appState = props.appState;

  const dropboxButtonText = props.config.dropbox_connected
    ? "Reconnect Dropbox"
    : "Connect Dropbox";

  const [reopenLast, setReopenLast] = useState(false);

  useEffect(() => {
    setReopenLast(Boolean(appState.lastOpenedData.id));
  }, [appState.lastOpenedData]);

  const toggleReopenLast = () => {
    let newReopenId;
    if (reopenLast) {
      newReopenId = null;
    } else {
      if (appState.fileId !== null && appState.fileId !== undefined) {
        newReopenId = appState.fileId;
      } else {
        appState.storageObjects.forEach((obj) => {
          if (obj.is_file) {
            newReopenId = obj.id;
            return;
          }
        });
      }
    }
    axios
      .patch(
        `${backendOrigin}/config/`,
        { last_file: newReopenId },
        {
          headers: { Authorization: `token ${Cookies.get("token")}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setReopenLast(!reopenLast);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      sx={{ justifyContent: "center" }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          outline: "none",
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
              <Typography sx={{ fontStyle: "italic" }}>
                General Options
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <IconButton
                    sx={{ color: theme.primaryDark }}
                    onClick={toggleReopenLast}
                  >
                    {reopenLast ? (
                      <CheckBoxIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography>Re-open Last File</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              {appState.needStorage && (
                <Typography color="#f00">
                  Storage Settings must be configured, or files cannot be saved!
                </Typography>
              )}
              <Typography sx={{ fontStyle: "italic" }}>File Storage</Typography>
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
                appState={appState}
                config={props.config}
                setConfig={props.setConfig}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography sx={{ fontStyle: "italic" }}>Account</Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography sx={{ mb: 1 }}>
                <span>Logged in as </span>
                <span style={{ fontWeight: "bold" }}>{appState.username}</span>
              </Typography>
              <Link href="/logout" underline="none" sx={{ px: 1 }}>
                <CustomFormButton variant="contained">
                  <Typography sx={{ fontSize: "Larger" }}>Log Out</Typography>
                </CustomFormButton>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Modal>
  );
};

export default SettingsModal;
