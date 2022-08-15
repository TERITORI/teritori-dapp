import * as React from "react";
import { TextStyle, ViewStyle } from "react-native";

import { neutral30, primaryColor } from "../../utils/style/colors";
import { PrimaryButton } from "./PrimaryButton";

export const DarkButton: React.FC<{
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
  big?: boolean;
  disabled?: boolean;
}> = ({ text, style, textStyle, onPress, big, disabled }) => {
  return (
    <PrimaryButton
      text={text}
      onPress={onPress}
      big={big}
      disabled={disabled}
      backgroundColor={neutral30}
      textStyle={[{ color: primaryColor }, textStyle]}
      style={style}
    />
  );
};
