import React from "react";
import { TouchableOpacity } from "react-native";

import chevronRightSVG from "../../../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { useTheme } from "../../../../hooks/useTheme";
import { fontMedium14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export const ShowMoreButton: React.FC = () => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 32,
        width: 121,
      }}
    >
      <BrandText style={[fontMedium14]}>Show more</BrandText>
      <SVG
        color={theme.textColor}
        source={chevronRightSVG}
        style={{ width: 16, marginLeft: layout.spacing_x1 }}
      />
    </TouchableOpacity>
  );
};
