import React, { useCallback, useState, useMemo } from "react";
import { createEditor, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import "./App.css";

/**
 * The default slate element, rendered as a normal paragraph.
 */
const DefaultElement = (props) => {
  /* Reminder: Attributes must be mixed into the component, and 
  children must render in the component's lowest leaf.*/
  return <p {...props.attributes}>{props.children}</p>;
};

/**
 * A monospace code element for slate.
 */
const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "Untitled" }],
    },
  ]);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            // Switch to "code" style on ctrl+`
            case "`":
              event.preventDefault(); // Prevent inserting "`"
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "code",
              });
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" },
                { match: (n) => Editor.isBlock(editor, n) }
              );
              break;

            // Switch to "bold" on ctrl+b
            case "b":
              event.preventDefault();
              Transforms.setNodes(
                editor,
                { bold: true },
                { match: (n) => Text.isText(n), split: true }
              );
              break;
          }
        }}
      />
    </Slate>
  );
};

export default App;
