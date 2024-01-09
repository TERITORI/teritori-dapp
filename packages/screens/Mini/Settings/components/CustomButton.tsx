import React, { ReactNode } from "react";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import {
  blueDefault,
  dangerColor,
  neutral33,
} from "../../../../utils/style/colors";
import { fontSemibold15 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  children?: ReactNode;
  isDisabled?: boolean;
  type?: "primary" | "danger" | "gray";
  size?: "normal" | "medium" | "small";
  style?: StyleProp<ViewStyle>;
  width?: number;
};

export const CustomButton = ({
  onPress,
  children,
  title = "OK",
  isDisabled,
  type = "primary",
  style,
  size = "normal",
  width,
}: Props) => {
  const getbgColor = () => {
    switch (type) {
      case "danger":
        return dangerColor;
      case "primary":
        return blueDefault;
      case "gray":
        return neutral33;
      default:
        return blueDefault;
    }
  };

  const getHeight = () => {
    switch (size) {
      case "small":
        return 32;
      case "medium":
        return 36;
      case "normal":
        return 44;
      default:
        return 44;
    }
  };

  const getVerticalPadding = () => {
    switch (size) {
      case "small":
        return layout.spacing_x0_75;
      case "medium":
        return layout.spacing_x0_5;
      case "normal":
        return layout.spacing_x1_5;
      default:
        return layout.spacing_x1_5;
    }
  };

  return (
    <CustomPressable
      onPress={onPress}
      style={[
        {
          backgroundColor: getbgColor(),
          paddingVertical: getVerticalPadding(),
          borderRadius: 100,
          opacity: isDisabled ? 0.7 : 1,
          height: getHeight(),
          width: width || "100%",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      disabled={isDisabled}
    >
      {children || (
        <BrandText style={[fontSemibold15, { textAlign: "center" }]}>
          {title}
        </BrandText>
      )}
    </CustomPressable>
  );
};
