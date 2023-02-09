import React from "react";
import { TouchableOpacity } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryBox } from "../../../components/boxes/PrimaryBox";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AddMoreButtonProps } from "./AddMoreButton.type";

export const AddMoreButton: React.FC<AddMoreButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={{ width: "100%", maxWidth: 468 }} onPress={onPress}>
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
    </PrimaryBox>
  </TouchableOpacity>
);
