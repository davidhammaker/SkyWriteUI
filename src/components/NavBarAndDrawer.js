import React, { useState } from "react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import NavBar from "./NavBar";
import AppDrawer from "./AppDrawer";
import { drawerWidth } from "./utils/theme";
import { cutOffString } from "./utils/elementTools";

const makeAccordion = (storageObjects, depth, setFilename) => {
  const newWidth = drawerWidth - depth * 16;
  const maxStringLength = 24 - depth * 2;
  const newDepth = depth + 1;
  return (
    <>
      {storageObjects.map((obj) => (
        <div key={obj.id}>
          {!obj.is_file && (
            <>
              <Accordion disableGutters sx={{ width: newWidth }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <FolderIcon />
                  <Box sx={{ ml: 1.5 }}>
                    <Typography>{cutOffString(obj.name, 18)}</Typography>
                  </Box>
                </AccordionSummary>
                <List sx={{ p: 0 }}>
                  {obj.folders.length !== 0 && (
                    <ListItem sx={{ py: 0.25 }}>
                      {makeAccordion(obj.folders, newDepth)}
                    </ListItem>
                  )}
                  {obj.files.length !== 0 && (
                    <ListItem sx={{ py: 0.25 }}>
                      {makeAccordion(obj.files, newDepth)}
                    </ListItem>
                  )}
                </List>
              </Accordion>
            </>
          )}
        </div>
      ))}
      <Paper sx={{ width: newWidth }}>
        <List sx={{ p: 0 }}>
          {storageObjects.map((obj) => (
            <div key={obj.id}>
              {obj.is_file && (
                <ListItem>
                  <ListItemIcon sx={{ mr: -2.5 }}>
                    <ArticleIcon />
                  </ListItemIcon>
                  <Typography>
                    {cutOffString(obj.name, maxStringLength)}
                  </Typography>
                </ListItem>
              )}
            </div>
          ))}
        </List>
      </Paper>
    </>
  );
};

const NavBarAndDrawer = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
  const container =
    props.window !== undefined ? () => props.window().document.body : undefined;

  return (
    <>
      <NavBar menuToggle={toggleDrawer} username={props.username} />
      <AppDrawer container={container} open={mobileOpen} onClose={toggleDrawer}>
        {makeAccordion(props.storageObjects, 0)}
      </AppDrawer>
    </>
  );
};

export default NavBarAndDrawer;
