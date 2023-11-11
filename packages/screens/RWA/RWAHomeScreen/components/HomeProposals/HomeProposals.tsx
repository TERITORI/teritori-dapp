import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { RWACarousel } from "./RWACarousel";
import { BrandText } from "../../../../../components/BrandText";
import { PrimaryButton } from "../../../../../components/buttons/PrimaryButton";
import { selectIsLightTheme } from "../../../../../store/slices/settings";

export const HomeProposals: React.FC = () => {
  const isLightTheme = useSelector(selectIsLightTheme);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ flex: 1 }} />
      <View
        style={{
          flexDirection: "row",
          flex: 9,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginLeft: 50 }}>
          <BrandText
            numberOfLines={1}
            style={{ fontSize: 28, lineHeight: 45, letterSpacing: -1 }}
          >
            7519 Wykes St, Detroit, MI 48210
          </BrandText>
          <BrandText
            style={{ fontSize: 12, color: "#3063D3", letterSpacing: 1 }}
          >
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
        <View>
          <RWACarousel />
        </View>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};
