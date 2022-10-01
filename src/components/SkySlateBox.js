import React, { useCallback, useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import { createEditor, Editor, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import Cookies from "js-cookie";
import isHotkey from "is-hotkey";
import axios from "axios";
import FormatBar from "./FormatBar";
import FileNameInput from "./FileNameInput";
import SettingsButtonGroup from "./SettingsButtonGroup";
import theme, { drawerWidth } from "./utils/theme";
import { backendOrigin } from "./utils/navTools";
import { encryptDataToBytes } from "./utils/encryption";
import { defaultEditorValue } from "../settings";

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
  ReactEditor.focus(editor);
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
  ReactEditor.focus(editor);
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

  // This hook handles the value inside the Slate element.
  const [value, setValue] = useState(defaultEditorValue);

  // We need a way to tell Slate how to render our different text
  // types. These will help us do that.
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

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
      appState.setSaving(true);
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
      ReactEditor.focus(editor);
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
      ReactEditor.focus(editor);
    }
  };

  /**
   * Set editor in state
   */
  useEffect(() => {
    appState.setEditor(editor);
  }, []);

  /**
   * Update editor after loading
   */
  useEffect(() => {
    // If the value is null, don't try to load that into the editor!
    if (appState.editorValue === null || editor.children.length === 0) {
      return;
    }
    // Delete everything, leaving only one node.
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    });
    // Remove the remaining node, giving us a clean editor.
    Transforms.removeNodes(editor, { at: [0] });
    // Insert the new editor value.
    Transforms.insertNodes(editor, appState.editorValue);
    // Switch focus to the editor.
    ReactEditor.focus(editor);
  }, [appState.editorValue]);

  /**
   * Save a file (PATCH existing or POST new)
   */
  useEffect(() => {
    if (!appState.saving) {
      return;
    }

    const content = JSON.stringify(appState.editor.children);
    const filename = appState.filename;

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
            if (appState.fileId !== null && appState.fileId !== undefined) {
              axios
                .patch(
                  `${backendOrigin}/storage_objects/${appState.fileId}/`,
                  requestBody,
                  {
                    headers: {
                      Authorization: `token ${Cookies.get("token")}`,
                    },
                  }
                )
                .then((response) => {
                  props.getUser();
                  appState.setFileId(response.data.id);
                })
                .catch((error) => console.log(error))
                .finally(() => {
                  appState.setSaving(false);
                });
            }

            // POST new data if this is a new file
            else if (
              appState.editor.children !== null &&
              appState.editor.children !== undefined
            ) {
              axios
                .post(`${backendOrigin}/storage_objects/`, requestBody, {
                  headers: {
                    Authorization: `token ${Cookies.get("token")}`,
                  },
                })
                .then((response) => {
                  props.getUser();
                  appState.setFileId(response.data.id);
                })
                .catch((error) => console.log(error))
                .finally(() => {
                  appState.setSaving(false);
                });
            }

            // There's a problem if we get here...
            else {
              console.log("ERROR!");
            }
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  }, [appState.saving]);

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
            onKeyDown={(event) => handleHotkeyEvent(event, editor, appState)}
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
