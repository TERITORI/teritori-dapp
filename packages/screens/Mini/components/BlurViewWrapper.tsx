import { BlurView, BlurViewProps } from "expo-blur";
import { PropsWithChildren } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import eyeClosedSVG from "../../../../assets/icons/eye-closed.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { neutral09 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface BlurViewWrapperProps extends BlurViewProps {
  show?: boolean;
  style?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  icon?: React.FC<SvgProps> | string;
  showIcon?: boolean;
  iconSize?: number;
}

export default function BlurViewWrapper({
  show = true,
  wrapperStyle,
  style,
  label,
  labelStyle,
  icon,
  showIcon = true,
  iconSize,
  children,
  ...rest
}: PropsWithChildren<BlurViewWrapperProps>) {
  const ICON_SIZE = iconSize ?? 20;

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.20)",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: layout.borderRadius,
          paddingHorizontal: layout.spacing_x5,
          paddingVertical: layout.spacing_x4,
          backgroundColor: neutral09,
        },
        wrapperStyle,
      ]}
    >
      {children}

      {!show && (
        <BlurView
          intensity={30}
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: layout.borderRadius,
            },
            style,
          ]}
          {...rest}
        >
          {showIcon && (
            <SVG
              source={icon ?? eyeClosedSVG}
              height={ICON_SIZE}
              width={ICON_SIZE}
            />
          )}
          <SpacerColumn size={1.5} />
          <BrandText style={[fontSemibold13, labelStyle]}>
            {label ?? "Make sure no one is watching your screen"}
          </BrandText>
        </BlurView>
      )}
    </View>
  );
}
