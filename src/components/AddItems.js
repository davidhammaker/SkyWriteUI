import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Tooltip from "@mui/material/Tooltip";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import CustomFormButton from "./CustomFormButton";
import Cookies from "js-cookie";
import axios from "axios";
import FolderModal from "./FolderModal";
import ReorderModal from "./ReorderModal";
import { backendOrigin } from "./utils/navTools";
import { encryptDataToBytes } from "./utils/encryption";
import { setUpNewFile } from "./utils/skyWriteUtils";

const AddItems = (props) => {
  const appState = props.appState;

  const [newName, setNewName] = useState("");
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [reorderDisabled, setReorderDisabled] = useState(true);
  const [ciphertext, setCiphertext] = useState(null);
  const [iv, setIv] = useState(null);
  const [saveFolder, setSaveFolder] = useState(false);

  const folderState = {
    newName,
    setNewName,
    folderModalOpen,
    setFolderModalOpen,
    ciphertext,
    setCiphertext,
    iv,
    setIv,
  };

  const encryptFolderName = (name) => {
    encryptDataToBytes(name, appState.key)
      .then((ret) => {
        setIv(ret.iv);
        setCiphertext(ret.ciphertext);
      })
      .then(() => setSaveFolder(true)); // When we set ``saveFolder`` to ``true``, we trigger its effect.
  };

  const saveNewFolder = () => {
    axios
      .post(
        `${backendOrigin}/storage_objects/`,
        {
          name: window.btoa(ciphertext),
          name_iv: window.btoa(iv),
          is_file: false,
        },
        {
          headers: {
            Authorization: `token ${Cookies.get("token")}`,
          },
        }
      )
      .then(function (response) {
        // Close the modal
        setFolderModalOpen(false);
        // Get storage objects again
        props.getUser();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      });
  };

  useEffect(() => {
    if (saveFolder) {
      setSaveFolder(false);
      saveNewFolder();
    }
  }, [saveFolder]);

  return (
    <Box sx={{ height: "42px" }} id="add-items">
      <Grid container direction="row">
        <Grid item xs={4} sx={{ width: "100%" }}>
          <Tooltip title="New Folder">
            <CustomFormButton
              sx={{
                boxShadow: 0,
                borderStyle: "solid",
                width: "100%",
                height: "42px",
                borderRadius: 0,
                fontSize: "small",
              }}
              variant="contained"
              onClick={() => setFolderModalOpen(true)}
              startIcon={<CreateNewFolderIcon />}
            ></CustomFormButton>
          </Tooltip>
        </Grid>
        <Grid item xs={4} sx={{ width: "100%" }}>
          <Tooltip title="New File">
            <CustomFormButton
              variant="contained"
              sx={{
                boxShadow: 0,
                borderStyle: "solid",
                width: "100%",
                height: "42px",
                borderRadius: 0,
                fontSize: "small",
              }}
              onClick={() => {
                setUpNewFile(appState);
              }}
              startIcon={<NoteAddIcon />}
            ></CustomFormButton>
          </Tooltip>
        </Grid>
        <Grid item xs={4} sx={{ width: "100%" }}>
          <Tooltip title="Re-Order">
            <span>
              <CustomFormButton
                sx={{
                  boxShadow: 0,
                  borderStyle: "solid",
                  width: "100%",
                  height: "42px",
                  borderRadius: 0,
                  fontSize: "small",
                }}
                variant="contained"
                onClick={() => setReorderModalOpen(true)}
                startIcon={<LowPriorityIcon />}
                disabled={reorderDisabled}
              ></CustomFormButton>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
      <FolderModal
        open={folderModalOpen}
        onClose={() => {
          setFolderModalOpen(false);
        }}
        onSave={() => encryptFolderName(newName)}
        appState={appState}
        folderState={folderState}
        newFolder={true}
      />
      <ReorderModal
        open={reorderModalOpen}
        onClose={() => {
          setReorderModalOpen(false);
        }}
        appState={appState}
        setReorderDisabled={setReorderDisabled}
        setReorderModalOpen={setReorderModalOpen}
      />
    </Box>
  );
};

export default AddItems;
