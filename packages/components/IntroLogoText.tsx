import React from "react";
import {
  StyleProp,
  ViewStyle,
  ImageBackground,
  useWindowDimensions,
} from "react-native";

import logoSVG from "../../assets/logos/logo-white.svg";
import { fontSemibold24, fontSemibold28 } from "../utils/style/fonts";
import { smallMobileWidth } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";

export const IntroLogoText: React.FC<{
  title: string;
  backgroundImage: any;
  style?: StyleProp<ViewStyle>;
}> = ({ title, backgroundImage, style }) => {
  const height = 380;
  const { width } = useWindowDimensions();

  return (
    <ImageBackground
      source={backgroundImage}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          maxHeight: height,
          height,
          width: "100%",
        },
        style,
      ]}
    >
      <SVG height={72} source={logoSVG} />
      <BrandText
        style={[
          width < smallMobileWidth ? fontSemibold24 : fontSemibold28,
          { marginTop: 14 },
        ]}
      >
        {title}
      </BrandText>
    </ImageBackground>
  );
};
