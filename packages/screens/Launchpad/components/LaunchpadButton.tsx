import React from "react";
import { Linking, Pressable, TextStyle, View, ViewStyle } from "react-native";

import ChevronRightSvg from "../../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral22,
  neutral17,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export interface LaunchpadButtonProps {
  url?: string;
  buttonTitle: string;
  title: string;
  description: string;
}

export const LaunchpadButton: React.FC<LaunchpadButtonProps> = ({
  title,
  description,
  buttonTitle,
  url,
}) => {
  // returns
  return (
    <Pressable
      onPress={url ? () => Linking.openURL(url) : undefined}
      style={fillStyle}
    >
      <TertiaryBox
        style={fillStyle}
        fullWidth
        mainContainerStyle={containerStyle}
      >
        <View style={detailContainerStyle}>
          <BrandText>{title}</BrandText>
          <SpacerColumn size={3} />
          <BrandText style={descriptionTextStyle}>{description}</BrandText>
        </View>
        <View style={buttonIconTextContainerStyle}>
          <BrandText style={buttonTitleTextStyle}>{buttonTitle}</BrandText>
          <SpacerRow size={2.5} />
          <View style={iconContainerStyle}>
            <SVG source={ChevronRightSvg} />
          </View>
        </View>
      </TertiaryBox>
    </Pressable>
  );
};

const fillStyle: ViewStyle = {
  flex: 1,
};
const containerStyle: ViewStyle = {
  width: "100%",
  minHeight: 156,
  flexDirection: "row",
  padding: layout.padding_x2,
  alignItems: "flex-start",
  backgroundColor: neutral17,
};
const detailContainerStyle: ViewStyle = {
  flex: 1,
  alignItems: "flex-start",
  flexWrap: "wrap",
};
const buttonIconTextContainerStyle: ViewStyle = {
  flex: 1,
  alignSelf: "flex-end",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
};
const buttonTitleTextStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
};
const descriptionTextStyle: TextStyle = {
  ...fontSemibold12,
  color: neutral77,
  width: 200,
  flexWrap: "wrap",
};
const iconContainerStyle: ViewStyle = {
  width: layout.iconButton,
  height: layout.iconButton,
  borderRadius: layout.iconButton / 2,
  backgroundColor: neutral22,
  alignItems: "center",
  justifyContent: "center",
};
