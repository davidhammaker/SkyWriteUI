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
import {
  generateKey,
  encryptDataToBytes,
  decryptDataFromBytes,
  stringToArray,
} from "./components/utils/encryption";

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
  const [key, setKey] = useState(null);

  // This hook handles the value inside the Slate element.
  const defaultChild = { text: "" };
  const defaultValue = [{ type: "paragraph", children: [defaultChild] }];
  const [value, setValue] = useState(defaultValue);

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
    key,
    setKey,
    value,
    setValue,
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
    // TODO: I think I need to save this key; see "exportKey"
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
                  toggleFileDrawer={toggleFileDrawer}
                  appState={appState}
                  getUser={getUser}
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
