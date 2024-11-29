import React from "react";
import { TouchableOpacity, View } from "react-native";

import penSVG from "@/assets/icons/pen.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { neutral17, neutral33, secondaryColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const CreateShortPostButton: React.FC<{
  label: string;
  onPress?: () => void;
}> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: neutral17,
        borderWidth: 1,
        borderColor: neutral33,
        borderRadius: 999,
        paddingLeft: layout.spacing_x1_5,
        paddingRight: layout.spacing_x2,
        height: 42,
      }}
      onPress={onPress}
    >
      <SVG source={penSVG} width={24} height={24} color={secondaryColor} />
      <View
        style={{
          marginLeft: layout.spacing_x1,
        }}
      >
        <BrandText style={fontSemibold14}>{label}</BrandText>
      </View>
    </TouchableOpacity>
  );
};
