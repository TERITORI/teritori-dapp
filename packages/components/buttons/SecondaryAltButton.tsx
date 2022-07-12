import React from "react";
import { TouchableOpacity } from "react-native";

import { primaryColor } from "../../utils/colors";
import { BrandText } from "../BrandText";

export const SecondaryAltButton: React.FC<{
  onPress?: () => void;
  text: string;
}> = ({ onPress, text }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#2B2B33",
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
