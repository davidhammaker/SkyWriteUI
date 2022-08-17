import React from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";
import { navigateTo } from "./utils/navTools";

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
            <Typography variant="h4">Do you want to log out?</Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="center">
        <Grid item md={4}>
          <Grid container justifyContent="center">
            <Grid item>
              <Button onClick={doLogout}>
                <Typography variant="h5">Yes</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4}>
          <Grid container justifyContent="center">
            <Grid item>
              <Button onClick={() => navigateTo("/")}>
                <Typography variant="h5">No</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
