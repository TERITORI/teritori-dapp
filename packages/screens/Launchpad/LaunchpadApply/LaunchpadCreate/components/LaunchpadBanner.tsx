import React from "react";
import { Image, View } from "react-native";

import LaunchpadBannerImage from "@/assets/banners/launchpad.jpg";
import LogoSimpleSvg from "@/assets/icons/logo-simple.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn } from "@/components/spacer";
import { fontSemibold28 } from "@/utils/style/fonts";

export const LaunchpadBanner: React.FC = () => {
  return (
    <View>
      <Image
        source={LaunchpadBannerImage}
        style={{
          width: "100%",
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
        <SVG source={LogoSimpleSvg} width={88} height={88} />
        <SpacerColumn size={1} />
        <BrandText style={fontSemibold28}>Apply to Launchpad</BrandText>
      </View>
    </View>
  );
};
