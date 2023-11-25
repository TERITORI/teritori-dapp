import React from "react";
import { TouchableOpacity, View } from "react-native";

import replySVG from "../../../../assets/icons/reply.svg";
import { secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SpacerRow } from "../../spacer";

export const ReplyButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center" }}
      onPress={onPress}
    >
      <View
        style={{
          borderWidth: 1.2,
          borderColor: secondaryColor,
          width: 20,
          height: 20,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
      >
        <SVG source={replySVG} color={secondaryColor} width={12} height={12} />
      </View>
      <SpacerRow size={1.5} />
      <BrandText style={fontSemibold13}>Mention</BrandText>
    </TouchableOpacity>
  );
};
