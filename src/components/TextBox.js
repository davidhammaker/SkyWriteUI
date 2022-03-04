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
import { Slate, Editable, withReact, useSlate } from "slate-react";
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

// For toggling text types:
function toggleMark(editor, format) {
  if (!Editor.marks(editor) || !Editor.marks(editor)[format]) {
    Editor.addMark(editor, format, true);
  } else {
    Editor.removeMark(editor, format);
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
      color={(Editor.marks(editor) || {})[format] ? "primary" : "secondary"}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </IconButton>
  );
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

  return (
    <ThemeProvider theme={theme}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <ButtonGroup variant="contained">
          <FormatButton format="bold" />
          <FormatButton format="italic" />
          <FormatButton format="underline" />
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
