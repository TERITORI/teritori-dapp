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
  DraftEntityType,
  EditorCommand,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
  RawDraftEntity,
} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import React, {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { RichHashtagRenderer } from "./RichRenderer/RichHashtagRenderer";
import { RichHashtagRendererConsultation } from "./RichRenderer/RichHashtagRendererConsultation";
import { RichMentionRenderer } from "./RichRenderer/RichMentionRenderer";
import { RichMentionRendererConsultation } from "./RichRenderer/RichMentionRendererConsultation";
import { RichURLRenderer } from "./RichRenderer/RichURLRenderer";
import { RichURLRendererConsultation } from "./RichRenderer/RichURLRendererConsultation";
import {
  FoundEntity,
  PublishValues,
  RichTextProps,
  SelectedEntity,
} from "./RichText.type";
import { ActionsContainer } from "./Toolbar/ActionsContainer";
import { ToolbarContainer } from "./Toolbar/ToolbarContainer";
import createInlineToolbarPlugin from "./inline-toolbar";
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
  NB_ROWS_SHOWN_IN_PREVIEW,
  removeFileFromArray,
  replaceFileInArray,
  urlMatch,
} from "../../../utils/social-feed";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout, SOCIAL_FEED_BREAKPOINT_M } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { AudioView } from "../../FilePreview/AudioView";
import { EditableAudioPreview } from "../../FilePreview/EditableAudioPreview";
import { IconBox } from "../../IconBox";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { FileUploader } from "../../fileUploader";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { GIFSelector } from "../GIFSelector";

const VIDEOTYPE = "draft-js-video-plugin-video"; // See @draft-js-plugins/video/lib/video/constants
const MAX_IMAGES = 8;
const MAX_AUDIOS = 3;
const MAX_VIDEOS = 2;

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

