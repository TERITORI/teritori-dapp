import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "./inline-toolbar/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";

import "./draftjs.css";
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
import createImagePlugin from "@draft-js-plugins/image";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import { convertToHTML } from "draft-convert";
import {
  ContentBlock,
  ContentState,
  convertFromHTML,
  EditorState,
} from "draft-js";
import React, { useEffect, useRef, useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";

import audioSVG from "../../../../assets/icons/audio.svg";
import cameraSVG from "../../../../assets/icons/camera.svg";
import videoSVG from "../../../../assets/icons/video.svg";
import { useMention } from "../../../hooks/feed/useMention";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../../utils/mime";
import { useAppNavigation } from "../../../utils/navigation";
import { HANDLE_REGEX, HASH_REGEX, URL_REGEX } from "../../../utils/regex";
import { DEFAULT_USERNAME } from "../../../utils/social-feed";
import { neutralA3, primaryColor } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/feed";
import { IconBox } from "../../IconBox";
import { FileUploader } from "../../fileUploader";
import { EmojiSelector } from "../EmojiSelector";
import { GIFSelector } from "../GIFSelector";
import { ActionsContainer } from "./ActionsContainer";
import { PublishButton } from "./PublishButton";
import { RichOpenGraphCard } from "./RichOpenGraphCard";
import { RichTextProps } from "./RichText.type";
import { ToolbarContainer } from "./ToolbarContainer";
import createInlineToolbarPlugin from "./inline-toolbar";

const mentionStrategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
};

const urlStrategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  findWithRegex(URL_REGEX, contentBlock, callback);
};

const hashStrategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  findWithRegex(HASH_REGEX, contentBlock, callback);
};

const findWithRegex = (
  regex: RegExp,
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  const text = contentBlock.getText();

  [...text.matchAll(new RegExp(regex, "gi"))]
    .map((a) =>
      !a[0].toLowerCase().includes(DEFAULT_USERNAME.toLowerCase()) &&
      a.index !== undefined
        ? [a.index, a.index + a[0].length]
        : null
    )
    .forEach((v) => v && callback(v[0], v[1]));
};

const MentionRender = (props: { children: { props: { text: string } }[] }) => {
  const navigation = useAppNavigation();
  const { userId } = useMention(props.children[0].props.text);
  // Every text with a "@" is a mention. But we consider valid mentions as a valid wallet address or a valid NS token id.
  if (!userId) {
    return (
      <span style={{ color: neutralA3 }}>{props.children[0].props.text}</span>
    );
  }
  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() =>
        navigation.navigate("UserPublicProfile", {
          id: userId,
        })
      }
    >
      {props.children}
    </span>
  );
};

const UrlRender = (props: { children: { props: { text: string } }[] }) => {
  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() => {
        let linkText = props.children[0].props.text;
        if (linkText[0] === "@") {
          linkText = linkText.substring(1);
        }
        if (linkText.startsWith("www")) {
          linkText = `https://${linkText}`;
        }

        Linking.openURL(linkText);
      }}
    >
      {props.children}
    </span>
  );
};

const HashRender = (props: { children: { props: { text: string } }[] }) => {
  const navigation = useAppNavigation();

  return (
    <span
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() =>
        navigation.navigate("HashFeed", {
          id: props.children[0].props.text.replace("#", ""),
        })
      }
    >
      {props.children}
    </span>
  );
};

const LinkPlugin = createLinkPlugin();
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
const imagePlugin = createImagePlugin();

const { Toolbar } = staticToolbarPlugin;
const { InlineToolbar } = inlineToolbarPlugin;

const compositeDecorator = {
  decorators: [
    {
      strategy: mentionStrategy,
      component: MentionRender,
    },
    {
      strategy: urlStrategy,
      component: UrlRender,
    },
    {
      strategy: hashStrategy,
      component: HashRender,
    },
  ],
};
const plugins = [
  staticToolbarPlugin,
  LinkPlugin,
  compositeDecorator,
  inlineToolbarPlugin,
  imagePlugin,
];

const createStateFromHTML = (html: string) => {
  const blocksFromHTML = convertFromHTML(html);
  const content = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  return EditorState.createWithContent(content);
};

