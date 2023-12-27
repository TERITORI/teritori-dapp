import React from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import warningSVG from "../../../assets/icons/warning.svg";
import {
  errorColor,
  neutral11,
  neutral77,
  successColor,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Box } from "../boxes/Box";
import { SpacerRow } from "../spacer";

const TOAST_WIDTH = 432;

export type ToastType = "error" | "success";

const getColorByType = (type: ToastType) => {
  switch (type) {
    case "success":
      return successColor;
    case "error":
      return errorColor;
  }
};

export const Toast: React.FC<{
  title: string;
  message?: string;
  onPress: () => void;
  type: ToastType;
}> = ({ title, message, onPress, type }) => {
  const { width } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        maxWidth: width,
        width,
        height: "auto",
        position: "absolute",
        top: insets.top + layout.spacing_x1,
        left: width / 2 - Math.min(TOAST_WIDTH, width) / 2,
        zIndex: 999,
      }}
    >
      <Box
        notched
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: neutral11,
          borderColor: getColorByType(type),
          borderWidth: 1,
        }}
      >
        <SpacerRow size={3} />
        {type === "error" && <SVG width={24} height={24} source={warningSVG} />}
        <SpacerRow size={3} />
        <View style={{ maxWidth: 287, marginVertical: 12 }}>
          <BrandText style={{ fontSize: 13, lineHeight: 20 }}>
            {title}
          </BrandText>
          <BrandText style={{ fontSize: 13, lineHeight: 15, color: neutral77 }}>
            {message}
          </BrandText>
        </View>
      </Box>
    </TouchableOpacity>
  );
};
