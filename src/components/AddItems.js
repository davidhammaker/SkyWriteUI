import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CustomFormButton from "./CustomFormButton";
import Cookies from "js-cookie";
import axios from "axios";
import FolderModal from "./FolderModal";
import { backendOrigin } from "./utils/navTools";
import { encryptDataToBytes } from "./utils/encryption";
import { setUpNewFile } from "./utils/skyWriteUtils";

const AddItems = (props) => {
  const appState = props.appState;

  const [newName, setNewName] = useState("");
  const [folderModalOpen, setFolderModalOpen] = useState(false);
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
    <Box sx={{ height: "42px" }}>
      <Grid container direction="row">
        <Grid item xs={6} sx={{ width: "100%" }}>
          <CustomFormButton
            sx={{
              width: "100%",
              height: "42px",
              borderRadius: 0,
              fontSize: "small",
            }}
            variant="contained"
            onClick={() => setFolderModalOpen(true)}
            startIcon={<CreateNewFolderIcon />}
          >
            New Folder
          </CustomFormButton>
        </Grid>
        <Grid item xs={6} sx={{ width: "100%" }}>
          <CustomFormButton
            variant="contained"
            sx={{
              width: "100%",
              height: "42px",
              borderRadius: 0,
              borderBottomWidth: "1px",
              fontSize: "small",
            }}
            onClick={() => {
              setUpNewFile(appState);
            }}
            startIcon={<NoteAddIcon />}
          >
            New File
          </CustomFormButton>
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
    </Box>
  );
};

export default AddItems;
