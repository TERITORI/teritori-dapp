import React from "react";
import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { neutral17 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const FreelanceServicesCards: React.FC<{
  width: number;
  height: number;
  mainContainerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  iconSVG: React.FC<SvgProps>;
  iconNearTextSVG: React.FC<SvgProps>;
  text: string;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  height,
  mainContainerStyle,
  boxStyle,
  iconSVG,
  text,
  iconNearTextSVG,
}) => {
  return (
    <TertiaryBox
      width={width}
      height={height}
      mainContainerStyle={[{ backgroundColor: neutral17 }, mainContainerStyle]}
      style={boxStyle}
    >
      <View style={{ height: height - 30, justifyContent: "space-between" }}>
        <SVG source={iconSVG} />
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            width: width - 30,
            alignItems: "center",
          }}
        >
          <BrandText style={fontSemibold14}>{text}</BrandText>
          <TouchableOpacity>
            <SVG source={iconNearTextSVG} />
          </TouchableOpacity>
        </View>
      </View>
    </TertiaryBox>
  );
};
