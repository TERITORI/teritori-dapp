import { Dispatch, FC, SetStateAction } from "react";
import { View, ViewStyle } from "react-native";

import audioSVG from "@/assets/icons/audio.svg";
import cameraSVG from "@/assets/icons/camera.svg";
import videoSVG from "@/assets/icons/video.svg";
import { BrandText } from "@/components/BrandText";
import { IconBox } from "@/components/IconBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { FileUploader } from "@/components/inputs/fileUploader";
import { EmojiSelector } from "@/components/socialFeed/EmojiSelector";
import { GIFSelector } from "@/components/socialFeed/GIFSelector";
import { SpacerRow } from "@/components/spacer";
import { ContentMode } from "@/screens/FeedNewArticle/components/ArticleContentEditor/utils";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "@/utils/mime";
import { fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

interface Props {
  addEmoji: (emoji: string) => void;
  addGIF: (url: string) => void;
  addAudio: (file: LocalFileData) => void;
  addVideo: (file: LocalFileData) => void;
  addImage: (file: LocalFileData) => void;
  setMode: Dispatch<SetStateAction<ContentMode>>;
}

export const Toolbar: FC<Props> = ({
  addEmoji,
  addGIF,
  addAudio,
  addVideo,
  addImage,
  setMode,
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <CustomPressable onPress={() => setMode("EDITION")}>
        <BrandText style={fontSemibold12}>[]</BrandText>
      </CustomPressable>

      <SpacerRow size={1} />

      <CustomPressable onPress={() => setMode("BOTH")}>
        <BrandText style={fontSemibold12}>[]()</BrandText>
      </CustomPressable>

      <SpacerRow size={1} />

      <CustomPressable onPress={() => setMode("PREVIEW")}>
        <BrandText style={fontSemibold12}>()</BrandText>
      </CustomPressable>

      <SpacerRow size={1} />

      <EmojiSelector
        onEmojiSelected={(emoji) => addEmoji(emoji)}
        buttonStyle={toolbarCustomButtonCStyle}
        iconStyle={toolbarCustomButtonIconCStyle}
      />

      <GIFSelector
        onGIFSelected={(url) => (url ? addGIF(url) : undefined)}
        buttonStyle={toolbarCustomButtonCStyle}
        iconStyle={toolbarCustomButtonIconCStyle}
        // disabled={isGIFSelectorDisabled}
      />

      <FileUploader
        onUpload={(files) => addAudio(files?.[0])}
        mimeTypes={AUDIO_MIME_TYPES}
      >
        {({ onPress }) => (
          <IconBox
            icon={audioSVG}
            onPress={onPress}
            style={[toolbarCustomButtonIconCStyle, toolbarCustomButtonCStyle]}
            // disabled={isAudioUploadDisabled}
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
            style={[toolbarCustomButtonIconCStyle, toolbarCustomButtonCStyle]}
            // disabled={isVideoUploadDisabled}
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
            style={[toolbarCustomButtonIconCStyle, toolbarCustomButtonCStyle]}
          />
        )}
      </FileUploader>
    </View>
  );
};

const toolbarCustomButtonIconCStyle: ViewStyle = {
  borderRadius: 4,
  height: 30,
  width: 30,
};
const toolbarCustomButtonCStyle: ViewStyle = {
  margin: layout.spacing_x0_5,
};
