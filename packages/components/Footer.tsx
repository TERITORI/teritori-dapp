import React from "react";
import {
  Linking,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import bookSVG from "../../assets/icons/book.svg";
import discordSVG from "../../assets/icons/discord.svg";
import mediumSVG from "../../assets/icons/medium.svg";
import twitterSVG from "../../assets/icons/twitter.svg";
import { footerHeight } from "../utils/style/layout";
import { SVG } from "./SVG";

// One social network button
const NetworkButton: React.FC<{
  iconSVG: React.FC<SvgProps>;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}> = ({ iconSVG, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[
        {
          height: 32,
          width: 32,
          borderColor: "#1B1E1F",
          borderRadius: 5,
          borderWidth: 1,
          borderStyle: "solid",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      onPress={onPress}
    >
      <SVG width={15} height={15} source={iconSVG} />
    </TouchableOpacity>
  );
};

// All social network buttons
export const SocialNetworks: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NetworkButton
        iconSVG={bookSVG}
        style={{ marginRight: 16 }}
        onPress={() => Linking.openURL("https://teritori.gitbook.io/")}
      />
      <NetworkButton
        iconSVG={mediumSVG}
        style={{ marginRight: 16 }}
        onPress={() => Linking.openURL("https://medium.com/teritori/")}
      />
      <NetworkButton
        iconSVG={twitterSVG}
        style={{ marginRight: 16 }}
        onPress={() => Linking.openURL("https://twitter.com/TeritoriNetwork")}
      />
      <NetworkButton
        iconSVG={discordSVG}
        onPress={() => Linking.openURL("https://discord.gg/teritori")}
      />
    </View>
  );
};

// A footer that can contains children
export const Footer: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  return (
    <View
      style={[
        {
          height: footerHeight,
          maxHeight: footerHeight,
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <>{children}</>
    </View>
  );
};
