import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import Save from "@mui/icons-material/Save";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MenuIcon from "@mui/icons-material/Menu";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import CodeIcon from "@mui/icons-material/Code";
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

const ElementButton = ({ toggleElement, format }) => {
  const editor = useSlate();
  const icon = {
    head1: (
      <Tooltip title="Header 1">
        <LooksOneIcon />
      </Tooltip>
    ),
    head2: (
      <Tooltip title="Header 2">
        <LooksTwoIcon />
      </Tooltip>
    ),
    code: (
      <Tooltip title="Code Block">
        <CodeIcon />
      </Tooltip>
    ),
  }[format];
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });
  return (
    <IconButton
      sx={{
        color: match ? theme.secondaryDark : theme.secondaryLight,
      }}
      onClick={(event) => {
        event.preventDefault();
        toggleElement(editor, format);
      }}
    >
      {icon}
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

  const saveButton = (
    <IconButton onClick={() => appState.setSaving(true)}>
      <Save sx={{ color: theme.secondary }} />
    </IconButton>
  );

  const savingSpinner = (
    <IconButton className="saving-spinner" disabled>
      <AutorenewIcon sx={{ color: theme.secondary }} />
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
            {!appState.saving && saveButton}
            {appState.saving && savingSpinner}
            <FormatButton toggleMark={props.toggleMark} format="bold" />
            <FormatButton toggleMark={props.toggleMark} format="italic" />
            <FormatButton toggleMark={props.toggleMark} format="underline" />
            <ElementButton toggleElement={props.toggleElement} format="head1" />
            <ElementButton toggleElement={props.toggleElement} format="head2" />
            <ElementButton toggleElement={props.toggleElement} format="code" />
          </Grid>
          <Grid item>{showMenuIcon && <SettingsButton />}</Grid>
        </Grid>
      </Box>
    </ButtonGroup>
  );
};
export default FormatBar;
