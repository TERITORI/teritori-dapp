import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import logoSVG from "../../assets/logos/logo.svg";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";

export const IntroLogoText: React.FC<{
  subTitle: string;
  style?: StyleProp<ViewStyle>;
}> = ({ subTitle, style }) => {
  const height = 273;
  const subTitleFontSize = 16;
  const logoWrapperSize = 200;

  return (
    <View
      style={[
        style,
        {
          flex: 1,
          alignItems: "center",
          maxHeight: height,
          minHeight: height,
          height,
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: logoWrapperSize,
          width: logoWrapperSize,
          marginBottom: 12,
        }}
      >
        <SVG width={200} height={200} source={logoSVG} />
      </View>

      <BrandText
        style={{
          fontSize: 28,
          lineHeight: 32,
          marginBottom: 8,
        }}
      >
        TERITORI
      </BrandText>

      <BrandText
        style={{
          fontWeight: "700",
          fontSize: subTitleFontSize,
          lineHeight: 21,
          textTransform: "uppercase",
        }}
      >
        {subTitle}
      </BrandText>
    </View>
  );
};
