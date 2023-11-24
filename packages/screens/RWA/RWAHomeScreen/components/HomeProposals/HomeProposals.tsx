import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

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
    <View style={HomeProposalsContainerCStyle}>
      <View style={{ marginLeft: 160 }}>
        <BrandText
          numberOfLines={1}
          style={{ fontSize: 28, lineHeight: 45, letterSpacing: -1 }}
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
          squaresBackgroundColor={theme.squaresBackgroundColor}
          size="XL"
          style={{ marginTop: 35 }}
        />
      </View>
      <RWACarousel />
    </View>
  );
};

const HomeProposalsContainerCStyle: ViewStyle = {
  width: "100%",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 120,
  flex: 1,
  flexDirection: "row",
};

const HomeProposalsLabelCStyle: TextStyle = {
  fontSize: 12,
  letterSpacing: 1,
};
