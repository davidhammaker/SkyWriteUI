import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
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
    console.log(appState.key);
    encryptDataToBytes(name, appState.key).then((ret) => {
      setIv(ret.iv);
      setCiphertext(ret.ciphertext);
    });
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
          console.log(ret);
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
    if (ciphertext !== null) {
      saveNewFolder();
    }
    console.log(newName);
  });

  return (
    <Box>
      <Grid container direction="row">
        <Grid item>
          <Button onClick={() => setFolderModalOpen(true)}>New Folder</Button>
        </Grid>
        <Grid item>
          <Button disabled>New File</Button>
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
