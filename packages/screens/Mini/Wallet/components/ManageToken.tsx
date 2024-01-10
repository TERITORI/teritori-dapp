import React, { FC } from "react";
import { Switch, View } from "react-native";
import { SvgProps } from "react-native-svg";

import questionSVG from "../../../../../assets/icons/question-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import {
  blueDefault,
  neutral33,
  neutral39,
  neutral99,
  neutralA3,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14, fontSemibold22 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type Props = {
  icon: string | FC<SvgProps>;
  title: string;
  tori: number;
  suffix?: string;
  showSwitch?: boolean;
  isEnabled?: boolean;
  onToggleSwitch?: () => void;
};

export const ManageToken = ({
  icon,
  title,
  tori,
  showSwitch = true,
  suffix = "TORI",
  isEnabled,
  onToggleSwitch,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: layout.spacing_x1_5,
        marginVertical: layout.spacing_x1,
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
          <BrandText style={[fontSemibold22, {}]}>{title}</BrandText>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1_5,
        }}
      >
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          {tori.toLocaleString()} {suffix}
        </BrandText>
        {showSwitch && (
          <Switch
            value={isEnabled}
            onChange={onToggleSwitch}
            trackColor={{ false: neutral33, true: blueDefault }}
            thumbColor={!isEnabled ? neutral99 : secondaryColor}
            ios_backgroundColor={isEnabled ? blueDefault : neutral33}
          />
        )}
      </View>
    </View>
  );
};
