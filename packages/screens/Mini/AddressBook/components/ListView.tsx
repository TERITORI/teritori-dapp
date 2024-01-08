import React, { ReactNode } from "react";
import { ImageStyle, StyleProp, TextStyle, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

import ChevronLeftIconSvg from "../../../../../assets/icons/chevron-left.svg";
import ChevronRightIconSvg from "../../../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { fontSemibold22 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type IconOptionsType = {
  icon?: React.FC<SvgProps> | string;
  iconSize?: number;
  iconStyle?: StyleProp<ImageStyle>;
};

type ListViewProps = {
  onPress?: () => void;
  options?: {
    label?: string;
    labelStyle?: StyleProp<TextStyle>;
    iconOptions?: IconOptionsType;
    leftIconOptions?: IconOptionsType;
    leftIconEnabled?: boolean;
    iconEnabled?: boolean;
    leftLabel?: string | ReactNode;
    leftLabelStyle?: StyleProp<TextStyle>;
    rightLabel?: string | ReactNode;
    rightLabelStyle?: StyleProp<TextStyle>;
  };
};

export default function ListView({
  onPress,
  options = {
    label: "",
    labelStyle: fontSemibold22,
    leftLabel: "",
    leftLabelStyle: {},
    rightLabel: "",
    rightLabelStyle: {},
    leftIconEnabled: false,
    iconEnabled: true,
    iconOptions: {},
    leftIconOptions: {},
  },
}: ListViewProps) {
  const {
    label,
    labelStyle,
    leftLabel,
    leftLabelStyle,
    rightLabel,
    rightLabelStyle,
    iconOptions,
    leftIconOptions,
    iconEnabled,
    leftIconEnabled,
  } = options;

  const DEFAULT_ICON_SIZE = 24;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: layout.spacing_x1_5,
          paddingHorizontal: layout.spacing_x1_5,
        }}
      >
        <View>
          {leftIconEnabled && (
            <SVGorImageIcon
              icon={leftIconOptions?.icon ?? ChevronLeftIconSvg}
              style={leftIconOptions?.iconStyle ?? {}}
              iconSize={leftIconOptions?.iconSize ?? DEFAULT_ICON_SIZE}
            />
          )}

          {typeof label === "string" ? (
            <BrandText style={labelStyle}>{label}</BrandText>
          ) : (
            label
          )}

          {typeof leftLabel === "string" ? (
            <BrandText style={leftLabelStyle}>{leftLabel}</BrandText>
          ) : (
            leftLabel
          )}
        </View>

        <View>
          {typeof rightLabel === "string" ? (
            <BrandText style={rightLabelStyle}>{rightLabel}</BrandText>
          ) : (
            rightLabel
          )}
          {iconEnabled ?? (
            <SVGorImageIcon
              icon={iconOptions?.icon ?? ChevronRightIconSvg}
              style={iconOptions?.iconStyle ?? {}}
              iconSize={iconOptions?.iconSize ?? DEFAULT_ICON_SIZE}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
