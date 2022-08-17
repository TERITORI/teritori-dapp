import * as React from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { primaryColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";

export const HollowPrimaryButton: React.FC<{
  text: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
}> = ({ text, style, textStyle, disabled, onPress }) => {
  return (
    <View
      style={[{ alignItems: "center" }, disabled && { opacity: 0.5 }, style]}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{
          borderColor: primaryColor,
          borderWidth: 1,
          borderRadius: 6,
          height: 56,
          paddingHorizontal: 20,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <BrandText
          style={[
            { color: primaryColor, fontSize: 14, textAlign: "center" },
            textStyle,
          ]}
        >
          {text}
        </BrandText>
      </TouchableOpacity>
    </View>
  );
};
