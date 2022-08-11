import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Linking,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import backPNG from "../../assets/icons/back.png";
import bookPNG from "../../assets/icons/book.png";
import discordPNG from "../../assets/icons/discord.png";
import mediumPNG from "../../assets/icons/medium.png";
import twitterPNG from "../../assets/icons/twitter.png";
import { footerHeight } from "../utils/style/layout";
import { RootStackParamList, useAppNavigation } from "../utils/navigation";
import { BrandText } from "./BrandText";

// One social network button
const NetworkButton: React.FC<{
  iconSource: ImageSourcePropType;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  onPress?: () => void;
}> = ({ iconSource, onPress, style, imageStyle }) => {
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
        },
        style,
      ]}
      onPress={onPress}
    >
      <Image
        source={iconSource}
        style={[
          { margin: "auto", width: 12, height: 12, resizeMode: "stretch" },
          imageStyle,
        ]}
      />
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
        iconSource={bookPNG}
        style={{ marginRight: 16 }}
        imageStyle={{ width: 15, height: 15 }}
        onPress={() => Linking.openURL("https://teritori.gitbook.io/")}
      />
      <NetworkButton
        iconSource={mediumPNG}
        style={{ marginRight: 16 }}
        onPress={() => Linking.openURL("https://medium.com/teritori/")}
      />
      <NetworkButton
        iconSource={twitterPNG}
        style={{ marginRight: 16 }}
        onPress={() => Linking.openURL("https://twitter.com/TeritoriNetwork")}
      />
      <NetworkButton
        iconSource={discordPNG}
        imageStyle={{ width: 15 }}
        onPress={() => Linking.openURL("https://discord.gg/teritori")}
      />
    </View>
  );
};

// A footer that can contains children
{
  /*TODO: Is it a good name for this cpt ?*/
}
export const Footer: React.FC<{
  style?: ViewStyle;
}> = ({ children, style }) => {
  return (
    <View
      style={[{
        height: footerHeight,
        maxHeight: footerHeight,
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }, style]}
    >
      <>{children}</>
    </View>
  );
};
