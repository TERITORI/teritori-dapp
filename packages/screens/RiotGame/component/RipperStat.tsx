import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import {
  yellowDefault,
  neutral33,
  neutralA3,
} from "../../../utils/style/colors";
import {
  fontMedium48,
  fontMedium14,
  fontMedium32,
  fontMedium13,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type RipperStatProps = {
  name: string;
  value?: number;
  showProgress?: boolean;
  containerStyle?: ViewStyle;
  size?: "MD" | "LG";
};

export const RipperStat: React.FC<RipperStatProps> = ({
  name,
  value = 0,
  containerStyle,
  showProgress = true,
  size = "MD",
}) => {
  let valueFont;
  let subTextFont;

  switch (size) {
    case "LG":
      valueFont = fontMedium48;
      subTextFont = fontMedium14;
      break;
    case "MD":
    default:
      valueFont = fontMedium32;
      subTextFont = fontMedium13;
  }

  return (
    <View style={[containerStyle, containerStyle]}>
      <BrandText style={[valueFont, leftColStyle]}>{value}</BrandText>

      <View style={rightColStyle}>
        {showProgress && (
          <View style={progressBarOuterStyle}>
            <View style={[processBarInnerStyle, { width: `${value}%` }]} />
          </View>
        )}

        <BrandText style={[subTextFont, subTextStyle]}>{name}</BrandText>
      </View>
    </View>
  );
};

const leftColStyle: ViewStyle = {
  minWidth: 80,
};
const rightColStyle: ViewStyle = {
  marginLeft: layout.padding_x4,
};
const progressBarOuterStyle: ViewStyle = {
  borderRadius: 100,
  height: 8,
  backgroundColor: neutral33,
  width: 164,
};
const processBarInnerStyle: ViewStyle = {
  borderRadius: 100,
  height: 8,
  backgroundColor: yellowDefault,
  position: "absolute",
  top: 0,
  left: 0,
};
const subTextStyle: TextStyle = {
  color: neutralA3,
  marginTop: layout.padding_x1,
};
