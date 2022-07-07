import * as React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { primaryColor } from "../../utils/colors";
import { BrandText } from "../BrandText";

export const HollowPrimaryButton: React.FC<{
  text: string;
  style?: ViewStyle;
}> = ({ text, style }) => (
  <View style={[{ alignItems: "center" }, style]}>
    <TouchableOpacity
      style={{
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 6,
        height: 56,
        paddingHorizontal: 20,
        justifyContent: "center",
      }}
    >
      <BrandText style={{ color: primaryColor, fontSize: 14 }}>
        {text}
      </BrandText>
    </TouchableOpacity>
  </View>
);
