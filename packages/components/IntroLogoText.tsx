import React from "react";
import { StyleProp, ViewStyle, ImageBackground } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import logoSVG from "../../assets/logos/logo-white.svg";
import { fontSemibold28 } from "../utils/style/fonts";

export const IntroLogoText: React.FC<{
  title: string;
  backgroundImage: any;
  style?: StyleProp<ViewStyle>;
}> = ({ title, backgroundImage, style }) => {
  const height = 380;

  return (
    <ImageBackground
      source={backgroundImage}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          maxHeight: height,
          minHeight: height,
          height,
          width: "100%",
        },
        style,
      ]}
    >
      <SVG height={72} source={logoSVG} />
      <BrandText
        style={[fontSemibold28, { marginTop: 14, textAlign: "center" }]}
      >
        {title}
      </BrandText>
    </ImageBackground>
  );
};
