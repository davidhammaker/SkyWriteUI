import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import FilenameField from "./FilenameField";
import theme, { drawerWidth } from "./utils/theme";

const NavBar = (props) => {
  return (
    <AppBar>
      <Toolbar sx={{ backgroundColor: theme.primary }}>
        <IconButton
          onClick={props.menuToggle} // toggleDrawer
          edge="start"
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon sx={{ color: "#fff" }} />
        </IconButton>
        <FilenameField />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
