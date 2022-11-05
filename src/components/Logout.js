import React from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import { navigateTo } from "./utils/navTools";
import CustomFormButton from "./CustomFormButton";
import theme, { skyButtonStyle } from "./utils/theme";

export default function AppLogout() {
  function doLogout() {
    Cookies.remove("token");
    Cookies.remove("username");
    navigateTo("/");
  }

  return (
    <Container maxWidth="sm">
      <Grid container direction="row" justifyContent="center">
        <Grid item>
          <Box my={5}>
            <Typography variant="h4" color={theme.primaryLightest}>
              Do you want to log out?
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="center">
        <Grid item md={4}>
          <Grid container justifyContent="center">
            <Grid item>
              <CustomFormButton
                variant="contained"
                onClick={doLogout}
                sx={skyButtonStyle}
              >
                <Typography variant="h5">Yes</Typography>
              </CustomFormButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4}>
          <Grid container justifyContent="center">
            <Grid item>
              <CustomFormButton
                variant="contained"
                onClick={() => navigateTo("/")}
                sx={skyButtonStyle}
              >
                <Typography variant="h5">No</Typography>
              </CustomFormButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
