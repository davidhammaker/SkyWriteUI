import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import Cookies from "js-cookie";
import axios from "axios";
import SkySlateBox from "./components/SkySlateBox";
import Start from "./components/Start";
import AppLogin from "./components/Login";
import AppLogout from "./components/Logout";
import AppDrawer from "./components/AppDrawer";
import theme from "./components/utils/theme";
import { backendOrigin, inPath } from "./components/utils/navTools";

const App = () => {
  /*************
   *
   * State Hooks
   *
   ************/
  const [atLogin, setAtLogin] = useState(false);
  const [atCreateUser, setAtCreateUser] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [storageObjects, setStorageObjects] = useState([]);
  const [editor, setEditor] = useState(null);
  const [fileDrawerOpen, setFileDrawerOpen] = useState(false);
  const [filePath, setFilePath] = useState([]);
  const [filename, setFilename] = useState("untitled");
  const [fileId, setFileId] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);

  const appState = {
    atLogin,
    setAtLogin,
    atCreateUser,
    setAtCreateUser,
    token,
    setToken,
    username,
    setUsername,
    storageObjects,
    setStorageObjects,
    editor,
    setEditor,
    fileDrawerOpen,
    setFileDrawerOpen,
    filePath,
    setFilePath,
    filename,
    setFilename,
    fileId,
    setFileId,
    currentValue,
    setCurrentValue,
  };

  /*************
   *
   * Functions
   *
   ************/
  const toggleFileDrawer = () => {
    setFileDrawerOpen(!fileDrawerOpen);
  };

  const getUser = () => {
    axios
      .get(`${backendOrigin}/me/`, {
        headers: { Authorization: `token ${Cookies.get("token")}` },
      })
      .then(function (response) {
        setUsername(response.data.username);
        setStorageObjects(response.data.storage_objects);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      });
  };

  /*************
   *
   * Effects
   *
   ************/
  useEffect(() => {
    setAtLogin(false);
    setAtCreateUser(false);
    setToken(Cookies.get("token"));
    if (token) {
      getUser();
    }
    if (inPath("login")) {
      setAtLogin(true);
    }
    if (inPath("create-user")) {
      setAtCreateUser(true);
    }
    document.getElementById("root").style.backgroundColor = theme.primary;
  }, [token]);

  useEffect(() => {
    if (filePath.length > 0) {
      console.log(
        "Note: Not currently saving editor content when switching..."
      );
      setFileId(filePath[filePath.length - 1]);
    }
  }, [filePath]);

  /*************
   *
   * Return
   *
   ************/
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route
          exact
          path="/"
          element={
            (token && (
              <>
                <AppDrawer
                  // open={fileDrawerOpen}
                  toggleFileDrawer={toggleFileDrawer}
                  // storageObjects={storageObjects}
                  // filePath={filePath}
                  // setFilePath={setFilePath}
                  // setFilename={setFilename}
                  appState={appState}
                />
                <div
                  style={{
                    backgroundColor: theme.primaryLightest,
                    height: "100%",
                  }}
                  onClick={() => {
                    ReactEditor.focus(editor);
                    Transforms.select(editor, Editor.end(editor, []));
                  }}
                >
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <SkySlateBox
                      toggleFileDrawer={toggleFileDrawer}
                      appState={appState}
                    />
                  </div>
                </div>
              </>
            )) || <Start />
          }
        />
        <Route path="/login" element={<AppLogin setAtLogin={setAtLogin} />} />
        <Route path="/logout" element={<AppLogout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
