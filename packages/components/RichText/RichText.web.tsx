import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from "@draft-js-plugins/buttons";
import Editor from "@draft-js-plugins/editor";
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar";
import createToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/static-toolbar";
import { convertToHTML } from "draft-convert";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import React from "react";

import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import { neutral33 } from "../../utils/style/colors";
import "./draft.css";
import { RichTextProps } from "./RichText.type";

const inlineToolbarPlugin = createInlineToolbarPlugin({
  theme: {
    toolbarStyles: {
      toolbar: "draftjs-inline-toolbar",
    },
    buttonStyles: {
      buttonWrapper: "draftjs-inline-toolbar-buttonWrapper",
    },
  },
});
const staticToolbarPlugin = createToolbarPlugin({
  theme: {
    toolbarStyles: {
      toolbar: "draftjs-static-toolbar",
    },
    buttonStyles: {
      buttonWrapper: "draftjs-static-toolbar-buttonWrapper",
    },
  },
});
const { Toolbar } = staticToolbarPlugin;
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin, staticToolbarPlugin];

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
  onBlur,
  initialValue,
  readOnly,
  staticToolbar,
}: RichTextProps) {
  const [editorState, setEditorState] = React.useState(
    initialValue ? createStateFromHTML(initialValue) : EditorState.createEmpty()
  );

  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();

    const html = convertToHTML(contentState);
    onChange(html === "<p></p>" ? "" : html);
  };
  return (
    <div
      style={{
        borderBottom: readOnly ? "" : `1px solid ${neutral33}`,
        minHeight: readOnly ? "auto" : 126,
        position: "relative",
        padding: "12px 0",
      }}
    >
      <Editor
        editorState={editorState}
        onChange={handleChange}
        plugins={plugins}
        placeholder={readOnly ? "" : "Type message here"}
        readOnly={readOnly}
        onBlur={onBlur}
      />
      {!readOnly && (
        <>
          {staticToolbar ? (
            <Toolbar>
              {(externalProps) => (
                <>
                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <CodeButton {...externalProps} />
                  <Separator />
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <BlockquoteButton {...externalProps} />
                  <CodeBlockButton {...externalProps} />
                </>
              )}
            </Toolbar>
          ) : (
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
        </>
      )}
    </div>
  );
}
