import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Save from "@mui/icons-material/Save";
import Collapse from "@mui/material/Collapse";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import axios from "axios";
import DrawerSliding from "./DrawerSliding";
import DrawerPermanent from "./DrawerPermanent";
import { StyledTextField } from "./CustomTextField";
import theme, { drawerWidth } from "./utils/theme";
import { cutOffString } from "./utils/elementTools";
import { backendOrigin } from "./utils/navTools";

const SkyWriteFolder = ({ obj, depth }) => {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState(obj.name);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(obj.name);
  const maxStringLength = 34 - depth * 2;

  function saveFolderName(name) {
    axios
      .patch(
        `${backendOrigin}/storage_objects/${obj.id}/`,
        { name: name },
        {
          headers: {
            Authorization: `token ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        setFolderName(response.data.name);
        setEditName(false);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      });
  }

  const makeNewList = () => {
    if (obj.folders.length !== 0) {
      return makeList(obj.folders, depth);
    } else if (obj.files.length !== 0) {
      return makeList(obj.files, depth);
    } else {
      return <></>;
    }
  };

  return (
    <>
      <ListItem
        onClick={() => setOpen(!open)}
        sx={{
          pl: depth + 1,
          cursor: "pointer",
        }}
        onMouseEnter={() => setShowEdit(true)}
        onMouseLeave={() => setShowEdit(false)}
      >
        <>
          {showEdit && (
            <>
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setEditName(true);
                }}
                style={{ paddingRight: "10px" }}
              >
                <IconButton
                  onClick={(event) => {
                    event.preventDefault;
                    setEditName(true);
                  }}
                  sx={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    color: theme.primaryLight,
                    backgroundColor: theme.primaryDark,
                    "&:hover": { backgroundColor: theme.primaryDarkest },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
            </>
          )}
          {showEdit || (
            <ListItemIcon sx={{ minWidth: "30px", color: theme.primaryDark }}>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
          )}
          <ListItemText
            primary={cutOffString(folderName, maxStringLength)}
            primaryTypographyProps={{
              color: theme.primaryDarkest,
              fontFamily: "Ubuntu Mono,monospace",
              fontSize: "small",
              fontWeight: "bold",
            }}
          />
          {open ? (
            <ExpandLess
              sx={{
                color: theme.primaryDarkest,
              }}
            />
          ) : (
            <ExpandMore
              sx={{
                color: theme.primaryDarkest,
              }}
            />
          )}
        </>
      </ListItem>

      <Modal
        open={editName}
        onClose={() => {
          setEditName(false);
        }}
        sx={{
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <StyledTextField
                defaultValue={newName}
                placeholder="Folder name"
                sx={{
                  width: "300px",
                  boxShadow: 5,
                }}
                onChange={(event) => {
                  setNewName(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.code === "Enter" || event.code === "NumpadEnter") {
                    saveFolderName(newName);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <IconButton
                sx={{
                  backgroundColor: theme.primaryLight,
                  color: theme.primaryDark,
                  boxShadow: 5,
                  "&:hover": {
                    backgroundColor: theme.primary,
                  },
                }}
                onClick={() => {
                  saveFolderName(newName);
                }}
              >
                <Save />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {makeNewList()}
      </Collapse>
    </>
  );
};

const SkyWriteFile = ({ obj, depth }) => {
  const maxStringLength = 38 - depth * 2;

  return (
    <ListItemButton sx={{ pl: depth + 1 }}>
      <ListItemIcon
        sx={{
          minWidth: "30px",
          color: theme.primaryDark,
        }}
      >
        <ArticleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={cutOffString(obj.name, maxStringLength)}
        primaryTypographyProps={{
          color: theme.primaryDarkest,
          fontFamily: "Ubuntu Mono,monospace",
          fontSize: "small",
          fontWeight: "bold",
        }}
      />
    </ListItemButton>
  );
};

const makeList = (storageObjects, depth) => {
  // const newWidth = drawerWidth - depth * 16;
  const newDepth = depth + 1;

  let folders = [];
  let files = [];
  for (let i = 0; i < storageObjects.length; i++) {
    if (storageObjects[i].is_file) {
      folders.push(storageObjects[i]);
    } else {
      files.push(storageObjects[i]);
    }
  }
  let sortedObjects = [...files, ...folders];

  return (
    <>
      {sortedObjects.map((obj) => (
        <List
          key={obj.id}
          sx={{ width: `${drawerWidth}px`, bgcolor: theme.primaryLight }}
          component="div"
          disablePadding
        >
          <Divider sx={{ borderColor: theme.primary }} />
          {!obj.is_file && <SkyWriteFolder obj={obj} depth={newDepth} />}
          {obj.is_file && <SkyWriteFile obj={obj} depth={newDepth} />}
        </List>
      ))}
    </>
  );
};

const AppDrawer = (props) => {
  const container =
    props.window !== undefined ? () => props.window().document.body : undefined;

  const drawerContents = (
    <>
      {makeList(props.storageObjects, 0)}
      <Divider sx={{ borderColor: theme.primary }} />
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <DrawerSliding
        container={container}
        open={props.open}
        onClose={props.toggleFileDrawer}
        bgcolor={theme.primary}
      >
        {drawerContents}
      </DrawerSliding>
      <DrawerPermanent bgcolor={theme.primary}>
        {drawerContents}
      </DrawerPermanent>
    </Box>
  );
};

export default AppDrawer;
