import { Video, ResizeMode } from "expo-av";
import React from "react";
import { View } from "react-native";

import { LocalFileData } from "../../../utils/types/feed";
import { DeleteButton } from "./DeleteButton";

interface VideoPreviewProps {
  file: LocalFileData;
  onDelete: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  file,
  onDelete,
}) => {
  return (
    <View
      style={{
        height: 400,
        position: "relative",
      }}
    >
      <DeleteButton onPress={onDelete} />
      <Video
        style={{
          height: 400,
        }}
        source={{
          uri: file.url,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
};
