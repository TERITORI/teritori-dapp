import React from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { neutral22, primaryColor } from "@/utils/style/colors";
import { fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const GovernanceTitle: React.FC<{
  titleColor?: string;
  borderColor?: string;
  title: string;
  hasBorder?: boolean;
  iconSVG: React.FC<SvgProps>;
}> = ({
  titleColor = primaryColor,
  title,
  hasBorder = false,
  iconSVG,
  borderColor,
}) => {
  return (
    <>
      <View style={{ flexDirection: "row", gap: layout.spacing_x0_5 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: layout.spacing_x0_5,
            paddingRight: layout.spacing_x1,
            paddingLeft: layout.spacing_x0_5,
            backgroundColor: neutral22,
            borderRadius: layout.spacing_x0_75,
            borderWidth: hasBorder ? 1 : 0,
            gap: layout.spacing_x0_25,
            maxWidth: 108,
            borderColor,
          }}
        >
          <SVG source={iconSVG} width={14} height={14} />

          <BrandText
            style={[
              fontSemibold12,
              {
                paddingLeft: layout.spacing_x0_5,
                color: titleColor,
              },
            ]}
          >
            {title}
          </BrandText>
        </View>
      </View>
    </>
  );
};
