import React from "react";
import { ViewStyle, TouchableOpacity } from "react-native";

import sliderSVG from "../../../assets/icons/slider.svg";
import {
  neutral11,
  neutral33,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

interface PostInputBoxProps {
  onPress: () => void;

  style?: ViewStyle;
}

export const PostInputBox: React.FC<PostInputBoxProps> = ({
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          height: 64,
          paddingVertical: 12,
          paddingHorizontal: 20,
          backgroundColor: neutral11,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: neutral33,
        },
        style,
      ]}
    >
      <BrandText
        style={[
          fontSemibold16,
          {
            color: neutral77,
          },
        ]}
      >
        Hey yo! Post something here!___
      </BrandText>
      <TertiaryBox
        squaresBackgroundColor={neutral11}
        mainContainerStyle={{
          height: 48,
          width: 124,
          backgroundColor: neutral11,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SVG
          source={sliderSVG}
          height={16}
          width={16}
          color={secondaryColor}
          style={{ marginRight: 8 }}
        />
        <BrandText style={[fontSemibold14]}>Publish</BrandText>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
