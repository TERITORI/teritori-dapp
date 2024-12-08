import { ResizeMode, Video } from "expo-av";
import React from "react";
import { View } from "react-native";

import { DeleteButton } from "./DeleteButton";
import { web3ToWeb2URI } from "../../utils/ipfs";
import { errorColor } from "../../utils/style/colors";
import { fontRegular13 } from "../../utils/style/fonts";
import { SocialFeedVideoMetadata } from "../../utils/types/feed";
import { LocalFileData, RemoteFileData } from "../../utils/types/files";
import { BrandText } from "../BrandText";
import { MediaPlayerVideo } from "../mediaPlayer/MediaPlayerVideo";

interface Props {
  file: LocalFileData | RemoteFileData;
  onDelete?: (file: LocalFileData | RemoteFileData) => void;
  isEditable?: boolean;
  postId?: string;
  showSmallPreview?: boolean;
}

export const VideoView: React.FC<Props> = ({
  file,
  onDelete,
  postId,
  isEditable = false,
  showSmallPreview = false,
}) => {
  const videoMetadata: SocialFeedVideoMetadata = {
    title: "Video from Social Feed",
    description: "",
    videoFile: file,
  };

  if (!file?.url)
    return (
      <BrandText style={[fontRegular13, { color: errorColor }]}>
        Video not found
      </BrandText>
    );
  return (
    <View
      style={{
        position: "relative",
      }}
    >
      {isEditable && onDelete && (
        <DeleteButton onPress={() => onDelete(file)} />
      )}
      {isEditable ? (
        <Video
          useNativeControls
          source={{ uri: web3ToWeb2URI(videoMetadata.videoFile.url) }}
          resizeMode={ResizeMode.CONTAIN}
          style={{
            height: showSmallPreview ? 120 : 400,
          }}
        />
      ) : (
        <MediaPlayerVideo
          videoMetadata={videoMetadata}
          style={{
            height: showSmallPreview ? 120 : 400,
          }}
          resizeMode={ResizeMode.CONTAIN}
          postId={postId}
        />
      )}
    </View>
  );
};
