import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CustomFormButton from "./CustomFormButton";
import Cookies from "js-cookie";
import axios from "axios";
import FolderModal from "./FolderModal";
import { backendOrigin } from "./utils/navTools";
import { encryptDataToBytes, decryptDataFromBytes } from "./utils/encryption";

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
        setFolderModalOpen(false);
        decryptDataFromBytes(
          appState.key,
          window.atob(response.name_iv),
          window.atob(response.name)
        ).then((ret) => {
          setNewName(ret);
        });
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
    <Box>
      <Grid container direction="row">
        <Grid item xs={6} sx={{ width: "100%" }}>
          <CustomFormButton
            sx={{ width: "100%", borderRadius: 0 }}
            variant="contained"
            onClick={() => setFolderModalOpen(true)}
          >
            New Folder
          </CustomFormButton>
        </Grid>
        <Grid item xs={6} sx={{ width: "100%" }}>
          <CustomFormButton
            variant="contained"
            sx={{ width: "100%", borderRadius: 0 }}
            disabled
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
        folderState={folderState}
      />
    </Box>
  );
};

export default AddItems;
