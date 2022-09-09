import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import Save from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import SettingsButton from "./SettingsButton";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import theme, { md } from "./utils/theme";

const FormatButton = ({ toggleMark, format }) => {
  const editor = useSlate();
  const icon = {
    bold: (
      <Tooltip title="Bold">
        <FormatBold />
      </Tooltip>
    ),
    italic: (
      <Tooltip title="Italic">
        <FormatItalic />
      </Tooltip>
    ),
    underline: (
      <Tooltip title="Underline">
        <FormatUnderlinedIcon />
      </Tooltip>
    ),
  }[format];
  return (
    <IconButton
      sx={{
        color: (Editor.marks(editor) || {})[format]
          ? theme.secondaryDark
          : theme.secondaryLight,
      }}
      onClick={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </IconButton>
  );
};

const TextIncreaseButton = ({ toggleIncrease }) => {
  const editor = useSlate();

  return (
    <IconButton
      sx={{
        color:
          !Editor.marks(editor) || !Editor.marks(editor)["h1"]
            ? theme.secondary
            : theme.primaryLight,
      }}
      onClick={(event) => {
        event.preventDefault();
        toggleIncrease();
      }}
    >
      <Tooltip title="Bigger Text">
        <TextIncreaseIcon />
      </Tooltip>
    </IconButton>
  );
};

const TextDecreaseButton = ({ toggleDecrease }) => {
  const editor = useSlate();

  return (
    <IconButton
      sx={{
        color:
          Editor.marks(editor) &&
          (Editor.marks(editor)["h1"] ||
            Editor.marks(editor)["h2"] ||
            Editor.marks(editor)["h3"])
            ? theme.secondary
            : theme.primaryLight,
      }}
      onClick={(event) => {
        event.preventDefault();
        toggleDecrease();
      }}
    >
      <Tooltip title="Smaller Text">
        <TextDecreaseIcon />
      </Tooltip>
    </IconButton>
  );
};

const FormatBar = (props) => {
  const appState = props.appState;

  const menuIcon = (
    <IconButton onClick={props.toggleFileDrawer}>
      <MenuIcon />
    </IconButton>
  );

  const [showMenuIcon, setShowMenuIcon] = useState(false);
  const resizeBar = () => {
    if (window.innerWidth >= md) {
      setShowMenuIcon(false);
    } else {
      setShowMenuIcon(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeBar);
  }, []);

  useEffect(() => {
    resizeBar();
  });

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
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            {showMenuIcon && menuIcon}
            <IconButton
              onClick={() =>
                props.doSave(
                  props.editorValue,
                  appState.filename,
                  appState.fileId
                )
              }
            >
              <Save sx={{ color: theme.secondary }} />
            </IconButton>
            <FormatButton toggleMark={props.toggleMark} format="bold" />
            <FormatButton toggleMark={props.toggleMark} format="italic" />
            <FormatButton toggleMark={props.toggleMark} format="underline" />
            <TextDecreaseButton toggleDecrease={props.toggleDecrease} />
            <TextIncreaseButton toggleIncrease={props.toggleIncrease} />
          </Grid>
          <Grid item>{showMenuIcon && <SettingsButton />}</Grid>
        </Grid>
      </Box>
    </ButtonGroup>
  );
};
export default FormatBar;
