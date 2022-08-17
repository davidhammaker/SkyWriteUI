import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Cookies from "js-cookie";
import axios from "axios";
import SkySlateBox from "./components/SkySlateBox";
import NavBarAndDrawer from "./components/NavBarAndDrawer";
import Start from "./components/Start";
import AppLogin from "./components/Login";
import AppLogout from "./components/Logout";
import { drawerWidth } from "./components/utils/theme";
import { backendOrigin, inPath } from "./components/utils/navTools";

const App = () => {
  const [atLogin, setAtLogin] = useState(false);
  const [atCreateUser, setAtCreateUser] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [storageObjects, setStorageObjects] = useState([]);

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
              <Box sx={{ display: "flex" }}>
                <NavBarAndDrawer
                  username={username}
                  storageObjects={storageObjects}
                />
                <Box
                  sx={{
                    flexGrow: 1,
                    px: 3,
                    py: 11,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                  }}
                >
                  <Paper>
                    <Box sx={{ p: 2 }}>
                      <SkySlateBox />
                    </Box>
                  </Paper>
                </Box>
              </Box>
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
