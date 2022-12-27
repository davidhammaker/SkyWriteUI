import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import DoneIcon from "@mui/icons-material/Done";
import { ReactSortable } from "react-sortablejs";
import Cookies from "js-cookie";
import axios from "axios";
import CustomFormButton from "./CustomFormButton";
import theme from "./utils/theme";
import { backendOrigin } from "./utils/navTools";
import { decryptDataFromBytes } from "./utils/encryption";

const ReorderModal = (props) => {
  const appState = props.appState;

  const [files, setFiles] = useState([]);

  const saveOrder = () => {
    let objIds = [];
    files.forEach((file) => {
      objIds.push(file.id);
    });
    axios
      .post(`${backendOrigin}/re_order/`, objIds, {
        headers: { Authorization: `token ${Cookies.get("token")}` },
      })
      .then((response) => {
        if (response.status === 200) {
          appState.setStorageObjects(null);
          props.setReorderModalOpen(false);
        }
      });
  };

  useEffect(() => {
    if (appState.key !== null) {
      const folderId = props.folderId !== undefined ? `${props.folderId}/` : "";
      let decryptedFiles = [];
      axios
        .get(`${backendOrigin}/folder/${folderId}`, {
          headers: { Authorization: `token ${Cookies.get("token")}` },
        })
        .then((response) => {
          response.data.files.forEach((file) => {
            let decryptedFile = { ...file };
            decryptDataFromBytes(
              appState.key,
              window.atob(file.name_iv),
              window.atob(file.name)
            )
              .then((decryptedName) => {
                decryptedFile.name = decryptedName;
                decryptedFiles.push(decryptedFile);
              })
              .catch((error) => {});
          });
          props.setReorderDisabled(false);
        })
        .catch((error) => console.log(error));
      setFiles(decryptedFiles);
    }
  }, [appState.key]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{
        justifyContent: "center",
      }}
      scroll="body"
    >
      <CustomFormButton
        variant="contained"
        sx={{
          boxShadow: 0,
          width: "100%",
          height: "42px",
          borderRadius: 0,
          fontSize: "small",
        }}
        onClick={saveOrder}
        startIcon={<DoneIcon />}
      ></CustomFormButton>
      <DialogContent
        sx={{
          backgroundColor: theme.primary,
        }}
      >
        <ReactSortable
          multiDrag
          list={files}
          setList={setFiles}
          animation={150}
        >
          {files.map((file) => (
            <Box
              key={file.id}
              sx={{
                p: 1.5,
                my: 0.5,
                borderWidth: 1,
                borderRadius: 1,
                cursor: "move",
                backgroundColor: theme.primaryLightest,
              }}
            >
              <Grid container direction="row">
                <Grid item>
                  {file.is_file ? <ArticleIcon /> : <FolderIcon />}
                </Grid>
                <Grid item xs={10}>
                  <Typography sx={{ pl: 1 }}>{file.name}</Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </ReactSortable>
      </DialogContent>
    </Dialog>
  );
};

export default ReorderModal;
