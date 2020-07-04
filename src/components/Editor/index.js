import React from "react";
import s from "./Editor.module.css";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";
import "ace-builds";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/ext-language_tools";

const EditorComponent = props => {
  return (
    <AceEditor
      maxLines={1000}
      autoScrollEditorIntoView={true}
      mode="java"
      theme="monokai"
      className={s.editorWrapper}
      fontSize={14}
      showPrintMargin={true}
      onChange={props.onChange}
      showGutter={true}
      highlightActiveLine={true}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
};

export default EditorComponent;
