import { isEqual } from "lodash";
import React, { memo } from "react";
import { StyleProp } from "react-native";

import burnSVG from "../../../assets/icons/burn.svg";
import { neutral17, neutral33 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Box, BoxStyle } from "../boxes/Box";
import { SpacerColumn } from "../spacer";

export const QuestCard: React.FC<{
  label: string;
  completed?: boolean;
  style?: StyleProp<BoxStyle>;
  width?: number;
}> = memo(({ label, completed = false, style, width = 140 }) => {
  return (
    <Box
      fillGradient={
        completed ? { colors: ["#9C4CEA", "#336AFF", "#26C5FB"] } : undefined
      }
      style={[
        {
          width,
          backgroundColor: completed ? undefined : neutral17,
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderColor: neutral33,
          padding: 12,
          borderWidth: 1,
        },
        style,
      ]}
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
    </Box>
  );
}, isEqual);
