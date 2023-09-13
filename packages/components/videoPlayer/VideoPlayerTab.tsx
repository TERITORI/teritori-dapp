import React from "react";
import { View, Pressable, TextStyle, ViewStyle } from "react-native";

import HomeSelected from "../../../assets/icons/player/home-selected.svg";
import HomeUnselected from "../../../assets/icons/player/home-unselected.svg";
import MusicSelected from "../../../assets/icons/player/music-selected.svg";
import MusicUnselected from "../../../assets/icons/player/music-unselected.svg";
import { neutral33, neutralA3, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText/BrandText.electron";
import { SVG } from "../SVG";
import { SpacerRow } from "../spacer";

interface VideoPlayerTabProps {
  tab?: string;
  setTab?: any;
}

export const VideoPlayerTab: React.FC<VideoPlayerTabProps> = ({
  tab,
  setTab,
}) => {
  const tabData: string[] = ["Home", "My Library", "Search"];
  return (
    <View style={tabContainerStyle}>
      <Pressable
        style={
          tab === tabData[0] ? selectedUnitBoxStyle : unselectedUnitBoxStyle
        }
        onPress={() => setTab(tabData[0])}
      >
        <SVG
          source={tab === tabData[0] ? HomeSelected : HomeUnselected}
          width={layout.spacing_x3}
          height={layout.spacing_x3}
        />
        <SpacerRow size={1.5} />
        <BrandText
          style={tab === tabData[0] ? selectedTextStyle : unselectedTextStyle}
        >
          Home
        </BrandText>
      </Pressable>
      <SpacerRow size={3} />
      <Pressable
        style={
          tab === tabData[1] ? selectedUnitBoxStyle : unselectedUnitBoxStyle
        }
        onPress={() => setTab(tabData[1])}
      >
        <SVG
          source={tab === tabData[1] ? MusicSelected : MusicUnselected}
          width={layout.spacing_x3}
          height={layout.spacing_x3}
        />
        <SpacerRow size={1.5} />
        <BrandText
          style={tab === tabData[1] ? selectedTextStyle : unselectedTextStyle}
        >
          My Library
        </BrandText>
      </Pressable>
      <SpacerRow size={3} />
      <View style={divideLineStyle} />
    </View>
  );
};

const tabContainerStyle: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  position: "relative",
};
const selectedUnitBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: layout.spacing_x2_5,
  borderBottomColor: secondaryColor,
  borderBottomWidth: 2,
  paddingRight: 6,
};
const unselectedUnitBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: layout.spacing_x2_5,
  borderBottomColor: secondaryColor,
  borderBottomWidth: 0,
  paddingRight: 6,
};
const selectedTextStyle: TextStyle = { ...fontSemibold14 };
const unselectedTextStyle: TextStyle = {
  ...fontSemibold14,
  color: neutralA3,
};
const divideLineStyle: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  height: 1,
  backgroundColor: neutral33,
  width: "100%",
};
