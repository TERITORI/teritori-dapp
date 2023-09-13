import React from "react";
import { View, ViewStyle, TextStyle } from "react-native";

import { HoverView } from "./HoverView";
import Link from "../../../assets/player/link.svg";
import { neutralA3, neutral33 } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerRow } from "../spacer";

interface DetailAlbumMenuProps {
  id: string;
}

const buttonHeight = 36;
export const DetailAlbumMenu: React.FC<DetailAlbumMenuProps> = ({ id }) => {
  const handleCopyLinkTrack = () => {
    window.navigator.clipboard.writeText(
      `${window.location.origin}/music-player/album/${id}`
    );
  };

  return (
    <View style={menuContainerStyle}>
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={() => handleCopyLinkTrack()}
      >
        <View style={oneLineStyle}>
          <SVG
            source={Link}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <SpacerRow size={1} />
          <BrandText style={text}>Copy link to the track</BrandText>
        </View>
      </HoverView>
    </View>
  );
};

const menuContainerStyle: ViewStyle = {
  borderRadius: layout.spacing_x1_5,
  position: "absolute",
  right: 0,
  bottom: buttonHeight + layout.spacing_x0_5,
  backgroundColor: "rgba(41, 41, 41, 1)",
  padding: layout.spacing_x1_5,
  zIndex: 999,
};
const unitBoxNormalStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: layout.spacing_x0_75,
  borderRadius: layout.spacing_x0_75,
};
const unitBoxHoveredStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: layout.spacing_x0_75,
  backgroundColor: neutral33,
  borderRadius: layout.spacing_x0_75,
};
const oneLineStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const text: TextStyle = {
  ...fontSemibold13,
  color: neutralA3,
};
