import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

import closeSVG from "../../../../assets/icons/close.svg";
import { redDefault } from "../../../utils/style/colors";
import { SVG } from "../../SVG";

interface Props {
  onPress: () => void;
  style?: ViewStyle;
}

export const DeleteButton: React.FC<Props> = ({ onPress, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[
        {
          backgroundColor: redDefault,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: -4,
          right: -4,
          zIndex: 9,
          height: 12,
          width: 12,
          borderRadius: 5,
        },
        style,
      ]}
    >
      <SVG source={closeSVG} height={10} width={10} />
    </TouchableOpacity>
  );
};
