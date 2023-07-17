import React from "react";
import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { useAppNavigation } from "../../../utils/navigation";
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
  category: string;
  subCategory?: string;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  height,
  mainContainerStyle,
  boxStyle,
  iconSVG,
  text,
  iconNearTextSVG,
  category,
  subCategory,
}) => {
  const nav = useAppNavigation();

  return (
    <TertiaryBox
      width={width}
      height={height}
      mainContainerStyle={[{ backgroundColor: neutral17 }, mainContainerStyle]}
      style={boxStyle}
    >
      <TouchableOpacity
        onPress={() => {
          if (!subCategory) {
            nav.navigate("FreelanceServicesCategory", { category });
          } else {
            nav.navigate("FreelanceServicesSubCategory", {
              category,
              subcategory: subCategory,
            });
          }
        }}
        disabled={category === "ComingSoon"}
        style={{
          opacity: category === "ComingSoon" ? 0.5 : 1,
        }}
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

            <SVG source={iconNearTextSVG} />
          </View>
        </View>
      </TouchableOpacity>
    </TertiaryBox>
  );
};
