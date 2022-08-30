import React, { useCallback, useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import { createEditor, Editor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import Cookies from "js-cookie";
import isHotkey from "is-hotkey";
import FormatBar from "./FormatBar";
import FileNameInput from "./FileNameInput";
import theme, { drawerWidth } from "./utils/theme";
import axios from "axios";

/*************
 *
 * Constants
 *
 ************/
const hotkeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

const altHotkeys = {
  "mod+s": "save",
  "mod+]": "increase",
  "mod+[": "decrease",
};

/*************
 *
 * Functions
 *
 ************/
function handleAltHotkey(editor, action, props) {
  if (action === "save") {
    console.log(editor);
    doSave(editor.children, props.filename, props.fileId);
  } else if (action === "increase") {
    toggleIncrease();
  } else if (action === "decrease") {
    toggleDecrease();
  }
}

function handleHotkeyEvent(event, editor, props) {
  for (const hotkey in hotkeys) {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      toggleMark(editor, hotkeys[hotkey]);
      toggleElement(editor, hotkeys[hotkey]);
    }
  }
  for (const hotkey in altHotkeys) {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      handleAltHotkey(editor, altHotkeys[hotkey], props);
    }
  }
}

function doSave(value, filename, fileId) {
  if (fileId !== null) {
    axios
      .patch(
        `http://localhost:8000/storage_objects/${fileId}/`,
        {
          name: filename,
        },
        {
          headers: {
            Authorization: `token ${Cookies.get("token")}`,
          },
        }
      )
      .then((response) => console.log("Patched name.", response.data))
      .catch((error) => console.log(error));
  }
  if (value !== null && value !== undefined) {
    axios
      .post("http://localhost:8000/", value)
      .then((response) => console.log(`Response: ${response.data}`))
      .catch((error) => console.log(error));
  }
}

// For toggling text types:
function toggleMark(editor, format) {
  if (!Editor.marks(editor) || !Editor.marks(editor)[format]) {
    Editor.addMark(editor, format, true);
  } else {
    Editor.removeMark(editor, format);
  }
  document.getElementById("sky-slate-editable").focus();
}

// For toggling element types:
function toggleElement(editor, elementType) {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === elementType,
  });
  Transforms.setNodes(
    editor,
    { type: match ? "paragraph" : elementType },
    { match: (n) => Editor.isBlock(editor, n) }
  );
  document.getElementById("sky-slate-editable").focus();
}

const SkySlateBox = (props) => {
  /*************
   *
   * Slate hooks and setup
   *
   ************/

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

  /*************
   *
   * Slate 'Leaf' component
   *
   ************/

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

    if (leaf.h1) {
      children = <span style={{ fontSize: "xxx-large" }}>{children}</span>;
    }

    if (leaf.h2) {
      children = <span style={{ fontSize: "xx-large" }}>{children}</span>;
    }

    if (leaf.h3) {
      children = <span style={{ fontSize: "x-large" }}>{children}</span>;
    }

    return <span {...attributes}>{children}</span>;
  };

  /*************
   *
   * Slate 'Element' component
   *
   ************/
  const Element = ({ attributes, children, element }) => {
    return <p {...attributes}>{children}</p>;
  };

  /*************
   *
   * Customization hooks and functions
   *
   ************/

  const toggleIncrease = () => {
    if (Editor.marks(editor) && Editor.marks(editor)["h3"]) {
      toggleMark(editor, "h3");
      toggleMark(editor, "h2");
    } else if (Editor.marks(editor) && Editor.marks(editor)["h2"]) {
      toggleMark(editor, "h2");
      toggleMark(editor, "h1");
    } else if (Editor.marks(editor) && Editor.marks(editor)["h1"]) {
      document.getElementById("sky-slate-editable").focus();
    } else {
      toggleMark(editor, "h3");
    }
  };

  const toggleDecrease = () => {
    if (Editor.marks(editor) && Editor.marks(editor)["h1"]) {
      toggleMark(editor, "h1");
      toggleMark(editor, "h2");
    } else if (Editor.marks(editor) && Editor.marks(editor)["h2"]) {
      toggleMark(editor, "h2");
      toggleMark(editor, "h3");
    } else if (Editor.marks(editor) && Editor.marks(editor)["h3"]) {
      toggleMark(editor, "h3");
    } else {
      document.getElementById("sky-slate-editable").focus();
    }
  };

  // Do once
  useEffect(() => {
    props.setEditor(editor);
  }, []);

  useEffect(() => {
    console.log("Naming...");
  }, [props.filename]);

  /*************
   *
   * Component return
   *
   ************/

  return (
    <Slate
      id="slateComponent"
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
      <Box
        id="boxInSlate"
        sx={{
          backgroundColor: theme.primaryLightest,
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <div style={{ width: "100%" }}>
          <Box sx={{ display: { sm: "block", md: "flex" } }}>
            <Box sx={{ width: { sm: "100%", md: "auto" } }}>
              <FormatBar
                toggleMark={toggleMark}
                toggleElement={toggleElement}
                doSave={doSave}
                editorValue={value}
                filename={props.filename}
                fileId={props.fileId}
                toggleFileDrawer={props.toggleFileDrawer}
                editor={editor}
                toggleIncrease={toggleIncrease}
                toggleDecrease={toggleDecrease}
              />
            </Box>
            <Box
              sx={{ width: { sm: "100%", md: "auto" }, flexGrow: { md: 1 } }}
            >
              <FileNameInput
                filename={props.filename}
                setFilename={props.setFilename}
              />
            </Box>
          </Box>
        </div>
        {/* The 'Editable' is the part we can edit like a text editor. */}
        <Box sx={{ px: 2 }} id="editableBox">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => handleHotkeyEvent(event, editor, props)}
            placeholder="Type here."
            id="sky-slate-editable"
            autoFocus
          />
        </Box>
      </Box>
    </Slate>
  );
};

export default SkySlateBox;
