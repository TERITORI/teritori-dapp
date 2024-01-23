import React from "react";
import { View } from "react-native";

import { RWACarousel } from "./RWACarousel";
import { BrandText } from "../../../../../components/BrandText";
import { SecondaryButton } from "../../../../../components/buttons/SecondaryButton";
import { GradientText } from "../../../../../components/gradientText";
import { useIsMobile } from "../../../../../hooks/useIsMobile";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../../../../utils/style/fonts";

export const HomeProposals: React.FC = () => {
  const isLightTheme = useIsLightTheme();
  const theme = useTheme();
  const label = "REAL ESTATE PROPERTY";
  const isMobile = useIsMobile();

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: isMobile ? "column-reverse" : "row",
        gap: isMobile ? 15 : 120,
      }}
    >
      <View style={{ marginHorizontal: isMobile ? 10 : 0 }}>
        <BrandText
          numberOfLines={1}
          style={isMobile ? fontSemibold20 : fontSemibold28}
        >
          7519 Wykes St, Detroit, MI 48210
        </BrandText>
        {isLightTheme ? (
          <BrandText
            style={[fontSemibold12, { color: theme.primaryButtonColor }]}
          >
            {label}
          </BrandText>
        ) : (
          <GradientText style={fontSemibold12} gradientType="blueExtended">
            {label}
          </GradientText>
        )}
        <SecondaryButton
          color={theme.secondaryTextColor}
          backgroundColor={theme.primaryButtonColor}
          text="View Property"
          size="XL"
          textStyle={fontSemibold14}
          style={{
            marginTop: isMobile ? 20 : 35,
            height: isMobile ? 46 : 56,
            width: isMobile ? "100%" : 135,
          }}
        />
      </View>
      <RWACarousel />
    </View>
  );
};
