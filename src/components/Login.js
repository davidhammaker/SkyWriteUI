import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import Cookies from "js-cookie";
import { backendOrigin, navigateTo } from "./utils/navTools";
import { getFieldValue, onEnterKey } from "./utils/elementTools";
import CustomTextField from "./CustomTextField";
import CustomFormButton from "./CustomFormButton";
import theme, { skyButtonStyle } from "./utils/theme";

export default function AppLogin(props) {
  const [usernameErrors, setUsernameErrors] = useState("");
  const [passwordErrors, setPasswordErrors] = useState("");
  const [otherErrors, setOtherErrors] = useState("");

  function doLogin() {
    setUsernameErrors("");
    setPasswordErrors("");
    setOtherErrors("");
    const username = getFieldValue("usernameField");
    const password = getFieldValue("passwordField");
    axios
      .post(`${backendOrigin}/api-token-auth/`, {
        username: username,
        password: password,
      })
      .then(function (response) {
        Cookies.set("token", response.data.token, { expires: 99999 });
        navigateTo("/");
      })
      .catch(function (error) {
        if (error.response) {
          for (const errorKey in error.response.data) {
            if (errorKey === "username") {
              setUsernameErrors(error.response.data.username.join(" "));
            } else if (errorKey === "password") {
              setPasswordErrors(error.response.data.password.join(" "));
            } else {
              setOtherErrors(error.response.data.non_field_errors.join(" "));
            }
          }
        } else {
          setOtherErrors("An error occurred while processing your request.");
        }
      });
  }

  useEffect(() => {
    if (Cookies.get("token")) {
      navigateTo("/");
    }
    props.setAtLogin(true);
    const enterKeyCleanup = onEnterKey(doLogin);
    function cleanup() {
      props.setAtLogin(false);
      enterKeyCleanup();
    }
    return cleanup;
  });

  return (
    <Container maxWidth="sm">
      {!Cookies.get("token") && (
        <>
          <Grid container direction="row" justifyContent="center">
            <Grid item>
              <Box my={5}>
                <Typography variant="h4" color={theme.primaryLightest}>
                  Log In
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="center">
            <Grid item md={8}>
              <form action="">
                <CustomTextField
                  id="usernameField"
                  label="Username"
                  error={usernameErrors}
                />
                <CustomTextField
                  id="passwordField"
                  label="Password"
                  error={passwordErrors}
                  type="password"
                />
                <Grid container direction="row" justifyContent="center">
                  <Box my={2}>
                    <CustomFormButton
                      variant="contained"
                      onClick={doLogin}
                      sx={skyButtonStyle}
                    >
                      Submit
                    </CustomFormButton>
                  </Box>
                </Grid>
                {otherErrors && (
                  <Grid container direction="row" justifyContent="center">
                    <Typography
                      variant="overline"
                      sx={{ color: otherErrors ? "#f00" : "inherit" }}
                    >
                      {otherErrors}
                    </Typography>
                  </Grid>
                )}
              </form>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
