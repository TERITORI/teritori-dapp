import React from "react";
import { View } from "react-native";

import { neutral33 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { FileViewerProps } from "./FilePreview.type";

export const AudioPreview: React.FC<FileViewerProps> = () => {
  return (
    <View
      style={{
        backgroundColor: neutral33,
        paddingVertical: layout.padding_x0_25,
        paddingHorizontal: layout.padding_x1,
      }}
    >
      <BrandText style={fontSemibold12}>Audio file</BrandText>
    </View>
  );
};
