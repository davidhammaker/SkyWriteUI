import React, { useCallback, useState, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { createEditor, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";

const Element = ({ attributes, children, element }) => {
  return <p {...attributes}>{children}</p>;
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italics) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
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

  // For toggling text types:
  function toggleBold(editor, format) {
    if (!Editor.marks(editor) || !Editor.marks(editor)[format]) {
      Editor.addMark(editor, format, true);
    } else {
      Editor.removeMark(editor, format);
    }
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <div>
        <IconButton
          color="primary"
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBold(editor, "bold");
          }}
        >
          <FormatBold />
        </IconButton>
        <IconButton
          color="primary"
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBold(editor, "italics");
          }}
        >
          <FormatItalic />
        </IconButton>
        <IconButton
          color="primary"
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBold(editor, "underline");
          }}
        >
          <FormatUnderlinedIcon />
        </IconButton>
      </div>
      {/* The 'Editable' is the part we can edit like a text editor. */}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Type here."
        autoFocus
      />
    </Slate>
  );
};

export default TextBox;
