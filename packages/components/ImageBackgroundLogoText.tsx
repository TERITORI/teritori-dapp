import { FC } from "react";
import { ImageBackground, ImageSourcePropType, TextStyle } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { SpacerColumn } from "./spacer";

import logoSVG from "@/assets/logos/logo-white.svg";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { fontSemibold22, fontSemibold28 } from "@/utils/style/fonts";
import { RESPONSIVE_BREAKPOINT_S } from "@/utils/style/layout";

export const ImageBackgroundLogoText: FC<{
  text: string;
  backgroundImage: ImageSourcePropType;
}> = ({ text, backgroundImage }) => {
  const { width } = useMaxResolution();
  const isSmallScreen = width < RESPONSIVE_BREAKPOINT_S;
  const logoSize = isSmallScreen ? 70 : 88;
  const fontStyle: TextStyle = isSmallScreen ? fontSemibold22 : fontSemibold28;
  const height = 380;

  return (
    <ImageBackground
      source={backgroundImage}
      style={{
        alignItems: "center",
        justifyContent: "center",
        height,
        width: "100%",
      }}
    >
      <SVG source={logoSVG} width={logoSize} height={logoSize} />
      <SpacerColumn size={1} />
      <BrandText style={fontStyle}>{text}</BrandText>
    </ImageBackground>
  );
};
