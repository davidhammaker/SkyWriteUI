import React, { useState, useEffect } from "react";
import theme, { xs, sm } from "./utils/theme";

const FileNameInput = (props) => {
  const [fileNameWidth, setFileNameWidth] = useState("200px");
  const resizeFileName = () => {
    const editableWidth = document.getElementById("editableBox").clientWidth;
    if (window.innerWidth >= sm) {
      setFileNameWidth(
        `${
          editableWidth - document.getElementById("editorButtons").clientWidth
        }px`
      );
    } else {
      setFileNameWidth(`${editableWidth}px`);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeFileName);
  }, []);

  useEffect(() => {
    resizeFileName();
  });

  return (
    <input
      id="filename"
      defaultValue={props.filename}
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
