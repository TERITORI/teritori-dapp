import { ResizeMode, Video } from "expo-av";
import React from "react";
import { View } from "react-native";

import { DeleteButton } from "./DeleteButton";
import { web3ToWeb2URI } from "../../utils/ipfs";
import { errorColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { SocialFeedVideoMetadata } from "../../utils/types/feed";
import { LocalFileData, RemoteFileData } from "../../utils/types/files";
import { BrandText } from "../BrandText";
import { MediaPlayerVideo } from "../mediaPlayer/MediaPlayerVideo";

interface VideoPreviewProps {
  file: LocalFileData | RemoteFileData;
  onDelete?: (file: LocalFileData | RemoteFileData) => void;
  isEditable?: boolean;
  postId?: string;
  authorId: string;
}

export const VideoView: React.FC<VideoPreviewProps> = ({
  file,
  onDelete,
  authorId,
  postId,
  isEditable = false,
}) => {
  const videoMetadata: SocialFeedVideoMetadata = {
    title: "Video from Social Feed",
    description: "",
    videoFile: file,
  };

  if (!file?.url)
    return (
      <BrandText style={[fontSemibold13, { color: errorColor }]}>
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
            height: 400,
          }}
        />
      ) : (
        <MediaPlayerVideo
          videoMetadata={videoMetadata}
          style={{
            height: 400,
          }}
          resizeMode={ResizeMode.CONTAIN}
          authorId={authorId}
          postId={postId}
        />
      )}
    </View>
  );
};
