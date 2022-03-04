import React, { useCallback, useState, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ButtonGroup from "@mui/material/ButtonGroup";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import blue from "@mui/material/colors/blue";
import grey from "@mui/material/colors/grey";
import { createEditor, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: grey,
  },
});

const hotkeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

const Element = ({ attributes, children, element }) => {
  return <p {...attributes}>{children}</p>;
};

const TextBox = () => {
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

  // Button colors
  const [boldButtonColor, setBoldButtonColor] = useState("secondary");
  const [italicButtonColor, setItalicButtonColor] = useState("secondary");
  const [underlineButtonColor, setUnderlineButtonColor] = useState("secondary");
  const buttonColorSetters = {
    bold: setBoldButtonColor,
    italic: setItalicButtonColor,
    underline: setUnderlineButtonColor,
  };

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

  // For toggling text types:
  function toggleMark(editor, format) {
    if (!Editor.marks(editor) || !Editor.marks(editor)[format]) {
      Editor.addMark(editor, format, true);
      buttonColorSetters[format]("primary");
    } else {
      Editor.removeMark(editor, format);
      buttonColorSetters[format]("secondary");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <ButtonGroup variant="contained">
          <IconButton
            color={boldButtonColor}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark(editor, "bold");
            }}
          >
            <FormatBold />
          </IconButton>
          <IconButton
            color={italicButtonColor}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark(editor, "italic");
            }}
          >
            <FormatItalic />
          </IconButton>
          <IconButton
            color={underlineButtonColor}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark(editor, "underline");
            }}
          >
            <FormatUnderlinedIcon />
          </IconButton>
        </ButtonGroup>
        {/* The 'Editable' is the part we can edit like a text editor. */}
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
          }}
          placeholder="Type here."
          autoFocus
        />
      </Slate>
    </ThemeProvider>
  );
};

export default TextBox;
