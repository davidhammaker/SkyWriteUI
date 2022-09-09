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
import SettingsButton from "./SettingsButton";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import theme, { md } from "./utils/theme";

const SettingsButtonGroup = (props) => {
  const appState = props.appState;

  return (
    <ButtonGroup
      id="editorButtons"
      variant="contained"
      sx={{
        boxShadow: 0,
        width: { xs: "100%", md: "auto" },
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.secondaryLightest,
          borderWidth: 1,
          borderColor: theme.secondaryLight,
          borderStyle: "solid",
          flexWrap: "nowrap",
          width: { xs: "100%" },
          display: { xs: "inline-block", md: "flex" },
        }}
      >
        <SettingsButton />
      </Box>
    </ButtonGroup>
  );
};
export default SettingsButtonGroup;
