import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import Save from "@mui/icons-material/Save";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import theme, { sm } from "./utils/theme";

const FormatButton = ({ toggleMark, format }) => {
  const editor = useSlate();
  const icon = {
    bold: <FormatBold />,
    italic: <FormatItalic />,
    underline: <FormatUnderlinedIcon />,
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

const FormatBar = (props) => {
  const menuIcon = (
    <IconButton onClick={props.toggleFileDrawer}>
      <MenuIcon />
    </IconButton>
  );

  const [showMenuIcon, setShowMenuIcon] = useState(false);

  const resizeBar = () => {
    if (window.innerWidth >= sm) {
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
        width: { xs: "100%", sm: "auto" },
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
          display: { xs: "inline-block", sm: "flex" },
        }}
      >
        {showMenuIcon && menuIcon}
        <IconButton onClick={() => props.doSave(value)}>
          <Save sx={{ color: theme.secondary }} />
        </IconButton>
        <FormatButton toggleMark={props.toggleMark} format="bold" />
        <FormatButton toggleMark={props.toggleMark} format="italic" />
        <FormatButton toggleMark={props.toggleMark} format="underline" />
      </Box>
    </ButtonGroup>
  );
};
export default FormatBar;
