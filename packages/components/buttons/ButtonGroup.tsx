import React from "react";
import { TouchableOpacity, View } from "react-native";

import {
  primaryTextColor,
  primaryColor,
  neutral22,
} from "../../utils/style/colors";
import { BrandText } from "../BrandText";

export interface ButtonItem {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export const ButtonGroup: React.FC<{
  buttons: ButtonItem[];
}> = ({ buttons }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
        },
      ]}
    >
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={button.label}
          onPress={button.onPress}
          style={[
            {
              backgroundColor: button.isActive ? primaryColor : neutral22,
              paddingVertical: 6,
              paddingHorizontal: 11,
            },
            index === 0 && {
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
            },
            index === buttons?.length - 1 && {
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            },
          ]}
        >
          <BrandText
            style={{
              fontSize: 14,
              lineHeight: 16,
              color: button?.isActive ? primaryTextColor : "white",
            }}
          >
            {button.label}
          </BrandText>
        </TouchableOpacity>
      ))}
    </View>
  );
};
