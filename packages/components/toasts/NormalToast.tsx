import React from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";

import warningSVG from "../../../assets/icons/warning.svg";
import {
  errorColor,
  neutral11,
  neutral77,
  successColor,
} from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Box } from "../boxes/Box";
import { SpacerRow } from "../spacer";

const marginHorizontal = 24;

export interface NormalToastProps {
  title: string;
  message?: string;
  onPress?: () => void;
  type?: "error" | "success";
  topOffset?: number;
}

export const NormalToast: React.FC<NormalToastProps> = ({
  title,
  message,
  onPress,
  type,
  topOffset = 24,
}) => {
  const width = 432;
  const { width: windowWidth } = useWindowDimensions();

  const maxWidth = width < windowWidth ? width : windowWidth - marginHorizontal;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        maxWidth,
        width,
        height: "auto",
        position: "absolute",
        top: topOffset,
        left: windowWidth / 2 - maxWidth / 2,
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
          borderColor: type === "error" ? errorColor : successColor,
          borderWidth: 1,
        }}
      >
        {type === "error" && (
          <>
            <SpacerRow size={3} />
            <SVG width={24} height={24} source={warningSVG} />
          </>
        )}
        <SpacerRow size={3} />
        <View
          style={{ width: width - marginHorizontal * 2, marginVertical: 12 }}
        >
          <BrandText style={{ fontSize: 13, lineHeight: 20 }}>
            {title}
          </BrandText>
          {message ? (
            <BrandText
              style={{
                fontSize: 13,
                lineHeight: 15,
                color: neutral77,
                maxWidth: maxWidth - 130,
              }}
            >
              {message}
            </BrandText>
          ) : null}
          <SpacerRow size={3} />
        </View>
      </Box>
    </TouchableOpacity>
  );
};
