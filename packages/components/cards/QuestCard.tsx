import { isEqual } from "lodash";
import React, { memo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import burnSVG from "../../../assets/icons/burn.svg";
import { neutral17 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";
import { SpacerColumn } from "../spacer";

export const QuestCard: React.FC<{
  label: string;
  completed?: boolean;
  style?: StyleProp<ViewStyle>;
  width?: number;
}> = memo(({ label, completed = false, style, width = 140 }) => {
  return (
    <LegacyTertiaryBox
      width={width}
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
      <SpacerColumn size={1} />
      <BrandText
        style={[
          fontSemibold12,
          {
            height: (fontSemibold12.lineHeight || 0) * 3,
            verticalAlign: "bottom",
          },
        ]}
        numberOfLines={3}
      >
        {label}
      </BrandText>
    </LegacyTertiaryBox>
  );
}, isEqual);
