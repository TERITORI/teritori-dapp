import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import checkBoxSVG from "../../../../assets/icons/checkbox-mini.svg";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { blueDefault, neutralA3 } from "../../../utils/style/colors";

type Props = {
  isChecked?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export const Checkbox = ({ isChecked = false, style, onPress }: Props) => {
  return (
    <CustomPressable onPress={onPress}>
      <View
        style={[
          {
            width: 20,
            height: 20,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: neutralA3,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
          },
          isChecked && {
            backgroundColor: blueDefault,
            borderColor: blueDefault,
          },
          style,
        ]}
      >
        {isChecked && <SVG source={checkBoxSVG} width={20} height={20} />}
      </View>
    </CustomPressable>
  );
};
