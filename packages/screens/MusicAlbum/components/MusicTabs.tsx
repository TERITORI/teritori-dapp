import React from "react";
import { View, TouchableOpacity, ViewStyle, TextStyle } from "react-native";

import HomeSelected from "../../../../assets/music-player/home-selected.svg";
import HomeUnselected from "../../../../assets/music-player/home-unselected.svg";
import MusicSelected from "../../../../assets/music-player/music-selected.svg";
import MusicUnselected from "../../../../assets/music-player/music-unselected.svg";
import { BrandText } from "../../../components/BrandText/BrandText.electron";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

// TODO: Use Tabs + add optional SVG icon in Tabs

interface MusicPlayerTabProps {
  tab?: string;
  setTab?: any;
}

export const MusicTabs: React.FC<MusicPlayerTabProps> = ({ tab, setTab }) => {
  const tabData: string[] = ["Home", "My Library", "Search"];

  return (
    <View style={tabContainerStyle}>
      <TouchableOpacity
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
      </TouchableOpacity>
      <SpacerRow size={3} />
      <TouchableOpacity
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
      </TouchableOpacity>
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
  paddingRight: layout.spacing_x1_5 / 2,
};
const unselectedUnitBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",

  paddingVertical: layout.spacing_x2_5,
  borderBottomColor: secondaryColor,
  borderBottomWidth: 0,
  paddingRight: layout.spacing_x1_5 / 2,
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
