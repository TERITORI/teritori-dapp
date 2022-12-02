import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
} from "@draft-js-plugins/buttons";
import Editor from "@draft-js-plugins/editor";
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar";
import { convertToHTML } from "draft-convert";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import React from "react";

import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import { neutral33 } from "../../utils/style/colors";
import "./draft.css";

const inlineToolbarPlugin = createInlineToolbarPlugin();

const customStyleMap = {};
const { InlineToolbar } = inlineToolbarPlugin;

const plugins = [inlineToolbarPlugin];

interface RichTextProps {
  onChange?: (text: string) => void;
  initialValue?: string;
  readOnly?: boolean;
}

const createStateFromHTML = (html: string) => {
  const blocksFromHTML = convertFromHTML(html);
  const content = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  return EditorState.createWithContent(content);
};

export function RichText({
  onChange = () => {},
  initialValue,
  readOnly,
}: RichTextProps) {
  const [editorState, setEditorState] = React.useState(
    initialValue ? createStateFromHTML(initialValue) : EditorState.createEmpty()
  );

  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    onChange(convertToHTML(contentState));
  };
  return (
    <div
      style={{
        borderBottom: `1px solid ${neutral33}`,
        minHeight: 126,
        position: "relative",
        padding: "12px 0",
      }}
    >
      <Editor
        customStyleMap={customStyleMap}
        editorState={editorState}
        onChange={handleChange}
        plugins={plugins}
        placeholder={readOnly ? "" : "Type message here"}
        readOnly={readOnly}
      />
      {!readOnly && (
        <InlineToolbar>
          {(externalProps) => {
            return (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
              </div>
            );
          }}
        </InlineToolbar>
      )}
    </div>
  );
}
