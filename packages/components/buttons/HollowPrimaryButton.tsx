import * as React from "react";
import {TextStyle, TouchableOpacity, View, ViewStyle} from "react-native"

import { primaryColor } from "../../utils/colors";
import { BrandText } from "../BrandText";

export const HollowPrimaryButton: React.FC<{
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}> = ({ text, style, textStyle }) => {
  const fontSize = 14
  return (
    <View style={[{ alignItems: "center" }, style]}>
      <TouchableOpacity
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
        {/*TODO: letter spacing or not ?*/}
        <BrandText style={[{ color: primaryColor, fontSize, letterSpacing: -(fontSize * 0.04), textAlign: "center" }, textStyle]}>
          {text}
        </BrandText>
      </TouchableOpacity>
    </View>
  )
}