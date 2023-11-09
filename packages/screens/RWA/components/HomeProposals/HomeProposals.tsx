import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { RWACarousel } from "./RWACarousel";
import { BrandText } from "../../../../components/BrandText";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { selectIsLightTheme } from "../../../../store/slices/settings";

export const HomeProposals: React.FC = () => {
  const isLightTheme = useSelector(selectIsLightTheme);

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, left: 170 }}>
        <BrandText style={{ fontSize: 28, lineHeight: 45, letterSpacing: -1 }}>
          7519 Wykes St, Detroit, MI 48210
        </BrandText>
        <BrandText style={{ fontSize: 12, color: "#3063D3", letterSpacing: 1 }}>
          REAL ESTATE PROPERTY
        </BrandText>
        <PrimaryButton
          color="#3063D3"
          text="View Property"
          squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
          size="XL"
          style={{ marginTop: 35 }}
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <RWACarousel />
      </View>
    </View>
  );
};
