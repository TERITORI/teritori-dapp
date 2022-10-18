import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import balanceCardHighlightSVG from "../../../assets/cards/balance-card-highlight.svg";
import balanceCardSVG from "../../../assets/cards/balance-card.svg";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const LabelCard: React.FC<{
  highlighted?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ label, highlighted, style }) => {
  const width = 160;
  const height = 166;
  const fontSize = 12;
  return (
    <View style={style}>
      <SVG
        width={width}
        height={height}
        source={highlighted ? balanceCardHighlightSVG : balanceCardSVG}
        style={{ position: "absolute" }}
      />
      <View
        style={{
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