export const RichText: React.FC<RichTextProps> = ({
  onChange = () => {},
  onBlur,
  audioFiles,
  initialValue,
  isPostConsultation,
  isPreview,
  onPublish,
  loading,
  publishDisabled,
  authorId,
  postId,
}) => {
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

  const { width: windowWidth } = useWindowDimensions();
  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(
    createStateFromHTML(initialValue)
  );
  // const { mutate: openGraphMutate, data: openGraphData } = useOpenGraph();
  const [uploadedAudios, setUploadedAudios] = useState<LocalFileData[]>([]);
  const [uploadedImages, setUploadedImages] = useState<LocalFileData[]>([]);
  const [uploadedGIFs, setUploadedGIFs] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<LocalFileData[]>([]);
  const [html, setHtml] = useState(initialValue);
  const isGIFSelectorDisabled = useMemo(
    () => uploadedGIFs.length + uploadedImages.length >= MAX_IMAGES,
    [uploadedGIFs.length, uploadedImages.length]
  );
  const isAudioUploadDisabled = useMemo(
    () => uploadedAudios.length >= MAX_AUDIOS,
    [uploadedAudios.length]
  );
  const isVideoUploadDisabled = useMemo(
    () => uploadedVideos.length >= MAX_VIDEOS,
    [uploadedVideos.length]
  );

  // Truncate using initialValue, only if isPreview
  const isTruncateNeeded = useMemo(() => {
    const contentState = createStateFromHTML(initialValue).getCurrentContent();
    return (
      isPreview &&
      contentState.getBlocksAsArray().length >= NB_ROWS_SHOWN_IN_PREVIEW
    );
  }, [initialValue, isPreview]);
  useEffect(() => {
    if (isTruncateNeeded) {
      const contentState =
        createStateFromHTML(initialValue).getCurrentContent();
      const truncatedBlocks = contentState
        .getBlocksAsArray()
        .slice(0, NB_ROWS_SHOWN_IN_PREVIEW);
      const truncatedState = ContentState.createFromBlockArray(truncatedBlocks);
      const truncatedHtml = createHTMLFromState(truncatedState);
      setEditorState(EditorState.createWithContent(truncatedState));
      setHtml(truncatedHtml);
    }
  }, [initialValue, isTruncateNeeded]);

  const addImage = (file: LocalFileData) => {
    const state = imagePlugin.addImage(editorState, file.url, {});
    handleChange(state);
    setUploadedImages((files) => [...files, file]);
  };
  const addVideo = (file: LocalFileData) => {
    const state = videoPlugin.addVideo(editorState, { src: file.url });
    handleChange(state);
    setUploadedVideos((files) => [...files, file]);
  };
  const addGIF = (url: string) => {
    const state = imagePlugin.addImage(editorState, url, {});
    handleChange(state);
    setUploadedGIFs((files) => [...files, url]);
  };

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
    setUploadedAudios((audios) => [...audios, file]);
  };
  const removeAudio = (file: LocalFileData) => {
    setUploadedAudios((audios) => removeFileFromArray(audios, file));
  };
  // Updating an audio (And the whole array) when changing its thumbnail image
  const addThumbnailToAddedAudio = (newAudioFile: LocalFileData) => {
    const newAudios = replaceFileInArray(uploadedAudios, newAudioFile);
    if (!newAudios) return;
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

  // Fired when writing in Editor
  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const _html = createHTMLFromState(contentState);
    setHtml(_html === "<p></p>" ? "" : _html);
    onChange(_html === "<p></p>" ? "" : _html);
  };

  // Fired when pressing "Publish"
  const handlePublish = () => {
    const contentState = editorState.getCurrentContent();
    const publishValues: PublishValues = {
      hashtags: hashtagMatch(contentState.getPlainText()) || [],
      mentions: mentionMatch(contentState.getPlainText()) || [],
      images: getFilesToPublish(editorState, uploadedImages, "IMAGE"),
      gifs: getGIFsToPublish(editorState, uploadedGIFs),
      videos: getFilesToPublish(editorState, uploadedVideos, VIDEOTYPE),
      audios: uploadedAudios,
      html,
    };
    onPublish?.(publishValues);
  };

  /////////////// TOOLBAR BUTTONS ////////////////
  const Buttons: React.FC<{ externalProps: any }> = ({ externalProps }) => (
    <View style={styles.toolbarButtonsWrapper}>
      <EmojiSelector
        onEmojiSelected={(emoji) => addEmoji(emoji)}
        buttonStyle={styles.toolbarCustomButton}
        iconStyle={styles.toolbarCustomButtonIcon}
      />

      <GIFSelector
        onGIFSelected={(url) => (url ? addGIF(url) : undefined)}
        buttonStyle={styles.toolbarCustomButton}
        iconStyle={styles.toolbarCustomButtonIcon}
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
            style={[styles.toolbarCustomButtonIcon, styles.toolbarCustomButton]}
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
            style={[styles.toolbarCustomButtonIcon, styles.toolbarCustomButton]}
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
            style={[styles.toolbarCustomButtonIcon, styles.toolbarCustomButton]}
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
      <ScrollView
        contentContainerStyle={isTruncateNeeded && { overflow: "hidden" }}
      >
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
        {isTruncateNeeded && (
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            {"\n...see more"}
          </BrandText>
        )}

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
            <AudioView file={file} postId={postId} authorId={authorId} />
            <SpacerColumn size={2} />
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
            <SpacerColumn size={2} />
          </View>
        ))}

      {!isPostConsultation && (
        <>
          <SpacerColumn size={3} />
          <ActionsContainer>
            <ToolbarContainer>
              <Toolbar>
                {(externalProps) => <Buttons externalProps={externalProps} />}
              </Toolbar>
            </ToolbarContainer>

            {windowWidth < SOCIAL_FEED_BREAKPOINT_M ? (
              <SpacerColumn size={1.5} />
            ) : (
              <SpacerRow size={3} />
            )}
            <PrimaryButton
              disabled={publishDisabled}
              loader
              isLoading={loading}
              text="Publish"
              size="M"
              onPress={handlePublish}
            />
          </ActionsContainer>
          <SpacerColumn size={2} />
        </>
      )}
    </View>
  );
};

/////////////// STYLES ////////////////
// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  toolbarCustomButton: {
    margin: layout.spacing_x0_5,
  },
  toolbarCustomButtonIcon: {
    borderRadius: 4,
    height: 30,
    width: 30,
  },
  toolbarButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
  },
});

