import { ResizeMode } from "expo-av";
import React from "react";
import { View } from "react-native";

import { DeleteButton } from "./DeleteButton";
import { MediaPlayerVideo } from "../../context/MediaPlayerProvider";
import { errorColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../utils/types/files";
import { VideoMetaInfo } from "../../utils/types/video";
import { BrandText } from "../BrandText";

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
  const videoMetaInfo: VideoMetaInfo = {
    title: "Video from Social Feed",
    description: "",
    url: file.url,
    image: file.thumbnailFileData?.url || "",
    duration: 0,
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
        height: 400,
        position: "relative",
      }}
    >
      {isEditable && onDelete && (
        <DeleteButton onPress={() => onDelete(file)} />
      )}
      <MediaPlayerVideo
        videoMetaInfo={videoMetaInfo}
        style={{
          height: 400,
          marginTop: layout.spacing_x2,
          marginBottom: layout.spacing_x2,
        }}
        resizeMode={ResizeMode.CONTAIN}
        authorId={authorId}
        postId={postId}
      />
    </View>
  );
};
