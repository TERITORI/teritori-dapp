import React, { ReactNode } from "react";
import {
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

import ChevronLeftIconSvg from "../../../../../assets/icons/chevron-left.svg";
import ChevronRightIconSvg from "../../../../../assets/icons/chevron-right-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SpacerRow } from "../../../../components/spacer";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontSemibold13, fontSemibold22 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type IconOptionsType = {
  icon?: React.FC<SvgProps> | string;
  iconSize?: number;
  iconStyle?: StyleProp<ImageStyle>;
  fill?: string;
};

type ListViewProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
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
    bottomLabel?: string;
  };
};

export default function ListView({
  onPress,
  style,
  options = {
    label: "",
    labelStyle: {},
    leftLabel: "",
    leftLabelStyle: {},
    rightLabel: "",
    rightLabelStyle: {},
    leftIconEnabled: false,
    iconEnabled: true,
    iconOptions: {},
    leftIconOptions: {},
    bottomLabel: "",
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
    bottomLabel,
  } = options;

  const DEFAULT_ICON_SIZE = 22;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: layout.spacing_x1_5,
          },
          style,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {leftIconEnabled && (
            <>
              <SVG
                source={leftIconOptions?.icon ?? ChevronLeftIconSvg}
                style={leftIconOptions?.iconStyle ?? {}}
                fill={leftIconOptions?.fill ?? ""}
                width={leftIconOptions?.iconSize ?? DEFAULT_ICON_SIZE}
                height={leftIconOptions?.iconSize ?? DEFAULT_ICON_SIZE}
              />
              <SpacerRow size={2} />
            </>
          )}

          <View>
            <View style={{ flexDirection: "row" }}>
              {typeof label === "string" ? (
                <>
                  <BrandText style={labelStyle ?? fontSemibold22}>
                    {label}
                  </BrandText>
                </>
              ) : (
                label
              )}

              {typeof leftLabel === "string" ? (
                <>
                  <SpacerRow size={1} />
                  <BrandText
                    style={
                      leftLabelStyle ?? [fontSemibold13, { color: neutralA3 }]
                    }
                  >
                    {leftLabel}
                  </BrandText>
                </>
              ) : (
                leftLabel
              )}
            </View>

            {bottomLabel && (
              <>
                <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                  {bottomLabel}
                </BrandText>
              </>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {typeof rightLabel === "string" ? (
            <>
              <BrandText
                style={
                  rightLabelStyle ?? [fontSemibold13, { color: neutralA3 }]
                }
              >
                {rightLabel}
              </BrandText>
              {iconEnabled && <SpacerRow size={1} />}
            </>
          ) : (
            rightLabel
          )}
          {iconEnabled ?? (
            <SVG
              source={iconOptions?.icon ?? ChevronRightIconSvg}
              style={iconOptions?.iconStyle ?? {}}
              fill={iconOptions?.fill ?? ""}
              width={iconOptions?.iconSize ?? DEFAULT_ICON_SIZE}
              height={iconOptions?.iconSize ?? DEFAULT_ICON_SIZE}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
