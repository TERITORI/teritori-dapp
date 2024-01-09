import React from "react";
import { TextStyle, View } from "react-native";

import { RWACarousel } from "./RWACarousel";
import { BrandText } from "../../../../../components/BrandText";
import { SecondaryButton } from "../../../../../components/buttons/SecondaryButton";
import { GradientText } from "../../../../../components/gradientText";
import { useIsMobile } from "../../../../../hooks/useIsMobile";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";

export const HomeProposals: React.FC = () => {
  const isLightTheme = useIsLightTheme();
  const theme = useTheme();
  const label = "REAL ESTATE PROPERTY";
  const isMobile = useIsMobile();

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 40 : 120,
      }}
    >
      <View style={{ marginHorizontal: isMobile ? 10 : 0 }}>
        <BrandText
          numberOfLines={1}
          style={{
            fontSize: isMobile ? 20 : 28,
            lineHeight: 45,
            letterSpacing: -1,
          }}
        >
          7519 Wykes St, Detroit, MI 48210
        </BrandText>
        {isLightTheme ? (
          <BrandText
            style={[
              HomeProposalsLabelCStyle,
              { color: theme.primaryButtonColor },
            ]}
          >
            {label}
          </BrandText>
        ) : (
          <GradientText
            style={HomeProposalsLabelCStyle}
            gradientType="blueExtended"
          >
            {label}
          </GradientText>
        )}
        <SecondaryButton
          color={theme.secondaryTextColor}
          backgroundColor={theme.primaryButtonColor}
          text="View Property"
          size="XL"
          style={{ marginTop: 35 }}
        />
      </View>
      <RWACarousel />
    </View>
  );
};

const HomeProposalsLabelCStyle: TextStyle = {
  fontSize: 12,
  letterSpacing: 1,
};
