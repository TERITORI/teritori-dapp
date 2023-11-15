import React from "react";
import { View } from "react-native";

import { RWACarousel } from "./RWACarousel";
import { BrandText } from "../../../../../components/BrandText";
import { SecondaryButton } from "../../../../../components/buttons/SecondaryButton";
import { GradientText } from "../../../../../components/gradientText";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";

export const HomeProposals: React.FC = () => {
  const isLightTheme = useIsLightTheme();
  const theme = useTheme();
  const label = "REAL ESTATE PROPERTY";

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
          {isLightTheme ? (
            <BrandText
              style={{
                fontSize: 12,
                color: theme.primaryButtonColor,
                letterSpacing: 1,
              }}
            >
              {label}
            </BrandText>
          ) : (
            <GradientText
              style={{ fontSize: 12, letterSpacing: 1 }}
              gradientType="blueExtended"
            >
              {label}
            </GradientText>
          )}
          <SecondaryButton
            color={theme.secondaryTextColor}
            backgroundColor={theme.primaryButtonColor}
            text="View Property"
            squaresBackgroundColor={theme.backgroundColor}
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
