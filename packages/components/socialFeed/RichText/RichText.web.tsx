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
import createVideoPlugin from "@draft-js-plugins/video";
import { convertToHTML } from "draft-convert";
import {
  ContentBlock,
  ContentState,
  convertFromHTML,
  EditorCommand,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
} from "draft-js";
import React, { KeyboardEvent, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import audioSVG from "../../../../assets/icons/audio.svg";
import cameraSVG from "../../../../assets/icons/camera.svg";
import videoSVG from "../../../../assets/icons/video.svg";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../../utils/mime";
import { MENTION_REGEX, HASHTAG_REGEX, URL_REGEX } from "../../../utils/regex";
import {
  DEFAULT_USERNAME,
  hashtagMatch,
  mentionMatch,
  removeFileFromArray,
  replaceFileInArray,
  urlMatch,
} from "../../../utils/social-feed";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/feed";
import { AudioPreview } from "../../FilePreview/AudioPreview";
import { EditableAudioPreview } from "../../FilePreview/EditableAudioPreview";
import { IconBox } from "../../IconBox";
import { FileUploader } from "../../fileUploader";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { GIFSelector } from "../GIFSelector";
import { PublishButton } from "./PublishButton";
import { RichHashtagRenderer } from "./RichRenderer/RichHashtagRenderer";
import { RichHashtagRendererConsultation } from "./RichRenderer/RichHashtagRendererConsultation";
import { RichMentionRenderer } from "./RichRenderer/RichMentionRenderer";
import { RichMentionRendererConsultation } from "./RichRenderer/RichMentionRendererConsultation";
import { RichURLRenderer } from "./RichRenderer/RichURLRenderer";
import { RichURLRendererConsultation } from "./RichRenderer/RichURLRendererConsultation";
import { RichTextProps } from "./RichText.type";
import { ActionsContainer } from "./Toolbar/ActionsContainer";
import { ToolbarContainer } from "./ToolbarContainer";
import createInlineToolbarPlugin from "./inline-toolbar";

const mentionStrategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  findWithRegex(MENTION_REGEX, contentBlock, callback);
};

const urlStrategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  findWithRegex(URL_REGEX, contentBlock, callback);
};

const hashtagStrategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
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
const videoPlugin = createVideoPlugin();

