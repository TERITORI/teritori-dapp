import React from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { neutral00, neutral22 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const VoteDetailsText: React.FC<{
  title: string;
  percentage: number;
  color: string;
  minWidth?: number;
}> = ({ title, percentage, color, minWidth = 120 }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: layout.spacing_x1_5,
        backgroundColor: neutral22,
        borderColor: color,
        borderRadius: layout.spacing_x0_75,
        height: 48,
        minWidth,
        gap: layout.spacing_x1,
        justifyContent: "center",
      }}
    >
      <BrandText
        style={[
          fontSemibold14,
          {
            paddingLeft: layout.spacing_x0_5,
            color,
          },
        ]}
      >
        {title}
      </BrandText>
      <View
        style={{
          backgroundColor: color,
          width: 65,
          height: 24,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 32,
        }}
      >
        <BrandText
          style={[
            fontSemibold14,
            {
              paddingLeft: layout.spacing_x0_5,
              color: neutral00,
            },
          ]}
        >
          {`${percentage}%`}
        </BrandText>
      </View>
    </View>
  );
};
