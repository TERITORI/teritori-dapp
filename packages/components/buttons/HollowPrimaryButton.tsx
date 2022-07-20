import * as React from "react";
import {TextStyle, TouchableOpacity, View, ViewStyle} from "react-native"

import { primaryColor } from "../../utils/colors";
import { BrandText } from "../BrandText";

export const HollowPrimaryButton: React.FC<{
  text: string;
  style?: ViewStyle|ViewStyle[];
  textStyle?: TextStyle;
  onPress?: () => void;
}> = ({ text, style, textStyle, onPress }) => {

  return (
    <View style={[{ alignItems: "center" }, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          borderColor: primaryColor,
          borderWidth: 1,
          borderRadius: 6,
          height: 56,
          paddingHorizontal: 20,
          justifyContent: "center",
          width: "100%"
        }}
      >
        <BrandText style={[{ color: primaryColor, fontSize: 14, textAlign: "center" }, textStyle]}>
          {text}
        </BrandText>
      </TouchableOpacity>
    </View>
  )
}