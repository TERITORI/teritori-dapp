import { Video, ResizeMode } from "expo-av";
import React from "react";
import { View } from "react-native";

import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { LocalFileData, RemoteFileData } from "../../../utils/types/feed";
import { DeleteButton } from "./DeleteButton";

interface VideoPreviewProps {
  file: LocalFileData | RemoteFileData;
  onDelete: () => void;
  isEditable?: boolean;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  file,
  onDelete,
  isEditable = false,
}) => {
  return (
    <View
      style={{
        height: 400,
        position: "relative",
      }}
    >
      {isEditable && <DeleteButton onPress={onDelete} />}
      <Video
        style={{
          height: 400,
        }}
        source={{
          uri: ipfsURLToHTTPURL(file.url),
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
};
