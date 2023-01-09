import React from "react";
import { Image, View, TouchableOpacity } from "react-native";

import closeSVG from "../../../../assets/icons/close.svg";
import { redDefault } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { SVG } from "../../SVG";

interface ImagePreviewProps {
  url: string;
  onDelete: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  url,
  onDelete,
}) => {
  return (
    <View
      style={{
        marginRight: layout.padding_x0_5,
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
      <Image
        source={{ uri: url }}
        style={{
          height: 40,
          width: 40,

          borderRadius: 4,
        }}
      />
    </View>
  );
};
