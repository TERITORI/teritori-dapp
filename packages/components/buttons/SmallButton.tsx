import React, { FC } from "react";
import { Pressable } from "react-native";

import { neutral22, primaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const SmallButton: FC<{
  onPress: () => void;
  label: string;
}> = ({ onPress, label }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: primaryColor,
        borderRadius: layout.borderRadius,
        paddingHorizontal: layout.spacing_x0_5,
      }}
    >
      <BrandText
        style={[
          fontSemibold12,
          {
            color: neutral22,
          },
        ]}
      >
        {label}
      </BrandText>
    </Pressable>
  );
};
