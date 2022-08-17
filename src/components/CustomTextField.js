import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

export default function CustomTextField(props) {
  useEffect(() => {
    console.log(props.error ? 2 : 4);
  });
  return (
    <Grid container direction="row">
      <Grid item md={12} sx={{ mb: props.error ? 2 : 4 }}>
        <TextField
          id={props.id}
          label={props.label}
          variant="outlined"
          type={props.type || "text"}
          required
          fullWidth
          error={props.error ? true : false}
          helperText={props.error ? props.error : ""}
        />
      </Grid>
    </Grid>
  );
}
