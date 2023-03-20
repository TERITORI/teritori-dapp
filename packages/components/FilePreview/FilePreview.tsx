import React from "react";
import { View, TouchableOpacity } from "react-native";

import closeSVG from "../../../assets/icons/close.svg";
import { AUDIO_MIME_TYPES, VIDEO_MIME_TYPES } from "../../utils/mime";
import { neutral22, neutralA3, redDefault } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

interface FileViewerProps {
  file: File;
  onDelete: () => void;
}

const getFileByType = (type: string) => {
  if (AUDIO_MIME_TYPES.includes(type)) {
    return "Audio File";
  } else if (VIDEO_MIME_TYPES.includes(type)) {
    return "Video File";
  } else {
    return "File";
  }
};

export const FilePreview: React.FC<FileViewerProps> = ({ file, onDelete }) => {
  return (
    <View
      style={{
        marginRight: layout.padding_x0_5,
        maxWidth: 100,
        height: 40,
        backgroundColor: neutral22,
        justifyContent: "center",
        paddingVertical: layout.padding_x0_5,
        paddingHorizontal: layout.padding_x2,
        borderRadius: 4,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onDelete}
        style={{
          backgroundColor: redDefault,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: -4,
          right: -4,
          zIndex: 9,
          height: 12,
          width: 12,
          borderRadius: 5,
        }}
      >
        <SVG source={closeSVG} height={10} width={10} />
      </TouchableOpacity>
      <BrandText
        numberOfLines={1}
        style={{
          fontSize: 12,
        }}
      >
        {file.name}
      </BrandText>
      <BrandText
        style={{
          fontSize: 10,
          color: neutralA3,
        }}
      >
        {getFileByType(file.type)}
      </BrandText>
    </View>
  );
};