/////////////// SOME FUNCTIONS ////////////////
const createStateFromHTML = (html: string) => {
  // We use htmlToDraft with a customChunkRenderer function because the default convertFromHTML from draft-js doesn't handle videos
  //TODO: Maybe we can use this pattern to handling audio in RichText (Instead of adding audios under the RichText)
  const blocksFromHTML = htmlToDraft(
    html,
    (nodeName: string, node: HTMLElement | any) => {
      if (nodeName === "video") {
        const entityConfig: any = {};
        entityConfig.src = node.getAttribute
          ? node.getAttribute("src") || node
          : node.src;
        entityConfig.alt = node.alt;
        entityConfig.height = node.style.height;
        entityConfig.width = node.style.width;
        if (node.style.float) {
          entityConfig.alignment = node.style.float;
        }
        const value: RawDraftEntity = {
          type: VIDEOTYPE, // should similar to videoPlugin.type if use @draft-js-plugins/video
          mutability: "IMMUTABLE",
          data: entityConfig,
        };
        return value;
      }
    }
  );
  const { contentBlocks, entityMap } = blocksFromHTML;
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  return EditorState.createWithContent(contentState);
};

const createHTMLFromState = (state: ContentState) =>
  convertToHTML({
    entityToHTML: (entity, originalText) => {
      if (entity.type === VIDEOTYPE || entity.type === "VIDEO") {
        return <video src={entity.data.src} controls />;
      }
      if (entity.type === "IMAGE") {
        return <img src={entity.data.src} />;
      }
      if (entity.type === "LINK") {
        return <a href={entity.data.url}>{originalText}</a>;
      }
      // TODO: Here, check entity.type === "LINK" and add URLRenderer with href ?
      return originalText;
    },
  })(state);

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

// Apply a regex in a block
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

// Get the current block
const getCurrentBlock = (editorState: EditorState) => {
  const currentSelection = editorState.getSelection();
  const blockKey = currentSelection.getStartKey();
  return editorState.getCurrentContent().getBlockForKey(blockKey);
};

// Get the text of the current block
const getCurrentText = (editorState: EditorState) => {
  const currentBlock = getCurrentBlock(editorState);
  const blockText = currentBlock.getText();
  return blockText;
};

// Get Draft entity by type
const getEntities = (
  editorState: EditorState,
  entityType?: DraftEntityType
) => {
  const contentState = editorState.getCurrentContent();
  const entities: FoundEntity[] = [];

  contentState.getBlocksAsArray().forEach((block) => {
    let selectedEntity: SelectedEntity;
    block.findEntityRanges(
      (character) => {
        if (character.getEntity() !== null) {
          const entity = contentState.getEntity(character.getEntity());
          if (!entityType || (entityType && entity.getType() === entityType)) {
            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: block.getKey(),
              entity: contentState.getEntity(character.getEntity()),
            };
            return true;
          }
        }
        return false;
      },
      (start, end) => {
        entities.push({ ...selectedEntity, start, end });
      }
    );
  });
  return entities;
};

// Remove the deleted uploaded files to keep only the ones added to RichText. They will be used for publishing.
// We need this since we can't detect when a file is deleted when handleChange
const getFilesToPublish = (
  editorState: EditorState,
  files: LocalFileData[],
  entityType?: DraftEntityType
) => {
  const entities = getEntities(editorState, entityType);
  const filesToPublish: LocalFileData[] = [];
  files.forEach((file) => {
    let found = false;
    entities.forEach((entity) => {
      if (entity.entity.getData().src === file.url) {
        found = true;
      }
    });
    if (found) {
      filesToPublish.push(file);
    }
  });
  return filesToPublish;
};
// Same as getFilesToPublish, but with gifs URLs
const getGIFsToPublish = (editorState: EditorState, gifsUrls: string[]) => {
  const entities = getEntities(editorState, "IMAGE");
  const gifsToPublish: string[] = [];
  gifsUrls.forEach((url) => {
    let found = false;
    entities.forEach((entity) => {
      if (entity.entity.getData().src === url) {
        found = true;
      }
    });
    if (found) {
      gifsToPublish.push(url);
    }
  });
  return gifsToPublish;
};
