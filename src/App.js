import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import Cookies from "js-cookie";
import axios from "axios";
import SkySlateBox from "./components/SkySlateBox";
import Start from "./components/Start";
import AppCreateUser from "./components/CreateUser";
import AppLogin from "./components/Login";
import AppLogout from "./components/Logout";
import AppDrawer from "./components/AppDrawer";
import theme from "./components/utils/theme";
import { backendOrigin, inPath } from "./components/utils/navTools";
import {
  generateKey,
  decryptDataFromBytes,
  stringToArray,
} from "./components/utils/encryption";
import { defaultEditorValue, defaultFilename } from "./settings";

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
  const [editorValue, setEditorValue] = useState(null);
  const [editorVisibility, setEditorVisibility] = useState("visible");
  const [unsaved, setUnsaved] = useState(false);
  const [fileDrawerOpen, setFileDrawerOpen] = useState(false);
  const [filePath, setFilePath] = useState([]);
  const [filename, setFilename] = useState(defaultFilename);
  const [fileId, setFileId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadId, setLoadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastOpenedData, setLastOpenedData] = useState({
    id: null,
    ready: false,
    complete: false,
  });
  const [currentValue, setCurrentValue] = useState(null);
  const [key, setKey] = useState(null);
  const [needStorage, setNeedStorage] = useState(false);

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
    editorValue,
    setEditorValue,
    editorVisibility,
    setEditorVisibility,
    unsaved,
    setUnsaved,
    fileDrawerOpen,
    setFileDrawerOpen,
    filePath,
    setFilePath,
    filename,
    setFilename,
    fileId,
    setFileId,
    saving,
    setSaving,
    loadId,
    setLoadId,
    loading,
    setLoading,
    lastOpenedData,
    setLastOpenedData,
    currentValue,
    setCurrentValue,
    key,
    setKey,
    needStorage,
    setNeedStorage,
  };

  /*************
   *
   * Functions
   *
   ************/
  const toggleFileDrawer = () => {
    setFileDrawerOpen(!fileDrawerOpen);
  };

  const getOrCreateKey = (encodedKey) => {
    if (encodedKey !== null) {
      // Decode the key from the backend.
      window.crypto.subtle
        .importKey(
          "raw",
          stringToArray(window.atob(encodedKey)),
          "AES-GCM",
          true,
          ["encrypt", "decrypt"]
        )
        .then((importedKey) => {
          // Set the decoded key
          setKey(importedKey);
        })
        .catch((error) => {});
    } else {
      // Generate and store a new key.
      generateKey().then((newKey) => {
        // Set the key for use in this session.
        setKey(newKey);

        // Save the key in the backend.
        window.crypto.subtle.exportKey("raw", newKey).then((rawKey) => {
          // Create an encoded form of the key.
          const stringKey = window.btoa(
            String.fromCharCode.apply(null, new Uint8Array(rawKey))
          );

          // Post the encoded key.
          axios.post(
            `${backendOrigin}/encryption_key/`,
            { encryption_key: stringKey },
            {
              headers: { Authorization: `token ${Cookies.get("token")}` },
            }
          );
        });
      });
    }
  };

  const getUser = () => {
    axios
      .get(`${backendOrigin}/me/`, {
        headers: { Authorization: `token ${Cookies.get("token")}` },
      })
      .then(function (response) {
        setUsername(response.data.username);
        setStorageObjects(response.data.storage_objects);
        getOrCreateKey(response.data.encryption_key);
        if (response.data.last_file !== null) {
          setLastOpenedData({ ...lastOpenedData, id: response.data.last_file });
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      });
    axios
      .get(`${backendOrigin}/config/`, {
        headers: { Authorization: `token ${Cookies.get("token")}` },
      })
      .then(function (response) {
        const defaultStorage = response.data.default_storage;
        if (defaultStorage === "" || defaultStorage === null) {
          setNeedStorage(true);
        }
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
    generateKey().then((newKey) => setKey(newKey));
  }, []);

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
  }, [token]);

  useEffect(() => {
    if (filePath.length > 0) {
      setFileId(filePath[filePath.length - 1]);
    }
  }, [filePath]);

  useEffect(() => {
    if (appState.loadId !== null) {
      axios
        .get(`${backendOrigin}/storage_objects/${appState.loadId}/`, {
          headers: {
            Authorization: `token ${Cookies.get("token")}`,
          },
        })
        .then((response) => {
          if (response.data.content === null) {
            appState.setEditorValue(defaultEditorValue);
            appState.setLoadId(null);
          } else {
            decryptDataFromBytes(
              appState.key,
              window.atob(response.data.content_iv),
              window.atob(response.data.content)
            )
              .then((decryptedContent) => {
                const content = JSON.parse(decryptedContent);
                if (content.length === 0) {
                  appState.setEditorValue(defaultEditorValue);
                } else {
                  appState.setEditorValue(JSON.parse(decryptedContent));
                }
              })
              .catch((error) => {})
              .finally(() => {
                appState.setLoadId(null);
              });
          }
        });
    }
  }, [appState.loadId]);

  useEffect(() => {
    if (storageObjects === null) {
      getUser();
    }
  }, [storageObjects]);

  useEffect(() => {
    if (
      storageObjects !== null &&
      lastOpenedData.id !== null &&
      lastOpenedData.ready === false
    ) {
      setLastOpenedData({ ...lastOpenedData, ready: true });
    }
  }, [storageObjects, lastOpenedData]);

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
                  toggleFileDrawer={toggleFileDrawer}
                  appState={appState}
                  getUser={getUser}
                />
                <div
                  id="editor-background"
                  style={{
                    backgroundColor: theme.primaryLightest,
                    height: "100%",
                  }}
                  onClick={() => {
                    if (editor.children.length >= 1) {
                      Transforms.select(editor, Editor.end(editor, []));
                      ReactEditor.focus(editor);
                    }
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
                      getUser={getUser}
                    />
                  </div>
                </div>
              </>
            )) || <Start />
          }
        />
        <Route path="/create-user" element={<AppCreateUser />} />
        <Route path="/login" element={<AppLogin setAtLogin={setAtLogin} />} />
        <Route path="/logout" element={<AppLogout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
