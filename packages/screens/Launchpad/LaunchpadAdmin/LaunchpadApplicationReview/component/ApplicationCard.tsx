import React from "react";

import { BrandText } from "@/components/BrandText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { neutral77 } from "@/utils/style/colors";
import {fontMedium14, fontSemibold12} from "@/utils/style/fonts";
import {layout} from "@/utils/style/layout";
import {StyleProp, } from "react-native";
import {BoxStyle} from "@/components/boxes/Box";

export const ApplicationCard: React.FC<{
title: string; value: string; style?: StyleProp<BoxStyle>
}> = ({ title, value, style }) => {
  return (
    <TertiaryBox style={[{ borderRadius: 6,
      padding: layout.spacing_x1_5,
      justifyContent: "space-between",
      minHeight: 64,
      flex: 1,
    }, style]}>
      <BrandText style={[fontSemibold12, { color: neutral77, marginBottom: layout.spacing_x0_75 }]}>
        {title}
      </BrandText>
      <BrandText style={fontMedium14}>
        {value}
      </BrandText>
    </TertiaryBox>
  );
};
