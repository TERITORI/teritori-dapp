import React from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const VoteTimeText: React.FC<{
  label: string;
  subLabel: string;
}> = ({ label, subLabel }) => {
  return (
    <View>
      <BrandText
        style={[
          fontSemibold12,
          {
            color: neutral77,
          },
        ]}
      >
        {label}
      </BrandText>
      <BrandText
        style={[
          fontSemibold13,
          {
            marginTop: layout.spacing_x0_25,
            color: secondaryColor,
          },
        ]}
      >
        {subLabel}
      </BrandText>
    </View>
  );
};
