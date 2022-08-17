import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import theme from "./utils/theme";

const NavBar = (props) => {
  return (
    <AppBar>
      <Toolbar sx={{ backgroundColor: theme.primary }}>
        <IconButton
          onClick={props.menuToggle} // toggleDrawer
          edge="start"
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon sx={{ color: "#fff" }} />
        </IconButton>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h6" noWrap component="div">
              Sky-Write
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item>
                <Typography
                  sx={{
                    pr: 1,
                    fontSize: "smaller",
                  }}
                >
                  {props.username}
                </Typography>
              </Grid>
              <Grid item>
                <Box spacing={2}>
                  <Link href="/logout" underline="none" sx={{ px: 1 }}>
                    <Button>
                      <Typography sx={{ color: theme.primaryLight }}>
                        Log Out
                      </Typography>
                    </Button>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
