import React, { ReactNode } from "react";
import {
  Linking,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { LegalFooter } from "./LegalFooter";
import coingecko from "../../../assets/icons/coingecko_logo.svg";
import discordSVG from "../../../assets/icons/discord.svg";
import mediumSVG from "../../../assets/icons/medium.svg";
import XtwitterSVG from "../../../assets/icons/x-logo.svg";
import logoSVG from "../../../assets/logos/logo.svg";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";

const FooterSocialNetworks: React.FC = () => {
  return (
    <View style={{ padding: layout.spacing_x1, flexDirection: "row" }}>
      <TouchableOpacity
        style={{
          marginRight: layout.spacing_x1,
          marginBottom: layout.contentSpacing,
        }}
        onPress={() =>
          Linking.openURL("https://www.coingecko.com/en/coins/teritori")
        }
      >
        <LegacyTertiaryBox
          mainContainerStyle={{
            borderColor: secondaryColor,
            borderRadius: 12,
            padding: layout.spacing_x1_5,
          }}
        >
          <SVG source={coingecko} width={20} height={20} />
        </LegacyTertiaryBox>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginRight: layout.spacing_x1 }}
        onPress={() => Linking.openURL("https://twitter.com/TeritoriNetwork")}
      >
        <LegacyTertiaryBox
          mainContainerStyle={{
            borderColor: secondaryColor,
            borderRadius: 12,
            padding: layout.spacing_x1_5,
          }}
        >
          <SVG source={XtwitterSVG} width={20} height={20} />
        </LegacyTertiaryBox>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginRight: layout.spacing_x1 }}
        onPress={() => Linking.openURL("https://discord.gg/teritori")}
      >
        <LegacyTertiaryBox
          mainContainerStyle={{
            borderColor: secondaryColor,
            borderRadius: 12,
            padding: layout.spacing_x1_5,
          }}
        >
          <SVG source={discordSVG} width={20} height={20} />
        </LegacyTertiaryBox>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Linking.openURL("https://medium.com/teritori/")}
      >
        <LegacyTertiaryBox
          mainContainerStyle={{
            borderColor: secondaryColor,
            borderRadius: 12,
            padding: layout.spacing_x1_5,
          }}
        >
          <SVG source={mediumSVG} width={20} height={20} />
        </LegacyTertiaryBox>
      </TouchableOpacity>
    </View>
  );
};

const FooterLogo: React.FC = () => {
  return (
    <View style={{ marginBottom: layout.spacing_x4 }}>
      <SVG source={logoSVG} width={88} height={88} />
    </View>
  );
};

export const Footer: React.FC<{
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}> = ({ style, children }) => {
  return (
    <View
      style={[
        {
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 200,
        },
        style,
      ]}
    >
      <FooterLogo />

      <FooterSocialNetworks />

      <LegalFooter>{children}</LegalFooter>
    </View>
  );
};
