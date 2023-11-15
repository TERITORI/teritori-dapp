import React from "react";
import { TouchableOpacity } from "react-native";

import { neutral11, neutral22 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";

export const MoreReactionsButton: React.FC<{
  label: string;
  onPress: () => void;
}> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginHorizontal: layout.spacing_x0_25,
        marginVertical: layout.spacing_x0_25,
        height: 28,
        width: 43,
        paddingRight: layout.spacing_x1,
        paddingLeft: layout.spacing_x0_75,
        backgroundColor: neutral11,
        borderColor: neutral22,
        borderWidth: 1,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BrandText style={fontSemibold13}>{label}</BrandText>
    </TouchableOpacity>
  );
};
