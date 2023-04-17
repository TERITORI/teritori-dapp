import { Video, ResizeMode } from "expo-av";
import React from "react";
import { View } from "react-native";

import { DeleteButton } from "./DeleteButton";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { errorColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../utils/types/feed";
import { BrandText } from "../BrandText";

interface VideoPreviewProps {
  file: LocalFileData | RemoteFileData;
  onDelete?: (file: LocalFileData | RemoteFileData) => void;
  isEditable?: boolean;
}

export const VideoView: React.FC<VideoPreviewProps> = ({
  file,
  onDelete,
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
      <Video
        style={{
          height: 400,
          marginTop: layout.padding_x2,
          marginBottom: layout.padding_x2,
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
