import * as React from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { primaryColor, primaryTextColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";

export const PrimaryButton: React.FC<{
  text: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  onPress?: () => void;
  big?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
}> = ({ text, style, textStyle, onPress, big, disabled, backgroundColor }) => {
  const height = big ? 56 : 48;
  return (
    <View
      style={[
        { alignItems: "center", opacity: disabled ? 0.5 : undefined },
        style,
      ]}
    >
      <TouchableOpacity
        style={{
          backgroundColor: backgroundColor || primaryColor,
          borderRadius: 6,
          height,
          paddingHorizontal: 20,
          justifyContent: "center",
          width: "100%",
        }}
        onPress={onPress}
        disabled={disabled}
      >
        <BrandText
          style={[
            { color: primaryTextColor, fontSize: 14, textAlign: "center" },
            textStyle,
          ]}
        >
          {text}
        </BrandText>
      </TouchableOpacity>
    </View>
  );
};
