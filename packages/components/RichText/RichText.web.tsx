import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "./draft.css";
import createLinkPlugin from "@draft-js-plugins/anchor";
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
} from "@draft-js-plugins/buttons";
import Editor from "@draft-js-plugins/editor";
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar";
import createToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/static-toolbar";
import { convertToHTML } from "draft-convert";
import {
  ContentBlock,
  ContentState,
  convertFromHTML,
  EditorState,
} from "draft-js";
import React, { useEffect, useRef } from "react";
import { Pressable } from "react-native";

import { useAppNavigation } from "../../utils/navigation";
import { HANDLE_REGEX } from "../../utils/regex";
import { DEFAULT_USERNAME } from "../../utils/social-feed";
import { neutral33, primaryColor } from "../../utils/style/colors";
import { RichTextProps } from "./RichText.type";

const handleStrategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
};

const findWithRegex = (
  regex: RegExp,
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  const text = contentBlock.getText();

  [...text.matchAll(new RegExp(regex, "gi"))]
    .map((a) =>
      !a[0].toLowerCase().includes(DEFAULT_USERNAME.toLowerCase()) && a.index
        ? [a.index, a.index + a[0].length]
        : null
    )
    .forEach((v) => v && callback(v[0], v[1]));
};

const HandleSpan = (props: { children: { props: { text: string } }[] }) => {
  // const navigation = useAppNavigation();
  const navigation = useAppNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("PublicProfile", {
          id: props.children[0].props.text.replace("@", ""),
        })
      }
    >
      <span style={{ color: primaryColor }}>{props.children}</span>
    </Pressable>
  );
};

const LinkPlugin = createLinkPlugin();
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
const plugins = [inlineToolbarPlugin, staticToolbarPlugin, LinkPlugin];

const createStateFromHTML = (html: string) => {
  const blocksFromHTML = convertFromHTML(html);
  const content = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  return EditorState.createWithContent(content);
};

const compositeDecorator = [
  {
    strategy: handleStrategy,
    component: HandleSpan,
  },
];

export function RichText({
  onChange = () => {},
  onBlur,
  initialValue,
  readOnly,
  staticToolbar,
}: RichTextProps) {
  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = React.useState(
    initialValue ? createStateFromHTML(initialValue) : EditorState.createEmpty()
  );

  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();

    const html = convertToHTML(contentState);
    onChange(html === "<p></p>" ? "" : html);
  };

  useEffect(() => {
    if (initialValue && !readOnly) {
      editorRef.current?.focus();

      setTimeout(() => {
        const endState = EditorState.moveSelectionToEnd(editorState);
        setEditorState(
          EditorState.forceSelection(endState, endState.getSelection())
        );
      }, 300);
    }
  }, []);

  return (
    <div
      style={{
        borderBottom: readOnly ? "" : `1px solid ${neutral33}`,
        minHeight: readOnly ? "auto" : 126 + (staticToolbar ? 40 : 0),
        position: "relative",
        padding: "12px 0",
        paddingBottom: staticToolbar ? 40 : 12,
      }}
    >
      <Editor
        editorState={editorState}
        onChange={handleChange}
        plugins={plugins}
        placeholder={readOnly ? "" : "Type message here"}
        readOnly={readOnly}
        onBlur={onBlur}
        ref={editorRef}
        decorators={compositeDecorator}
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
                  <LinkPlugin.LinkButton {...externalProps} />

                  <Separator />
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <BlockquoteButton {...externalProps} />
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
