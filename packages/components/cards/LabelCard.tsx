import React from "react";
import { View, Image, ViewStyle } from "react-native";

import balanceCardHighlightedPNG from "../../../assets/cards/balance-card-highlight.png";
import balanceCardPNG from "../../../assets/cards/balance-card.png";
import { BrandText } from "../BrandText";

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
      <Image
        source={highlighted ? balanceCardHighlightedPNG : balanceCardPNG}
        style={{ width, height, resizeMode: "contain" }}
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
