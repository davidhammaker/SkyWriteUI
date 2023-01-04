import React, { useEffect, useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Cookies from "js-cookie";
import axios from "axios";
import FolderModal from "./FolderModal";
import DrawerFileList from "./DrawerFileList";
import theme from "./utils/theme";
import { backendOrigin } from "./utils/navTools";
import { encryptDataToBytes, decryptDataFromBytes } from "./utils/encryption";

const DrawerFolder = (props) => {
  const appState = props.appState;
  const obj = props.obj;
  const depth = props.depth;
  const path = [...props.currentPath, obj.id];
  const parentFolderId = props.folderId ? props.folderId : null;

  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(obj.name);
  const [ciphertext, setCiphertext] = useState(null);
  const [iv, setIv] = useState(null);

  const folderState = {
    open,
    setOpen,
    folderName,
    setFolderName,
    editName,
    setEditName,
    newName,
    setNewName,
    ciphertext,
    setCiphertext,
    iv,
    setIv,
  };

  const encryptFolderName = (name) => {
    encryptDataToBytes(name, appState.key).then((ret) => {
      setIv(ret.iv);
      setCiphertext(ret.ciphertext);
    });
  };

  const saveFolderName = () => {
    axios
      .patch(
        `${backendOrigin}/storage_objects/${obj.id}/`,
        { name: window.btoa(ciphertext), name_iv: window.btoa(iv) },
        {
          headers: {
            Authorization: `token ${Cookies.get("token")}`,
          },
        }
      )
      .then(function (response) {
        // Close the modal
        setEditName(false);
        // Get storage objects again
        props.getUser();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      });
  };

  const makeNewList = () => {
    if (obj.files.length !== 0) {
      return (
        <DrawerFileList
          storageObjects={obj.files}
          depth={depth}
          appState={appState}
          path={path}
          getUser={props.getUser}
          folderId={obj.id}
        />
      );
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    if (appState.filePath.includes(obj.id)) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (ciphertext !== null) {
      saveFolderName();
    }
  }, [ciphertext]);

  // After the key has been set, decrypt the folder name.
  useEffect(() => {
    decryptDataFromBytes(
      appState.key,
      window.atob(obj.name_iv),
      window.atob(obj.name)
    )
      .then((decryptedFolderName) => {
        setFolderName(decryptedFolderName);
        setNewName(decryptedFolderName);
      })
      .catch((error) => {});
  }, [appState.key]);

  return (
    <>
      <ListItemButton
        id={`folder-${obj.id}`}
        className="drawer-object"
        objid={obj.id}
        onClick={() => {
          if (!appState.fileDragging) {
            setOpen(!open);
          }
        }}
        sx={{
          pl: depth * 1.5 + 1,
          pr: 3,
        }}
      >
        <>
          <ListItemIcon
            sx={{
              minWidth: "30px",
              color: appState.filePath.includes(obj.id)
                ? theme.primaryDarkest
                : theme.primaryDark,
            }}
          >
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          {open ? (
            <ExpandLess
              fontSize="small"
              sx={{
                color: theme.primaryLight,
                ml: -3.7,
              }}
            />
          ) : (
            <ExpandMore
              fontSize="small"
              sx={{
                color: theme.primaryLight,
                ml: -3.7,
              }}
            />
          )}
          <ListItemText
            primary={folderName}
            primaryTypographyProps={{
              sx: {
                color: theme.primaryDarkest,
                fontSize: "smaller",
                fontWeight: appState.filePath.includes(obj.id)
                  ? "bold"
                  : "inherit",
                wordWrap: "break-word",
                pl: 1.5,
              },
            }}
          />
          <div
            onClick={(event) => {
              event.stopPropagation();
              if (!appState.fileDragging) {
                setEditName(true);
              }
            }}
            style={{ paddingRight: "0px", paddingLeft: "10px" }}
          >
            <IconButton
              sx={{
                width: "20px",
                height: "20px",
                color: theme.primaryDark,
                "&:hover": {
                  color: theme.primaryDarkest,
                  backgroundColor: theme.primaryLight,
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
        </>
      </ListItemButton>
      <FolderModal
        open={editName}
        onClose={() => {
          setEditName(false);
        }}
        onSave={() => encryptFolderName(newName)}
        appState={appState}
        folderState={folderState}
        newFolder={false}
        obj={obj}
        getUser={props.getUser}
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {makeNewList()}
      </Collapse>
    </>
  );
};

export default DrawerFolder;
