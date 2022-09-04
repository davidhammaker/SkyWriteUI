import React, { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem";
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

  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(obj.name);
  const [ciphertext, setCiphertext] = useState(null);
  const [iv, setIv] = useState(null);

  const folderState = {
    folderName,
    setFolderName,
    showEdit,
    setShowEdit,
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
        decryptDataFromBytes(
          appState.key,
          response.data.name_iv,
          response.data.name
        )
          .then((ret) => {
            setFolderName(ret);
          })
          .catch((error) => {});
        setEditName(false);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      });
  };

  const makeNewList = () => {
    if (obj.folders.length !== 0) {
      return DrawerFileList(obj.folders, depth, appState, path);
    } else if (obj.files.length !== 0) {
      return DrawerFileList(obj.files, depth, appState, path);
    } else {
      return <></>;
    }
  };

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
      })
      .catch((error) => {});
  }, [appState.key]);

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
              },
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

      <FolderModal
        open={editName}
        onClose={() => {
          setEditName(false);
        }}
        onSave={() => encryptFolderName(newName)}
        folderState={folderState}
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {makeNewList()}
      </Collapse>
    </>
  );
};

export default DrawerFolder;