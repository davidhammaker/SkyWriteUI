import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function TextBox() {
  return (
    <Box
      sx={{
        maxWidth: "100%",
      }}
      noValidate
      autoComplete="off"
    >
      <TextField fullWidth placeholder="Start writing!" multiline />
    </Box>
  );
}
