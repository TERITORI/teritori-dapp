import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import burnSVG from "../../../assets/icons/burn.svg";
import { neutral17 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const QuestCard: React.FC<{
  label: string;
  completed?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ label, completed = false, style }) => {
  return (
    <TertiaryBox
      // highlightable
      height={116}
      width={140}
      style={style}
      hasGradientBackground={completed}
      mainContainerStyle={{
        backgroundColor: neutral17,
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 12,
      }}
    >
      <SVG width={32} height={32} source={burnSVG} />
      <BrandText style={fontSemibold12}>{label}</BrandText>
    </TertiaryBox>
  );
};
