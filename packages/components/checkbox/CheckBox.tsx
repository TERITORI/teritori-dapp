import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

import Tick from "../../../assets/icons/tick.svg";
import { neutral17, neutralA3, primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";

type CheckBoxProps = {
  value: boolean;
  disable?: boolean;
  zoom?: number;
  onValueChange?: () => void;
};

export const CheckBox: React.FC<CheckBoxProps> = ({
  value,
  disable,
  zoom = 1,
  onValueChange,
}) => {
  const checkedStyles: ViewStyle = {
    width: zoom * layout.spacing_x2,
    height: zoom * layout.spacing_x2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor,
    borderRadius: 5,
  };
  const uncheckedStyles: ViewStyle = {
    width: zoom * layout.spacing_x2,
    height: zoom * layout.spacing_x2,
    borderWidth: 1,
    borderColor: neutralA3,
    borderRadius: 5,
    backgroundColor: neutral17,
  };

  return (
    <Pressable onPress={disable ? () => {} : onValueChange}>
      <View style={value ? checkedStyles : uncheckedStyles}>
        {value && <SVG source={Tick} height={zoom * 8} width={zoom * 8} />}
      </View>
    </Pressable>
  );
};
