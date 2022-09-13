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
  const [config, setConfig] = useState({
    dropbox_auth_url: "",
    default_storage: "",
    dropbox_connected: false,
  });

  useEffect(() => {
    if (settingsOpen) {
      axios
        .get(`${backendOrigin}/config/`, {
          headers: { Authorization: `token ${Cookies.get("token")}` },
        })
        .then(function (response) {
          setConfig(response.data);
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
        config={config}
        setConfig={setConfig}
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
        }}
      />
    </>
  );
};
export default SettingsButton;
