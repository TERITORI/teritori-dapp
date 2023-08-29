import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import penSVG from "../../../../../assets/icons/pen.svg";
import {
  neutral17,
  neutral33,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";

export const CreateShortPostButton: React.FC<{
  label: string;
  onPress?: () => void;
}> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <SVG source={penSVG} width={24} height={24} color={secondaryColor} />
      <View style={textContainerStyle}>
        <BrandText style={fontSemibold14}>{label}</BrandText>
      </View>
    </TouchableOpacity>
  );
};

const containerStyle: ViewStyle = {
  alignSelf: "center",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: neutral17,
  borderWidth: 1,
  borderColor: neutral33,
  borderRadius: 999,
  paddingLeft: layout.padding_x1_5,
  paddingRight: layout.padding_x2,
  height: 42,
};
const textContainerStyle: ViewStyle = {
  marginLeft: layout.padding_x1,
};
