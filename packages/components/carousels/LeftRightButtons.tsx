import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronLeftSVG from "@/assets/icons/chevron-left.svg";
import chevronRightSVG from "@/assets/icons/chevron-right.svg";
import { SVG } from "@/components/SVG";

export const LeftRightButtons: FC<{
  onPressPrev?: () => void;
  onPressNext?: () => void;
}> = ({ onPressPrev, onPressNext }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity onPress={onPressPrev} style={{ marginRight: 24 }}>
        <SVG width={16} height={16} source={chevronLeftSVG} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressNext}>
        <SVG width={16} height={16} source={chevronRightSVG} />
      </TouchableOpacity>
    </View>
  );
};
