import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Cookies from "js-cookie";
import axios from "axios";
import CustomFormButton from "./CustomFormButton";
import theme from "./utils/theme";
import { backendOrigin } from "./utils/navTools";
import { decryptDataFromBytes } from "./utils/encryption";
import { Divider } from "@mui/material";

const getIds = (objList) => {
  let ids = [];
  objList.forEach((obj) => {
    ids.push(obj.id);
    if (!obj.is_file) {
      ids = [...ids, ...getIds(obj.files)];
    }
  });
  return ids;
};

/**
 * A very simple component for rendering a filename in this modal only.
 */
const ModalFile = (props) => {
  const appState = props.appState;
  const file = props.file;

  const [filename, setFilename] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (file.id === null) {
      setFilename("(no folder)");
    } else {
      decryptDataFromBytes(
        appState.key,
        window.atob(file.name_iv),
        window.atob(file.name)
      )
        .then((decryptedName) => {
          setFilename(decryptedName);
        })
        .catch((error) => {});
    }

    if (props.selection && props.selection.includes(file.id)) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  });

  return (
    <Typography
      sx={{
        pl: 1,
        textDecoration: invalid ? "line-through" : "none",
        color: invalid ? theme.primary : theme.primaryDarkest,
      }}
    >
      {filename}
    </Typography>
  );
};

/**
 * A simple component for rendering a list of files and folders.
 */
const ModalFolderList = (props) => {
  const appState = props.appState;

  return (
    <>
      {props.objList.map((file) => (
        <Box key={file.id}>
          <Box
            sx={{ py: 0.5, width: "100%", cursor: "pointer" }}
            onClick={(event) => {
              event.preventDefault();
              props.handleOnClick(file.id, event.shiftKey);
            }}
          >
            <Grid container direction="row">
              <Grid item sx={{ mr: 1 }}>
                {props.targetId && file.id === props.targetId ? (
                  <ArrowForwardIcon sx={{ color: theme.primaryDark }} />
                ) : (
                  <>
                    {props.selection && props.selection.includes(file.id) ? (
                      <CheckBoxIcon sx={{ color: theme.primaryDark }} />
                    ) : (
                      <CheckBoxOutlineBlankIcon
                        sx={{ color: theme.primaryDark }}
                      />
                    )}
                  </>
                )}
              </Grid>
              <Grid item>
                {file.is_file ? <ArticleIcon /> : <FolderIcon />}
              </Grid>
              <Grid item xs={9}>
                <ModalFile file={file} appState={appState} />
              </Grid>
            </Grid>
          </Box>
          {!file.is_file && (
            <Box sx={{ pl: 2 }}>
              <ModalFolderList
                objList={file.files}
                appState={appState}
                handleOnClick={props.handleOnClick}
                targetId={props.targetId}
                selection={props.selection}
              />
            </Box>
          )}
        </Box>
      ))}
    </>
  );
};

/**
 * A simple component for showing folder options for moving files.
 */
