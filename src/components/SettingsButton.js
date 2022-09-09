import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import Save from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import Cookies from "js-cookie";
import axios from "axios";
import SettingsModal from "./SettingsModal";
import theme, { md } from "./utils/theme";
import { backendOrigin, inPath } from "./utils/navTools";

const SettingsButton = (props) => {
  const appState = props.appState;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dropboxUrl, setDropboxUrl] = useState("");

  useEffect(() => {
    if (settingsOpen) {
      axios
        .get(`${backendOrigin}/dropbox_auth/`, {
          headers: { Authorization: `token ${Cookies.get("token")}` },
        })
        .then(function (response) {
          setDropboxUrl(response.data.detail);
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
        dropboxUrl={dropboxUrl}
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
        }}
      />
    </>
  );
};
export default SettingsButton;
