import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import ChangePageSvg from "../../../../assets/icons/freelance-service/ChangePage.svg";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral17 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { SvgIcon } from "../common/SvgIcon";

export const FreelanceServicesCards: React.FC<{
  width: number;
  height: number;
  mainContainerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  iconSVG: string;
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
          <SvgIcon source={iconSVG} />
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
            <SVG source={ChangePageSvg} />
          </View>
        </View>
      </TouchableOpacity>
    </TertiaryBox>
  );
};