const ModalFolderOptions = (props) => {
  const appState = props.appState;
  return (
    <>
      {props.objList.map((file) => (
        <div key={file.id}>
          {!file.is_file && (
            <Box>
              <Box
                sx={{ py: 0.5, width: "100%", cursor: "pointer" }}
                onClick={(event) => {
                  event.preventDefault();
                  if (props.selection && !props.selection.includes(file.id)) {
                    props.setTargetId(file.id);
                  }
                }}
              >
                <Grid container direction="row">
                  <Grid item>
                    {file.id === props.targetId ? (
                      <RadioButtonCheckedIcon
                        sx={{ color: theme.primaryDark }}
                      />
                    ) : (
                      <RadioButtonUncheckedIcon
                        sx={{ color: theme.primaryDark }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={9}>
                    <ModalFile
                      file={file}
                      appState={appState}
                      selection={props.selection}
                    />
                  </Grid>
                </Grid>
              </Box>
              {!file.is_file && (
                <Box sx={{ pl: 2 }}>
                  <ModalFolderOptions
                    objList={file.files}
                    appState={appState}
                    targetId={props.targetId}
                    setTargetId={props.setTargetId}
                    selection={props.selection}
                  />
                </Box>
              )}
            </Box>
          )}
        </div>
      ))}
    </>
  );
};

/**
 * A modal for selecting files and folders to be moved to another folder.
 */
const MoveItemsModal = (props) => {
  const appState = props.appState;

  const nullFolder = { id: null, is_file: false, files: [] };

  const [rootList, setRootList] = useState([]);
  const [idsVertical, setIdsVertical] = useState([]);
  const [prevSelect, setPrevSelect] = useState(null);
  const [selection, setSelection] = useState([]);
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    if (appState.key !== null) {
      setRootList(appState.storageObjects);
      setIdsVertical([null, ...getIds(appState.storageObjects)]);
      props.setMoveFilesDisabled(false);
    }
  }, [appState.key]);

  const handleOnShiftClick = (objId) => {
    let topId;
    let bottomId;
    if (idsVertical.indexOf(prevSelect) < idsVertical.indexOf(objId)) {
      topId = prevSelect;
      bottomId = objId;
    } else {
      topId = objId;
      bottomId = prevSelect;
    }
    const ids = idsVertical.slice(
      idsVertical.indexOf(topId) + 1,
      idsVertical.indexOf(bottomId) + 1
    );
    let newSelection = [...selection];
    ids.forEach((id) => {
      if (id === targetId) {
        return;
      }
      if (selection.includes(id)) {
        newSelection = [
          ...newSelection.slice(0, newSelection.indexOf(id)),
          ...newSelection.slice(
            newSelection.indexOf(id) + 1,
            newSelection.length
          ),
        ];
      } else {
        newSelection.push(id);
      }
    });
    setSelection(newSelection);
  };

  const handleOnClick = (objId, shiftKey) => {
    if (shiftKey) {
      handleOnShiftClick(objId);
    } else {
      if (objId === targetId) {
        return;
      } else if (selection.includes(objId)) {
        setSelection([
          ...selection.slice(0, selection.indexOf(objId)),
          ...selection.slice(selection.indexOf(objId) + 1, selection.length),
        ]);
      } else {
        setSelection([...selection, objId]);
      }
    }
    setPrevSelect(objId);
  };

  const handleSave = () => {
    axios
      .post(
        `${backendOrigin}/re_organize/`,
        { files: selection, folder_id: targetId },
        {
          headers: { Authorization: `token ${Cookies.get("token")}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          appState.setStorageObjects(null);
          props.setMoveFilesModalOpen(false);
        }
      });
  };

  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.onClose}
      sx={{
        justifyContent: "center",
      }}
      scroll="body"
    >
      <Grid container direction="row">
        <Grid item xs={10} sm={11} sx={{ width: "100%" }}>
          <CustomFormButton
            variant="contained"
            sx={{
              boxShadow: 0,
              width: "100%",
              height: "42px",
              borderRadius: 0,
              fontSize: "small",
            }}
            onClick={() => {
              handleSave();
            }}
            startIcon={<DoneIcon />}
          ></CustomFormButton>
        </Grid>
        <Grid item xs={2} sm={1} sx={{ width: "100%" }}>
          <CustomFormButton
            variant="contained"
            sx={{
              boxShadow: 0,
              width: "100%",
              height: "42px",
              borderRadius: 0,
              fontSize: "small",
            }}
            onClick={() => {
              props.setMoveFilesModalOpen(false);
            }}
            startIcon={<CloseIcon />}
          ></CustomFormButton>
        </Grid>
      </Grid>
      <DialogContent
        sx={{
          backgroundColor: theme.primary,
        }}
      >
        {rootList && (
          <Grid container direction="row">
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 1,
                  m: 1,
                  borderRadius: 1,
                  backgroundColor: theme.primaryLightest,
                  userSelect: "none",
                }}
              >
                <Typography sx={{ color: theme.primaryDark }}>
                  Select items to move.
                </Typography>
                <Divider />
                <ModalFolderList
                  objList={rootList}
                  appState={appState}
                  handleOnClick={handleOnClick}
                  targetId={targetId}
                  selection={selection}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 1,
                  m: 1,
                  borderRadius: 1,
                  backgroundColor: theme.primaryLightest,
                  userSelect: "none",
                }}
              >
                <Typography sx={{ color: theme.primaryDark }}>
                  Select the target folder.
                </Typography>
                <Divider />
                <ModalFolderOptions
                  objList={[nullFolder, ...rootList]}
                  appState={appState}
                  targetId={targetId}
                  setTargetId={setTargetId}
                  selection={selection}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MoveItemsModal;
