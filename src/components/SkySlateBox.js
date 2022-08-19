import React, { useCallback, useState, useMemo, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import Save from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import { createEditor, Editor, Transforms } from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import theme from "./utils/theme";
import axios from "axios";

const hotkeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

const altHotkeys = {
  "mod+s": "save",
};

function doSave(value) {
  axios
    .post("http://localhost:8000/", value)
    .then((response) => console.log(`Response: ${response.data}`))
    .catch((error) => console.log(error));
}

const Element = ({ attributes, children, element }) => {
  return <p {...attributes}>{children}</p>;
};

// For toggling text types:
function toggleMark(editor, format) {
  if (!Editor.marks(editor) || !Editor.marks(editor)[format]) {
    Editor.addMark(editor, format, true);
  } else {
    Editor.removeMark(editor, format);
  }
  document.getElementById("sky-slate-editable").focus();
}

function handleAltHotkey(editor, action) {
  if (action === "save") {
    console.log(editor);
    doSave(editor.children);
  }
}

const FormatButton = ({ format }) => {
  const editor = useSlate();
  const icon = {
    bold: <FormatBold />,
    italic: <FormatItalic />,
    underline: <FormatUnderlinedIcon />,
  }[format];
  return (
    <IconButton
      sx={{
        color: (Editor.marks(editor) || {})[format]
          ? theme.secondaryDark
          : theme.secondaryLight,
      }}
      onClick={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </IconButton>
  );
};

const SkySlateBox = (props) => {
  // We need an editor that doesn't change when we render.
  // ('withHistory' lets us undo with ctrl+z)
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);

  // We need a way to tell Slate how to render our different text
  // types. These will help us do that.
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // This hook handles the value inside the Slate element.
  const defaultChild = { text: "" };
  const defaultValue = [{ type: "paragraph", children: [defaultChild] }];
  const [value, setValue] = useState(defaultValue);

  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
  };

  // Hooks and functions for keeping heights/widths where I want them
  const [fileNameWidth, setFileNameWidth] = useState("200px");
  const resizeFileName = () => {
    setFileNameWidth(
      `${
        document.getElementById("editableBox").clientWidth -
        document.getElementById("editorButtons").clientWidth
      }px`
    );
  };

  const [editableBoxHeight, setEditableBoxHeight] = useState("100%");
  const resizeEditorBox = () => {
    setEditableBoxHeight(
      `${
        window.innerHeight -
        document.getElementById("editorButtons").clientHeight -
        32
      }px`
    );
  };

  const [blankDivHeight, setBlankDivHeight] = useState("100%");
  const resizeBlankDivHeight = () => {
    setBlankDivHeight(
      `${
        document.getElementById("editableBox").clientHeight -
        document.getElementById("sky-slate-editable").clientHeight
      }px`
    );
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      resizeFileName();
      resizeEditorBox();
      resizeBlankDivHeight();
    });
    resizeFileName();
    resizeEditorBox();
    resizeBlankDivHeight();
  });

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        if (
          window.innerHeight <
          document.getElementById("sky-slate-editable").clientHeight
        ) {
          setBlankDivHeight("0px");
          setEditableBoxHeight("inherit");
        }
      }}
    >
      <Box sx={{ backgroundColor: theme.primaryLightest, height: "100%" }}>
        <Grid
          container
          direction="row"
          justifyContent="left"
          alignItems="center"
        >
          <Grid item>
            <ButtonGroup
              id="editorButtons"
              variant="contained"
              sx={{
                boxShadow: 0,
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.secondaryLightest,
                  borderWidth: 1,
                  borderColor: theme.secondaryLight,
                  borderStyle: "solid",
                }}
              >
                <IconButton onClick={() => doSave(value)}>
                  <Save sx={{ color: theme.secondary }} />
                </IconButton>
                <FormatButton format="bold" />
                <FormatButton format="italic" />
                <FormatButton format="underline" />
              </Box>
            </ButtonGroup>
          </Grid>
          <Grid item>
            <input
              id="filename"
              defaultValue={props.filename}
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
                width: fileNameWidth,
              }}
            />
          </Grid>
        </Grid>
        {/* The 'Editable' is the part we can edit like a text editor. */}
        <Box sx={{ px: 2, height: editableBoxHeight }} id="editableBox">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              for (const hotkey in hotkeys) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  toggleMark(editor, hotkeys[hotkey]);
                }
              }
              for (const hotkey in altHotkeys) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  handleAltHotkey(editor, altHotkeys[hotkey]);
                }
              }
            }}
            placeholder="Type here."
            id="sky-slate-editable"
            autoFocus
          />
          <div
            style={{ height: blankDivHeight }}
            onClick={() => {
              ReactEditor.focus(editor);
              Transforms.select(editor, Editor.end(editor, []));
            }}
          />
        </Box>
      </Box>
    </Slate>
  );
};

export default SkySlateBox;
