import theme from "./utils/theme";

const FileNameInput = (props) => {
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
        display: "inline-block",
        width: props.fileNameWidth,
      }}
    />
  );
};
export default FileNameInput;
