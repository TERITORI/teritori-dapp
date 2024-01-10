import * as Clipboard from "expo-clipboard";
import React, { FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import chevronRightSVG from "../../../../../assets/icons/chevron-right-gray.svg";
import copySVG from "../../../../../assets/icons/copy-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type Props = {
  icon: string | FC<SvgProps>;
  title: string;
  code: string;
  tori: number;
  dollar: number;
  onPress: () => void;
};

export const AddedTokens = ({
  code,
  dollar,
  icon,
  onPress,
  title,
  tori,
}: Props) => {
  const onCopyPrivateKeyPress = async () => {
    await Clipboard.setStringAsync(
      JSON.stringify({
        code,
        dollar,
        icon,
        onPress,
        title,
        tori,
      }),
    );
    alert("Copied");
  };

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
        <SVGorImageIcon icon={icon} iconSize={24} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x0_5,
          }}
        >
          <BrandText style={[fontSemibold14, {}]}>{title}</BrandText>
          <BrandText style={[fontMedium13, { color: neutralA3 }]}>
            {code}
          </BrandText>
          <CustomPressable onPress={onCopyPrivateKeyPress}>
            <SVG source={copySVG} height={16} width={16} />
          </CustomPressable>
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
        <BrandText style={[fontSemibold14, {}]}>
          {tori.toLocaleString()}
        </BrandText>
        <BrandText style={[fontMedium13, { color: neutralA3 }]}>
          ${dollar.toLocaleString()}
        </BrandText>
        <SVG source={chevronRightSVG} height={16} width={16} />
      </CustomPressable>
    </View>
  );
};
