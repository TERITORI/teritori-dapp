import * as React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { primaryTextColor } from "../../utils/colors";
import { BrandText } from "../BrandText";

export const SecondaryButton: React.FC<{
  text: string;
  style?: ViewStyle;
  onPress?: () => void;
}> = ({ text, style, onPress }) => (
  <View style={[{ alignItems: "center" }, style]}>
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "white",
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 12,
      }}
    >
      <BrandText style={{ color: primaryTextColor, fontSize: 14 }}>
        {text}
      </BrandText>
    </TouchableOpacity>
  </View>
);
