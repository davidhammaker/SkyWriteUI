import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Cookies from "js-cookie";
import axios from "axios";
import SettingsModal from "./SettingsModal";
import theme from "./utils/theme";
import { backendOrigin } from "./utils/navTools";

const SettingsButton = (props) => {
  const appState = props.appState;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dropboxAccess, setDropboxAccess] = useState(null);

  useEffect(() => {
    if (settingsOpen) {
      axios
        .get(`${backendOrigin}/dropbox_auth/`, {
          headers: { Authorization: `token ${Cookies.get("token")}` },
        })
        .then(function (response) {
          setDropboxAccess(response.data);
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
          }
        });
    }
  }, [settingsOpen]);

  return (
    <>
      <IconButton onClick={() => setSettingsOpen(true)}>
        <SettingsIcon sx={{ color: theme.secondary }} />
      </IconButton>
      <SettingsModal
        dropboxAccess={dropboxAccess}
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
        }}
      />
    </>
  );
};
export default SettingsButton;
