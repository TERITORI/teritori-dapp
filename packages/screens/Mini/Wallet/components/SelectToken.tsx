import React, { FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import chevronRightSVG from "../../../../../assets/icons/chevron-right-gray.svg";
import questionSVG from "../../../../../assets/icons/question-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { neutral39, neutralA3 } from "../../../../utils/style/colors";
import { fontSemibold13, fontSemibold16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type Props = {
  icon: string | FC<SvgProps>;
  title: string;
  tori: number;
  suffix?: string;
  onPress: () => void;
};

export const SelectToken = ({
  icon,
  onPress,
  title,
  tori,
  suffix = "TORI",
}: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: layout.spacing_x1_5,
        marginVertical: layout.spacing_x1_5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1_5,
        }}
      >
        <View
          style={{
            backgroundColor: !icon ? neutral39 : "transparent",
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
          }}
        >
          <SVGorImageIcon
            icon={icon || questionSVG}
            iconSize={icon ? 24 : 18}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x0_5,
          }}
        >
          <BrandText style={[fontSemibold16, {}]}>{title}</BrandText>
        </View>
      </View>
      <CustomPressable
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x0_5,
        }}
      >
        <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
          {tori.toLocaleString()} {suffix}
        </BrandText>

        <SVG source={chevronRightSVG} height={24} width={24} />
      </CustomPressable>
    </View>
  );
};
