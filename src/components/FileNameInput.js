import React from "react";
import theme from "./utils/theme";

const FileNameInput = (props) => {
  return (
    <input
      id="filename"
      value={props.filename}
      onChange={(event) => props.setFilename(event.target.value)}
      placeholder="Type a file name here."
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.secondaryLight,
        height: "20px",
        padding: "20px",
        backgroundColor: theme.primaryLightest,
        fontSize: "larger",
        marginRight: 0,
        display: "inline-flex",
        width: "100%",
      }}
    />
  );
};
export default FileNameInput;
