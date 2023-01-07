import React from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import SettingsButton from "./SettingsButton";
import theme from "./utils/theme";

const SettingsButtonGroup = (props) => {
  const appState = props.appState;

  return (
    <ButtonGroup
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
        <SettingsButton appState={appState} validatesStorage={true} />
      </Box>
    </ButtonGroup>
  );
};
export default SettingsButtonGroup;
