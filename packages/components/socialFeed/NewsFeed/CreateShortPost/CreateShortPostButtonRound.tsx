import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import penSVG from "../../../../../assets/icons/pen.svg";
import {
  neutral17,
  neutral33,
  secondaryColor,
} from "../../../../utils/style/colors";
import { SVG } from "../../../SVG";

export const CreateShortPostButtonRound: React.FC<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: 68,
          height: 68,
          backgroundColor: neutral17,
          borderColor: neutral33,
          borderWidth: 1,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <SVG height={24} width={24} source={penSVG} color={secondaryColor} />
    </TouchableOpacity>
  );
};
