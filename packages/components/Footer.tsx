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
import { RootStackParamList, useAppNavigation } from "../utils/navigation";
import { footerHeight } from "../utils/style/layout";
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

// A clickable "<- Back To xxx" or "<- Back". Choose if navigate() or goBack(). You can handle more action with onPress() prop
export const BacKTo: React.FC<{
  label?: string;
  navItem?: keyof RootStackParamList;
  justBack?: boolean;
  onPress?: () => void;
  navParams?: object;
}> = ({ label, navItem, justBack, onPress, navParams }) => {
  const navigation = useAppNavigation();
  const labelFontSize = 16;

  const handlePress = () => {
    if (onPress) onPress();
    if (justBack) navigation.goBack();
    else if (navParams) navigation.navigate(navItem, navParams);
    else navigation.navigate(navItem);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={backPNG} style={{ width: 24, height: 24 }} />
        <BrandText
          style={{
            fontSize: labelFontSize,
            lineHeight: 16,
            letterSpacing: -(labelFontSize * 0.04),
            marginLeft: 8,
          }}
        >
          {label ? `Back to ${label}` : "Back"}
        </BrandText>
      </View>
    </TouchableOpacity>
  );
};

// A footer that can contains children
export const Footer: React.FC = ({ children }) => {
  return (
    <View
      style={{
        height: footerHeight,
        maxHeight: footerHeight,
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <>{children}</>
    </View>
  );
};