const { Toolbar } = staticToolbarPlugin;
const { InlineToolbar } = inlineToolbarPlugin;

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
  onAudioRemove,
  onAudioUpdate,
  isGIFSelectorDisabled,
  isAudioUploadDisabled,
  isVideoUploadDisabled,
  audioFiles,
  onVideoUpload,
  onGIFSelected,
  initialValue,
  isPostConsultation,
  publishButtonProps,
}) => {
  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(
    initialValue ? createStateFromHTML(initialValue) : EditorState.createEmpty()
  );
  // const { mutate: openGraphMutate, data: openGraphData } = useOpenGraph();
  const [uploadedAudios, setUploadedAudios] = useState<LocalFileData[]>([]);

  const compositeDecorator = {
    decorators: [
      {
        strategy: mentionStrategy,
        component: isPostConsultation
          ? RichMentionRendererConsultation
          : RichMentionRenderer,
      },
      {
        strategy: urlStrategy,
        component: isPostConsultation
          ? RichURLRendererConsultation
          : RichURLRenderer,
      },
      {
        strategy: hashtagStrategy,
        component: isPostConsultation
          ? RichHashtagRendererConsultation
          : RichHashtagRenderer,
      },
    ],
  };
  const plugins = [
    staticToolbarPlugin,
    LinkPlugin,
    compositeDecorator,
    inlineToolbarPlugin,
    imagePlugin,
    videoPlugin,
  ];

  //!!!!!!!!!!!!!!!!! TODO: Handle remove image, gif, audio
  const addImage = (file: LocalFileData) => {
    const state = imagePlugin.addImage(editorState, file.url, {});
    handleChange(state);
    onImageUpload?.(file);
  };

  const addVideo = (file: LocalFileData) => {
    const state = videoPlugin.addVideo(editorState, { src: file.url });
    handleChange(state);
    onVideoUpload?.(file);
  };

  const addGIF = (url: string) => {
    // GIFS are added as images on the editor, but added in gifs array on post creation (No need to add them in files, no need to store them)
    const state = imagePlugin.addImage(editorState, url, {});
    handleChange(state);
    onGIFSelected?.(url);
  };
  //!!!!!!!!!!!!!!!!

  const addEmoji = (emoji: string) => {
    const state = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      emoji
    );
    setEditorState(EditorState.createWithContent(state));
  };

  const addAudio = (file: LocalFileData) => {
    // Don't add if already added
    if (uploadedAudios.find((audio) => audio.fileName === file.fileName))
      return;
    onAudioUpload?.(file);
    setUploadedAudios((audios) => [...audios, file]);
  };
  const removeAudio = (file: LocalFileData) => {
    onAudioRemove?.(file);
    setUploadedAudios((audios) => removeFileFromArray(audios, file));
  };
  // Updating an audio (And the whole array) when changing its thumbnail image
  const addThumbnailToAddedAudio = (newAudioFile: LocalFileData) => {
    const newAudios = replaceFileInArray(uploadedAudios, newAudioFile);
    if (!newAudios) return;
    onAudioUpdate?.(newAudioFile);
    setUploadedAudios(newAudios);
  };

  //TODO: Works only with spans..... Make it works ?
  // const addEmbedded = (url: string) => {
  //   const contentState = editorState.getCurrentContent();
  //   const blocks = contentState.getBlocksAsArray();
  //   const currentBlock = getCurrentBlock(editorState)
  //
  //   // const iframeBlock = convertFromHTML("<iframe width=\"560\" height=\"315\" src={url}></iframe>");
  //   // const iframeBlock = convertFromHTML("<span>zfzfazaf</span>");
  //   const blockToInsert = convertFromHTML(`<div style="color: green; width: 200px; height: 200px">INSERTED BLOCK</div>`);
  //   const modifiedBlocks: ContentBlock[] = []
  //   blocks.forEach(contentBlock => {
  //     if(contentBlock.getKey() === currentBlock.getKey()) {
  //       modifiedBlocks.push(...blockToInsert.contentBlocks)
  //     }
  //     else {
  //       modifiedBlocks.push(contentBlock)
  //     }
  //   })
  //   const state = ContentState.createFromBlockArray(modifiedBlocks);
  //   setEditorState(EditorState.createWithContent(state));
  // };

  // Binding "Hit Enter key after writing a URL" to the Editor
  const keyBindingFn = (event: KeyboardEvent) => {
    const currentBlockText = getCurrentText(editorState);
    const urls = urlMatch(currentBlockText);
    if (event.key === "Enter" && urls?.length) {
      return "enterUrl";
    }
    return getDefaultKeyBinding(event);
  };

  const handleKeyCommand = (command: EditorCommand) => {
    const currentBlockText = getCurrentText(editorState);
    const urls = urlMatch(currentBlockText);
    if (command === "enterUrl" && urls?.length) {
      // addEmbedded(urls[0])
      // openGraphMutate({url:urls[0]})
      //TODO: Handle this case : The user write a valid URL, then press enter => We need to allow adding iframes and a web component as OpenGraph preview
      return "handled";
    }
    return "not-handled";
  };

  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();

    // Just sent these arrays to FeedNewArticleScreen for createPost
    const hashtags = hashtagMatch(contentState.getPlainText());
    const mentions = mentionMatch(contentState.getPlainText());

    const html = convertToHTML({
      entityToHTML: (entity, originalText) => {
        if (entity.type === "IMAGE") {
          return <img src={entity.data.src} />;
        }
        // TODO: Here, check entity.type === "LINK" and add URLRenderer with href ?
        return originalText;
      },
    })(contentState);

    onChange(html === "<p></p>" ? "" : html, hashtags || [], mentions || []);
  };

  // Cut the content at 2500 chars to show an Article preview on FeedScreen.
  //TODO: Set a max height to SocialThreadCard and don't crop the content to avoid having huge Article "previews"
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
  //     if (currentLength + length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT) {
  //       isTruncated = true;
  //       const truncatedText = block
  //         .getText()
  // {
  /*        .slice(0, SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT - currentLength);*/
  // }
  //
  //       const blocksFromHTML = convertFromHTML(
  //         `${truncatedText} <br/><br/><span style="color: ${neutralA3}">...see more</span>`
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

  const Buttons: React.FC<{ externalProps: any }> = ({ externalProps }) => (
    <View style={styles.toolbarButtonsWrapper}>
      <EmojiSelector
        onEmojiSelected={(emoji) => addEmoji(emoji)}
        optionsContainer={{ marginLeft: -80, marginTop: -6 }}
        buttonStyle={styles.toolbarCustomButton}
      />

      <GIFSelector
        onGIFSelected={(url) => (url ? addGIF(url) : undefined)}
        optionsContainer={{ marginLeft: -186, marginTop: -6 }}
        buttonStyle={styles.toolbarCustomButton}
        disabled={isGIFSelectorDisabled}
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
            disabled={isAudioUploadDisabled}
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
            disabled={isVideoUploadDisabled}
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

      {/*TODO: Allow to add embedded content by entering URL or iframe (Like on Medium*/}
      {/*<IconBox*/}
      {/*  icon={embedSVG}*/}
      {/*  onPress={() => addEmbedded("https://www.youtube.com/watch?v=jNQXAC9IVRw")}*/}
      {/*  style={styles.toolbarCustomButton}*/}
      {/*  iconProps={{*/}
      {/*    width: 18,*/}
      {/*    height: 18,*/}
      {/*  }}*/}
      {/*/>*/}

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
    </View>
  );

  /////////////// RETURN ////////////////
  return (
    <View
      style={{
        minHeight: isPostConsultation ? "auto" : 126,
        position: "relative",
        zIndex: 99999,
      }}
    >
      <ScrollView>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn}
          onChange={handleChange}
          plugins={plugins}
          placeholder={isPostConsultation ? "" : "Type message here"}
          readOnly={isPostConsultation}
          onBlur={onBlur}
          ref={editorRef}
          decorators={compositeDecorator.decorators}
        />
        <InlineToolbar>
          {(externalProps) => <Buttons externalProps={externalProps} />}
        </InlineToolbar>
      </ScrollView>

      {/* ==== Audio files */}
      {isPostConsultation &&
        audioFiles &&
        audioFiles.map((file, index) => (
          <View key={index}>
            <SpacerColumn size={2} />
            <AudioPreview file={file} />
          </View>
        ))}
      {!isPostConsultation &&
        uploadedAudios.map((file, index) => (
          <View key={index}>
            <SpacerColumn size={2} />
            <EditableAudioPreview
              file={file}
              onDelete={removeAudio}
              onUploadThumbnail={addThumbnailToAddedAudio}
            />
          </View>
        ))}

      <SpacerColumn size={2} />

      {!isPostConsultation && (
        <ActionsContainer>
          <ToolbarContainer>
            <Toolbar>
              {(externalProps) => <Buttons externalProps={externalProps} />}
            </Toolbar>
          </ToolbarContainer>
          {!!publishButtonProps && (
            <>
              <SpacerRow size={3} />
              <PublishButton {...publishButtonProps} />
            </>
          )}
        </ActionsContainer>
      )}
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
  toolbarButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
  },
});

const getCurrentBlock = (editorState: EditorState) => {
  const currentSelection = editorState.getSelection();
  const blockKey = currentSelection.getStartKey();
  return editorState.getCurrentContent().getBlockForKey(blockKey);
};

const getCurrentText = (editorState: EditorState) => {
  const currentBlock = getCurrentBlock(editorState);
  const blockText = currentBlock.getText();
  return blockText;
};
