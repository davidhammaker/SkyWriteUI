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
import theme from "./utils/theme";

export default function AppLogin(props) {
  const [usernameErrors, setUsernameErrors] = useState("");
  const [emailErrors, setEmailErrors] = useState("");
  const [passwordErrors, setPasswordErrors] = useState("");
  const [passwordRetypeErrors, setPasswordRetypeErrors] = useState("");
  const [otherErrors, setOtherErrors] = useState("");

  function doCreateUser() {
    setUsernameErrors("");
    setEmailErrors("");
    setPasswordErrors("");
    setOtherErrors("");
    setPasswordRetypeErrors("");

    const username = getFieldValue("usernameField");
    const password = getFieldValue("passwordField");
    const email = getFieldValue("emailField");
    const passwordRetype = getFieldValue("passwordRetypeField");

    if (!passwordRetype) {
      setPasswordRetypeErrors("This field may not be blank.");
    }

    if (password !== passwordRetype) {
      const message = "Passwords must match.";
      setPasswordErrors(message);
      setPasswordRetypeErrors(message);
    } else {
      axios
        .post(`${backendOrigin}/create_user/`, {
          username: username,
          email: email,
          password: password,
        })
        .then(function (response) {
          axios
            .post(`${backendOrigin}/api-token-auth/`, {
              username: username,
              password: password,
            })
            .then(function (response) {
              Cookies.set("token", response.data.token, { expires: 99999 });
              navigateTo("/");
            });
        })
        .catch(function (error) {
          if (error.response) {
            for (const errorKey in error.response.data) {
              if (errorKey === "username") {
                setUsernameErrors(error.response.data.username.join(" "));
              } else if (errorKey === "password") {
                setPasswordErrors(error.response.data.password.join(" "));
              } else if (errorKey === "email") {
                setEmailErrors(error.response.data.email.join(" "));
              } else {
                setOtherErrors(error.response.data.non_field_errors.join(" "));
              }
            }
          } else {
            setOtherErrors("An error occurred while processing your request.");
          }
        });
    }
  }

  useEffect(() => {
    if (Cookies.get("token")) {
      navigateTo("/");
    }
    const enterKeyCleanup = onEnterKey(doCreateUser);
    function cleanup() {
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
                  Create a New User
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="center">
            <Grid item md={8}>
              <form action="">
                <CustomTextField
                  id="usernameField"
                  label="Create a Username"
                  error={usernameErrors}
                />
                <CustomTextField
                  id="emailField"
                  label="Email Address"
                  error={emailErrors}
                />
                <CustomTextField
                  id="passwordField"
                  label="Create a Password"
                  error={passwordErrors}
                  type="password"
                />
                <CustomTextField
                  id="passwordRetypeField"
                  label="Re-type your Password"
                  error={passwordRetypeErrors}
                  type="password"
                />
                <Grid container direction="row" justifyContent="center">
                  <Box my={2}>
                    <CustomFormButton
                      variant="contained"
                      onClick={doCreateUser}
                    >
                      Submit
                    </CustomFormButton>
                  </Box>
                </Grid>
                {otherErrors && (
                  <Grid container direction="row" justifyContent="center">
                    <Typography variant="overline">{otherErrors} </Typography>
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
