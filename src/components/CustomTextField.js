import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import theme from "./utils/theme";

export const StyledTextField = styled(TextField)({
  color: theme.primaryDark,
  backgroundColor: theme.primaryLightest,
  borderRadius: "4px",
  borderColor: theme.primaryDark,
  "& label.Mui-focused": {
    color: theme.primaryDarkest,
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: theme.primaryDarkest,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.primaryDark,
    },
  },
});

export default function CustomTextField(props) {
  return (
    <Grid container direction="row">
      <Grid item md={12} sx={{ mb: props.error ? 2 : 4 }}>
        <StyledTextField
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
