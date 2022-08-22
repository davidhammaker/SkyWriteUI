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
  const [atLogin, setAtLogin] = useState(false);
  const [atCreateUser, setAtCreateUser] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [storageObjects, setStorageObjects] = useState([]);
  const [filename, setFilename] = useState("untitled");
  const [folderId, setFolderId] = useState(null);
  const [editor, setEditor] = useState(null);

  function getUser() {
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
  }

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
                <AppDrawer storageObjects={storageObjects} />
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
                      setEditor={setEditor}
                      filename={filename}
                      setFilename={setFilename}
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
