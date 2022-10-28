import React from "react";
import {
  Linking,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import getupSVG from "../../../assets/getup.svg";
import discordSVG from "../../../assets/icons/discord.svg";
import mediumSVG from "../../../assets/icons/medium.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import logoSVG from "../../../assets/logos/logo.svg";
import { secondaryColor } from "../../utils/style/colors";
import { screenContentMaxWidthLarge } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { LegalFooter } from "./LegalFooter";

export const FooterSocialNetworks: React.FC = () => {
  return (
    <TertiaryBox
      mainContainerStyle={{ padding: 8, flexDirection: "row" }}
      style={{ marginBottom: 50 }}
    >
      <TouchableOpacity
        style={{ marginRight: 9 }}
        onPress={() => Linking.openURL("https://medium.com/teritori/")}
      >
        <TertiaryBox
          mainContainerStyle={{
            borderColor: secondaryColor,
            borderRadius: 12,
            padding: 10,
          }}
        >
          <SVG source={mediumSVG} width={20} height={20} />
        </TertiaryBox>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginRight: 9 }}
        onPress={() => Linking.openURL("https://twitter.com/TeritoriNetwork")}
      >
        <TertiaryBox
          mainContainerStyle={{
            borderColor: secondaryColor,
            borderRadius: 12,
            padding: 10,
          }}
        >
          <SVG source={twitterSVG} width={20} height={20} />
        </TertiaryBox>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Linking.openURL("https://discord.gg/teritori")}
      >
        <TertiaryBox
          mainContainerStyle={{
            borderColor: secondaryColor,
            borderRadius: 12,
            padding: 10,
          }}
        >
          <SVG source={discordSVG} width={20} height={20} />
        </TertiaryBox>
      </TouchableOpacity>
    </TertiaryBox>
  );
};

export const FooterGetUp: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
        justifyContent: "space-between",
        marginBottom: 50,
      }}
    >
      <SVG source={getupSVG} />
      <SVG source={getupSVG} />
      <SVG source={getupSVG} />
    </View>
  );
};

export const FooterLogo: React.FC = () => {
  return (
    <View style={{ marginBottom: 32 }}>
      <SVG source={logoSVG} width={88} height={88} />
    </View>
  );
};

export const Footer: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style, children }) => {
  return (
    <View
      style={[
        {
          // maxWidth: screenContentMaxWidthLarge,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 200,
        },
        style,
      ]}
    >
      <FooterGetUp />

      <FooterLogo />

      <FooterSocialNetworks />

      <LegalFooter>{children}</LegalFooter>
    </View>
  );
};
