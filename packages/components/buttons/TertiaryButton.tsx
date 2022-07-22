import * as React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { BrandText } from "../BrandText";

export const TertiaryButton: React.FC<{
  text: string;
  style?: ViewStyle;
  onPress?: () => void;
}> = ({ text, style, onPress }) => (
  <View style={[{ alignItems: "center" }, style]}>
    <TouchableOpacity
      style={{
        backgroundColor: "#222222",
        borderColor: "#3D3D3D",
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 12,
      }}
      onPress={onPress}
    >
      <BrandText style={{ color: "white", fontSize: 14 }}>{text}</BrandText>
    </TouchableOpacity>
  </View>
);
