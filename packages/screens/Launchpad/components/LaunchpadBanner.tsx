import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { Dimensions } from "react-native";

import LaunchpadBannerImage from "../../../../assets/banners/launchpad.png";
import LogoSimpleSvg from "../../../../assets/icons/logo-simple.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { useImageResizer } from "../../../hooks/useImageResizer";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { mobileWidth, smallMobileWidth } from "../../../utils/style/layout";

export const LaunchpadBanner: React.FC = () => {
  // variables
  const { width: maxWidth } = useMaxResolution();
  const { height, width } = useImageResizer({
    image: LaunchpadBannerImage,
    maxSize: { width: maxWidth },
  });

  const windowWidth = Dimensions.get("window").width;

  // returns
  return (
    <View style={styles.container}>
      <Image
        source={LaunchpadBannerImage}
        style={{
          width: width,
          height: windowWidth < smallMobileWidth ? 200 : height,
          resizeMode: "stretch",
        }}
      />
      <View style={styles.detailContainer}>
        <SVG source={LogoSimpleSvg} width={88} height={88} />
        <SpacerColumn size={1} />
        <BrandText
          style={windowWidth < mobileWidth ? fontSemibold20 : fontSemibold28}
        >
          Launchpad Submission Form
        </BrandText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  detailContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
