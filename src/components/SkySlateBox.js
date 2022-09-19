import React, { useCallback, useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import { createEditor, Editor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import Cookies from "js-cookie";
import isHotkey from "is-hotkey";
import axios from "axios";
import FormatBar from "./FormatBar";
import FileNameInput from "./FileNameInput";
import SettingsButtonGroup from "./SettingsButtonGroup";
import theme, { drawerWidth } from "./utils/theme";
import { encryptDataToBytes } from "./utils/encryption";

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
  const appState = props.appState;

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
   * Editor functions
   *
   ************/

  function handleAltHotkey(editor, action, appState) {
    if (action === "save") {
      console.log(editor);
      doSave(editor.children, appState.filename, appState.fileId);
    } else if (action === "increase") {
      toggleIncrease();
    } else if (action === "decrease") {
      toggleDecrease();
    }
  }

  function handleHotkeyEvent(event, editor, appState) {
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
        handleAltHotkey(editor, altHotkeys[hotkey], appState);
      }
    }
  }

  function doSave(value, filename, fileId) {
    // TODO: fileId isn't getting through yet

    const content = JSON.stringify(value);

    // Encode content
    encryptDataToBytes(content, appState.key)
      .then((contentRet) => {
        const contentCiphertext = window.btoa(contentRet.ciphertext);
        const contentIv = window.btoa(contentRet.iv);

        // Encode filename
        encryptDataToBytes(filename, appState.key)
          .then((filenameRet) => {
            const filenameCiphertext = window.btoa(filenameRet.ciphertext);
            const filenameIv = window.btoa(filenameRet.iv);

            // Put everything in a request body object
            const requestBody = {
              name: filenameCiphertext,
              name_iv: filenameIv,
              content: contentCiphertext,
              content_iv: contentIv,
              is_file: true,
              // TODO: folder_id
            };

            // PATCH existing file
            if (fileId !== null && fileId !== undefined) {
              axios
                .patch(
                  `http://localhost:8000/storage_objects/${fileId}/`,
                  requestBody,
                  {
                    headers: {
                      Authorization: `token ${Cookies.get("token")}`,
                    },
                  }
                )
                .then((response) => console.log("Patched name.", response.data))
                .catch((error) => console.log(error));
            }

            // POST new data if this is a new file
            if (value !== null && value !== undefined) {
              axios
                .post("http://localhost:8000/storage_objects/", requestBody, {
                  headers: {
                    Authorization: `token ${Cookies.get("token")}`,
                  },
                })
                .then((response) => console.log(`Response: ${response.data}`))
                .catch((error) => console.log(error));
            }
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  }

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
    appState.setEditor(editor);
  }, []);

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
                toggleFileDrawer={props.toggleFileDrawer}
                editor={editor}
                toggleIncrease={toggleIncrease}
                toggleDecrease={toggleDecrease}
                appState={appState}
              />
            </Box>
            <Box
              sx={{ width: { sm: "100%", md: "auto" }, flexGrow: { md: 1 } }}
            >
              <FileNameInput appState={appState} />
            </Box>
            <Box
              sx={{
                width: { sm: "100%", md: "auto" },
                display: { xs: "none", md: "inherit" },
              }}
            >
              <SettingsButtonGroup />
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
