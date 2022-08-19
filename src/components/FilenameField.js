import React from "react";
import { styled } from "@mui/material/styles";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import theme from "./utils/theme";

const FilenameField = (props) => {
  return (
    <input
      placeholder="[title]"
      style={{
        backgroundColor: theme.primary,
        border: 0,
        fontSize: "2em",
        width: "100%",
        color: "#fff",
      }}
    />
  );
};

export default FilenameField;
