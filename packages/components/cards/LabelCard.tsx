import React from "react";
import { View, ViewStyle } from "react-native";

import balanceCardHighlightSVG from "../../../assets/cards/balance-card-highlight.svg";
import balanceCardSVG from "../../../assets/cards/balance-card.svg";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const LabelCard: React.FC<{
  highlighted?: boolean;
  label?: string;
  style?: ViewStyle;
}> = ({ label, highlighted, style }) => {
  const width = 164;
  const height = 166;
  const fontSize = 12;
  return (
    <View style={style}>
      <SVG
        width={width}
        height={height}
        source={highlighted ? balanceCardHighlightSVG : balanceCardSVG}
      />
      <View
        style={{
          position: "absolute",
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandText
          style={{
            color: "white",
            fontSize,
            lineHeight: 16,
            textAlign: "center",
            letterSpacing: -(fontSize * 0.04),
          }}
        >
          {label}
        </BrandText>
      </View>
    </View>
  );
};
