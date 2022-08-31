import React from "react";
import theme from "./utils/theme";

const FileNameInput = (props) => {
  const appState = props.appState;
  return (
    <input
      id="filename"
      value={appState.filename}
      onChange={(event) => appState.setFilename(event.target.value)}
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
