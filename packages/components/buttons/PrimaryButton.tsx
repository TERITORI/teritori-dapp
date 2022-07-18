import * as React from "react";
import {TextStyle, TouchableOpacity, View, ViewStyle} from "react-native"

import { primaryColor, primaryTextColor } from "../../utils/colors";
import { BrandText } from "../BrandText";

export const PrimaryButton: React.FC<{
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  big?: boolean;
  disabled?: boolean;
}> = ({ text, style, textStyle, onPress, big, disabled }) => {
  const height = big ? 56 : 48;
  const fontSize = 14
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
          width: "100%"
        }}
        onPress={onPress}
        disabled={disabled}
      >
        {/*TODO: letter spacing or not ?*/}
        <BrandText style={[{ color: primaryTextColor, fontSize, letterSpacing: -(fontSize * 0.04), textAlign: "center"}, textStyle]}>
          {text}
        </BrandText>
      </TouchableOpacity>
    </View>
  );
};
