import React from "react";
import { TouchableOpacity } from "react-native";

import { neutral30, primaryColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";

export const SecondaryAltButton: React.FC<{
  onPress?: () => void;
  text: string;
}> = ({ onPress, text }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: neutral30,
        borderRadius: 8,
        paddingHorizontal: 13,
        paddingVertical: 10,
      }}
      onPress={onPress}
    >
      <BrandText style={{ color: primaryColor, fontSize: 14 }}>
        {text}
      </BrandText>
    </TouchableOpacity>
  );
};
