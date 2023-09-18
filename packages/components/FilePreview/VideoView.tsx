import { ResizeMode } from "expo-av";
import React from "react";
import { View } from "react-native";

import { DeleteButton } from "./DeleteButton";
import { MediaPlayerVideo } from "../../context/MediaPlayerProvider";
import { errorColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../utils/types/files";
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
        videoUrl={file.url}
        thumbnailUrl={file.thumbnailFileData?.url}
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
