import React, { ReactNode } from "react";
import {
  DimensionValue,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

import { BrandText } from "@/components/BrandText";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { AppNavigationProp, useAppNavigation } from "@/utils/navigation";
import {
  blueDefault,
  dangerColor,
  neutral33,
  neutral39,
} from "@/utils/style/colors";
import { fontSemibold15 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  onPress: (
    event: GestureResponderEvent,
    navigation: AppNavigationProp,
  ) => void;
  title?: string;
  children?: ReactNode;
  isDisabled?: boolean;
  type?: "primary" | "danger" | "gray" | "outline";
  size?: "normal" | "medium" | "small";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  width?: DimensionValue;
};

export const CustomButton = ({
  onPress,
  children,
  title = "OK",
  isDisabled,
  type = "primary",
  style,
  textStyle,
  size = "normal",
  width,
}: Props) => {
  const navigation = useAppNavigation();

  const getbgColor = () => {
    switch (type) {
      case "danger":
        return dangerColor;
      case "primary":
        return blueDefault;
      case "gray":
        return neutral33;
      case "outline":
        return "transparent";
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
      onPress={(event) => onPress(event, navigation)}
      style={[
        {
          backgroundColor: getbgColor(),
          paddingVertical: getVerticalPadding(),
          borderRadius: 100,
          opacity: isDisabled ? 0.7 : 1,
          height: getHeight(),
          width: width ?? "100%",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: type === "outline" ? 1 : 0,
          borderColor: type === "outline" ? neutral39 : "",
        },
        style,
      ]}
      disabled={isDisabled}
    >
      {children || (
        <BrandText style={[fontSemibold15, { textAlign: "center" }, textStyle]}>
          {title}
        </BrandText>
      )}
    </CustomPressable>
  );
};
