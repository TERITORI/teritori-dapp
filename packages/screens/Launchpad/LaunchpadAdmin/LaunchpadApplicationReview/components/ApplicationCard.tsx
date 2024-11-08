import React from "react";
import { StyleProp, useWindowDimensions } from "react-native";

import { launchpadReviewBreakpointSM } from "../LaunchpadApplicationReviewScreen";

import { BrandText } from "@/components/BrandText";
import { BoxStyle } from "@/components/boxes/Box";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium14, fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const ApplicationCard: React.FC<{
  title: string;
  value: string;
  style?: StyleProp<BoxStyle>;
}> = ({ title, value, style }) => {
  const { width } = useWindowDimensions();

  return (
    <TertiaryBox
      style={[
        {
          borderRadius: 6,
          padding: layout.spacing_x1_5,
          minHeight: 64,
          // width: "100%"
        },
        width >= launchpadReviewBreakpointSM && { flex: 1 },
        style,
      ]}
    >
      <BrandText
        style={[
          fontSemibold12,
          { color: neutral77, marginBottom: layout.spacing_x0_75 },
        ]}
      >
        {title}
      </BrandText>
      <BrandText style={fontMedium14}>{value}</BrandText>
    </TertiaryBox>
  );
};
