import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import backSVG from "../../../../assets/icons/back.svg";
import { neutral22 } from "../../../utils/style/colors";
import { SVG } from "../../SVG";

import { router } from "@/utils/router";

export const BackButton: React.FC<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPress, style }) => {
  const handleOnPress = () => {
    if (onPress) onPress();
    else if (router.canGoBack()) router.back();
  };

  return (
    <TouchableOpacity onPress={handleOnPress} style={style}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: 32,
          height: 32,
          backgroundColor: neutral22,
          borderRadius: 999,
        }}
      >
        <SVG width={24} height={24} source={backSVG} />
      </View>
    </TouchableOpacity>
  );
};
