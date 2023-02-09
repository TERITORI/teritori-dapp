import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryBox } from "../../../components/boxes/PrimaryBox";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
  neutral22,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AddMoreButtonProps } from "./AddMoreButton.type";

export const AddMoreButton: React.FC<AddMoreButtonProps> = ({ onPress }) => {
  useHotkeys("meta+/", onPress, {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  return (
    <TouchableOpacity
      style={{ width: "100%", maxWidth: 412 }}
      onPress={onPress}
    >
      <PrimaryBox
        fullWidth
        height={48}
        colors={[
          gradientColorDarkerBlue,
          gradientColorBlue,
          gradientColorTurquoise,
        ]}
        mainContainerStyle={{
          paddingHorizontal: layout.padding_x2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandText style={[fontSemibold13]}>More tools</BrandText>
        <View
          style={{
            backgroundColor: neutral22,
            borderRadius: 4,
            paddingVertical: layout.padding_x0_25,
            paddingHorizontal: layout.padding_x0_75,
          }}
        >
          <BrandText style={[fontMedium14, {}]}>⌘ + /</BrandText>
        </View>
      </PrimaryBox>
    </TouchableOpacity>
  );
};
