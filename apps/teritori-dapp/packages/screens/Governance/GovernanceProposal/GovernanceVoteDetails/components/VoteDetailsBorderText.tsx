import React from "react";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { neutral00, neutral22 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const VoteDetailsBorderText: React.FC<{
  title: string;
  percentage: number;
  color: string;
  isBorder: boolean;
  onPress: (item: string) => void;
}> = ({ title, percentage, color, isBorder, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(title);
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: layout.spacing_x1_5,
        backgroundColor: neutral22,
        borderColor: color,
        borderRadius: layout.spacing_x0_75,
        height: 48,
        borderWidth: isBorder ? 1 : 0,
        minWidth: 202,
        gap: layout.spacing_x1,
        justifyContent: "center",
      }}
    >
      <BrandText
        style={[
          fontSemibold14,
          {
            paddingLeft: layout.spacing_x0_5,
            color,
          },
        ]}
      >
        {title}
      </BrandText>
      <View
        style={{
          backgroundColor: color,
          width: 65,
          height: 24,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 32,
        }}
      >
        <BrandText
          style={[
            fontSemibold14,
            {
              paddingLeft: layout.spacing_x0_5,
              color: neutral00,
            },
          ]}
        >
          {`${percentage}%`}
        </BrandText>
      </View>
    </TouchableOpacity>
  );
};
