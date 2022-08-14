import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import theme from "./utils/theme";

export const drawerWidth = 240;

const drawer = (
  <>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FolderIcon />
        <Box sx={{ ml: 4 }}>
          <Typography>Accordion 1</Typography>
        </Box>
      </AccordionSummary>
      <List>
        <ListItem>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <FolderIcon />
              <Box sx={{ ml: 4 }}>
                <Typography>Accordion 1.1</Typography>
              </Box>
            </AccordionSummary>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText primary="List text 1.1" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText primary="List text 1.2" />
              </ListItem>
            </List>
          </Accordion>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="List text 1" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="List text 3" />
        </ListItem>
      </List>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FolderIcon />
        <Box sx={{ ml: 4 }}>
          <Typography>Accordion 2</Typography>
        </Box>
      </AccordionSummary>
      <List>
        <ListItem>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="List text 2.1" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="List text 2.2" />
        </ListItem>
      </List>
    </Accordion>
  </>
);

const NavBarAndDrawer = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
  const container =
    props.window !== undefined ? () => props.window().document.body : undefined;

  return (
    <>
      <AppBar>
        <Toolbar sx={{ backgroundColor: theme.primary }}>
          <IconButton
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon sx={{ color: "#fff" }} />
          </IconButton>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h6" noWrap component="div">
                Sky-Write
              </Typography>
            </Grid>
            <Grid item>
              <Box spacing={2}>
                <Link underline="none" sx={{ px: 1 }}>
                  <Button sx={{ color: theme.primaryLight }}>Log In</Button>
                </Link>
                <Link underline="none" sx={{ px: 1 }}>
                  <Button sx={{ color: theme.primaryLight }}>Sign up</Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          PaperProps={{
            sx: {
              backgroundColor: theme.secondaryDark,
              border: 0,
            },
          }}
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          PaperProps={{
            sx: {
              mt: "5.5em",
              backgroundColor: theme.secondaryDark,
              border: 0,
            },
          }}
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default NavBarAndDrawer;
