import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import bucketSVG from "../../../assets/icons/bucket.svg";
import { redDefault } from "../../utils/style/colors";
import { SVG } from "../SVG";

interface Props {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const DeleteButton: React.FC<Props> = ({ onPress, style, disabled }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: redDefault,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: -4,
          right: -4,
          zIndex: 9,
          height: 28,
          width: 28,
          borderRadius: 999,
        },
        style,
      ]}
    >
      <SVG source={bucketSVG} height={16} width={16} />
    </TouchableOpacity>
  );
};