export const RichText: React.FC<RichTextProps> = ({
  onChange = () => {},
  onBlur,
  onImageUpload,
  onAudioUpload,
  onVideoUpload,
  onGIFSelected,
  onEmojiSelected,
  isGIFSelectorDisabled,
  isAudioUploadDisabled,
  isVideoUploadDisabled,
  initialValue,
  readOnly,
  openGraph,
  // allowTruncation,
  publishButtonProps,
}) => {
  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(
    initialValue ? createStateFromHTML(initialValue) : EditorState.createEmpty()
  );

  useEffect(() => {
    if (initialValue && !readOnly) {
      setTimeout(() => {
        editorRef.current?.focus();
      }, 100);

      setTimeout(() => {
        const endState = EditorState.moveSelectionToEnd(editorState);
        setEditorState(endState);
      }, 1000);
    }
    // else if (allowTruncation) {
    //   truncate();
    // }
  }, []);

  const addImage = (file: LocalFileData) => {
    if (!onImageUpload) return;
    const _state = imagePlugin.addImage(editorState, file.url, {});
    handleChange(_state);
    onImageUpload([file]);
    // onImageUpload?.(file);
  };

  const addEmoji = (emoji: string) => {
    // if(onEmojiSelected) {
    //   const contentState = editorState.getCurrentContent();
    //   onEmojiSelected(editorState.getSelection(), emoji)
    //   onChange(contentState);
    // }
  };

  const addAudio = (file: LocalFileData) => {
    if (!onAudioUpload) return;
    // TODO:
    // const _state = imagePlugin.addImage(editorState, file.url, {});
    // handleChange(_state);
    onAudioUpload([file]);
    // onImageUpload?.(file);
  };

  const addVideo = (file: LocalFileData) => {
    if (!onVideoUpload) return;
    // TODO:
    // const _state = imagePlugin.addImage(editorState, file.url, {});
    // handleChange(_state);
    onVideoUpload([file]);
    // onImageUpload?.(file);
  };

  // const truncate = () => {
  //   const contentState = editorState.getCurrentContent();
  //   const blocks = contentState.getBlocksAsArray();
  //
  //   let index = 0;
  //   let currentLength = 0;
  //   let isTruncated = false;
  //   const truncatedBlocks = [];
  //
  //   while (!isTruncated && blocks[index]) {
  //     const block = blocks[index];
  //     const length = block.getLength();
  //     if (currentLength + length > SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT) {
  //       isTruncated = true;
  //       const truncatedText = block
  //         .getText()
  //         .slice(0, SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT - currentLength);
  //
  //       const blocksFromHTML = convertFromHTML(
  //         `${truncatedText} <br/>...see more`
  //       );
  //       const state = ContentState.createFromBlockArray(
  //         blocksFromHTML.contentBlocks,
  //         blocksFromHTML.entityMap
  //       );
  //
  //       truncatedBlocks.push(state.getFirstBlock());
  //     } else {
  //       truncatedBlocks.push(block);
  //     }
  //     currentLength += length + 1;
  //     index++;
  //   }
  //
  //   if (isTruncated) {
  //     const state = ContentState.createFromBlockArray(truncatedBlocks);
  //     setEditorState(EditorState.createWithContent(state));
  //   }
  // };

  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();

    const hashtags = contentState.getPlainText().match(/#\S+/g);

    const html = convertToHTML({
      entityToHTML: (entity, originalText) => {
        if (entity.type === "IMAGE") {
          return <img src={entity.data.src} />;
        }
        return originalText;
      },
    })(contentState);

    onChange(html === "<p></p>" ? "" : html, hashtags || []);
  };

  return (
    <View
      style={{
        minHeight: readOnly ? "auto" : 126,
        position: "relative",

        zIndex: 99999,
        // padding: "12px 0",
        // paddingBottom: 12,
      }}
    >
      <ScrollView>
        <Editor
          editorState={editorState}
          onChange={handleChange}
          plugins={plugins}
          placeholder={readOnly ? "" : "Type message here"}
          readOnly={readOnly}
          onBlur={onBlur}
          ref={editorRef}
          decorators={compositeDecorator.decorators}
        />
        <InlineToolbar>
          {(externalProps) => (
            <>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <CodeButton {...externalProps} />
            </>
          )}
        </InlineToolbar>
      </ScrollView>

      {/*FIXME: Graph card doesn't appear*/}
      {openGraph && <RichOpenGraphCard {...openGraph} />}

      <ActionsContainer readOnly={readOnly}>
        <ToolbarContainer>
          <Toolbar>
            {(externalProps) => (
              <>
                <GIFSelector
                  onGIFSelected={onGIFSelected}
                  // disabled={isGIFSelectorDisabled}
                  disabled
                  optionsContainer={{ marginLeft: -186, marginTop: -6 }}
                  buttonStyle={styles.toolbarCustomButton}
                />

                <EmojiSelector
                  onEmojiSelected={(emoji) => addEmoji(emoji)}
                  optionsContainer={{ marginLeft: -80, marginTop: -6 }}
                  buttonStyle={styles.toolbarCustomButton}
                  disabled
                />

                <FileUploader
                  onUpload={(files) => addAudio(files?.[0])}
                  mimeTypes={AUDIO_MIME_TYPES}
                >
                  {({ onPress }) => (
                    <IconBox
                      icon={audioSVG}
                      onPress={onPress}
                      style={styles.toolbarCustomButton}
                      // disabled={isAudioUploadDisabled}
                      disabled
                    />
                  )}
                </FileUploader>

                <FileUploader
                  onUpload={(files) => addVideo(files?.[0])}
                  mimeTypes={VIDEO_MIME_TYPES}
                >
                  {({ onPress }) => (
                    <IconBox
                      icon={videoSVG}
                      onPress={onPress}
                      style={styles.toolbarCustomButton}
                      // disabled={isVideoUploadDisabled}
                      disabled
                    />
                  )}
                </FileUploader>

                <FileUploader
                  onUpload={(files) => addImage(files?.[0])}
                  mimeTypes={IMAGE_MIME_TYPES}
                >
                  {({ onPress }) => (
                    <IconBox
                      icon={cameraSVG}
                      onPress={onPress}
                      style={styles.toolbarCustomButton}
                      iconProps={{
                        width: 18,
                        height: 18,
                      }}
                    />
                  )}
                </FileUploader>

                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                <LinkPlugin.LinkButton {...externalProps} />
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <HeadlineThreeButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
              </>
            )}
          </Toolbar>
        </ToolbarContainer>
        {!!publishButtonProps && <PublishButton {...publishButtonProps} />}
      </ActionsContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbarCustomButton: {
    marginHorizontal: layout.padding_x0_75 / 2,
    borderRadius: 4,
    height: 30,
    width: 30,
  },
});
