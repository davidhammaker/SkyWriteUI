import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import theme from "./utils/theme";

const Start = () => {
  return (
    <Box>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Typography
            variant="h1"
            noWrap
            component="div"
            sx={{
              color: "#fff",
              p: 4,
              fontSize: { xs: "2em", sm: "4em", md: "6em" },
            }}
          >
            Sky-Write
          </Typography>
        </Grid>
        <Grid item sx={{ p: 2 }}>
          <Typography variant="p" sx={{ color: "#fff" }}>
            A private journal, accessible anywhere.
          </Typography>
        </Grid>
        <Grid item sx={{ py: 2 }}>
          <Link href="/create-user" underline="none" sx={{ px: 1 }}>
            <Button variant="contained" sx={{ backgroundColor: theme.primary }}>
              <Typography sx={{ fontSize: "Larger" }}>Sign Up</Typography>
            </Button>
          </Link>
        </Grid>
        <Grid item sx={{ py: 2 }}>
          <Link href="/login" underline="none" sx={{ px: 1 }}>
            <Button variant="contained" sx={{ backgroundColor: theme.primary }}>
              <Typography sx={{ fontSize: "Larger" }}>Log In</Typography>
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Start;
