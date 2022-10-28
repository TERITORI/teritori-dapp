import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import footerAltGetupSVG from "../../../assets/footer-alt-getup.svg";
import logoSVG from "../../../assets/logos/logo.svg";
import { screenContentMaxWidthLarge } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { SocialNetworks } from "./Footer";

export const FooterAlt: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  return (
    <View
      style={[
        {
          maxWidth: screenContentMaxWidthLarge,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 50,
        }}
      >
        <SVG source={footerAltGetupSVG} />
        <SVG source={footerAltGetupSVG} />
        <SVG source={footerAltGetupSVG} />
      </View>
      <View style={{ marginBottom: 32 }}>
        {" "}
        <SVG source={logoSVG} width={88} height={88} />
      </View>
      <SocialNetworks />
    </View>
  );
};
