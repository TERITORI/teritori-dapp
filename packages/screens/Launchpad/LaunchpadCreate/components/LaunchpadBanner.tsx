import React from "react";
import { Image, View } from "react-native";

import LaunchpadBannerImage from "@/assets/banners/launchpad.jpg";
import LogoSimpleSvg from "@/assets/icons/logo-simple.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn } from "@/components/spacer";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { fontSemibold16, fontSemibold28 } from "@/utils/style/fonts";

export const LaunchpadBanner: React.FC = () => {
  const { width } = useMaxResolution();
  const isSmallScreen = width < 500;
  const logoSize = isSmallScreen ? 44 : 88;
  const font = isSmallScreen ? fontSemibold16 : fontSemibold28;

  return (
    <View>
      <Image
        source={LaunchpadBannerImage}
        style={{
          width,
          height: width / 2.5,
        }}
      />
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SVG source={LogoSimpleSvg} width={logoSize} height={logoSize} />
        <SpacerColumn size={1} />
        <BrandText style={font}>Apply to Launchpad</BrandText>
      </View>
    </View>
  );
};
