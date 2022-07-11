import * as React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { primaryColor, primaryTextColor } from "../../utils/colors";
import { BrandText } from "../BrandText";

export const PrimaryButton: React.FC<{
  text: string;
  style?: ViewStyle;
  onPress?: () => void;
  big?: boolean;
  disabled?: boolean;
}> = ({ text, style, onPress, big, disabled }) => {
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
          backgroundColor: primaryColor,
          borderRadius: 6,
          height,
          paddingHorizontal: 20,
          justifyContent: "center",
        }}
        onPress={onPress}
        disabled={disabled}
      >
        <BrandText style={{ color: primaryTextColor, fontSize: 14 }}>
          {text}
        </BrandText>
      </TouchableOpacity>
    </View>
  );
};
