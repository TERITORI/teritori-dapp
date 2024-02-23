import React from "react";
import { View, useWindowDimensions } from "react-native";

import { Spinner } from "./Spinner";
import { CustomPressable } from "./buttons/CustomPressable";

import checkWhiteSVG from "@/assets/icons/toast/check-circular-white.svg";
import checkSVG from "@/assets/icons/toast/check-green.svg";
import crossRedSVG from "@/assets/icons/toast/cross-red.svg";
import crossWhiteSVG from "@/assets/icons/toast/cross-white.svg";
import infoBlueSVG from "@/assets/icons/toast/info-circle-blue.svg";
import infoWhiteSVG from "@/assets/icons/toast/info-circle-white.svg";
import loaderBlueSVG from "@/assets/icons/toast/loader-blue.svg";
import loaderWhiteSVG from "@/assets/icons/toast/loader-white.svg";
import warningOrangeSVG from "@/assets/icons/toast/warning-orange.svg";
import warningWhiteSVG from "@/assets/icons/toast/warning-white.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import {
  blueDefault,
  neutral00,
  toastGreen,
  toastOrange,
  toastRed,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type ToastStatusType = "info" | "success" | "error" | "warning" | "loading";
type ToastVariantType = "solid" | "outline";

export type MiniToastProps = {
  status?: ToastStatusType;
  message: string | null;
  variant?: ToastVariantType;
  duration?: number;
  topOffset?: number;
  showAlways?: boolean;
  onPress?: () => void;
};

const getColors = (status: ToastStatusType) => {
  switch (status) {
    case "error":
      return toastRed;
    case "success":
      return toastGreen;
    case "warning":
      return toastOrange;
    case "loading":
      return blueDefault;
    default:
      return blueDefault;
  }
};

const getIcons = (status: ToastStatusType, variant: ToastVariantType) => {
  switch (status) {
    case "error":
      return variant === "outline" ? crossRedSVG : crossWhiteSVG;
    case "success":
      return variant === "outline" ? checkSVG : checkWhiteSVG;
    case "warning":
      return variant === "outline" ? warningOrangeSVG : warningWhiteSVG;
    case "loading":
      return variant === "outline" ? loaderBlueSVG : loaderWhiteSVG;
    default:
      return variant === "outline" ? infoBlueSVG : infoWhiteSVG;
  }
};
export const MiniToast = ({
  status = "info",
  message,
  variant = "solid",
  topOffset = 70,
  onPress,
}: MiniToastProps) => {
  const { width: windowWidth } = useWindowDimensions();

  if (!message) {
    return null;
  }

  const onToastPress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <CustomPressable
      onPress={onToastPress}
      style={{
        position: "absolute",
        top: topOffset || 70,
        maxWidth: windowWidth - 40,
        zIndex: 50000,
        alignSelf: "center",
      }}
    >
      <View
        style={{
          backgroundColor:
            variant === "outline" ? neutral00 : getColors(status),
          borderColor: getColors(status),
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: variant === "outline" ? 32 : 10,
          paddingHorizontal: layout.spacing_x2,
          paddingVertical: layout.spacing_x1_5,
          flexDirection: "row",
          gap: layout.spacing_x1,
        }}
      >
        {status === "loading" ? (
          <Spinner svg={getIcons(status, variant)} size={16} />
        ) : (
          <SVG
            source={getIcons(status, variant)}
            height={16}
            width={16}
            style={{ flexShrink: 0 }}
          />
        )}
        <BrandText
          style={[
            fontSemibold14,
            {
              lineHeight: 16,
              paddingRight: layout.spacing_x2,
              maxWidth: "100%",
            },
          ]}
        >
          {message}
        </BrandText>
      </View>
    </CustomPressable>
  );
};
