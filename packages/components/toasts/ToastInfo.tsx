import React from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";

import closeSVG from "../../../assets/icons/close.svg";
import infoSVG from "../../../assets/icons/info-blue.svg";
import { blueDefault, yankeesBlue } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";

export const ToastInfo: React.FC<{
  onCrossPress?: () => void;
  message?: React.ReactNode;
  onPress: () => void;
  position?: {
    top: number;
    left: number;
  };
}> = ({
  message,
  onPress,
  position = { left: 10, top: -60 },
  onCrossPress,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const width = windowWidth - 20;
  const marginHorizontal = 12;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: yankeesBlue,
        borderColor: blueDefault,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        width,
        maxWidth: width,
        height: "auto",
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 9999999,
      }}
    >
      <View
        style={{
          width: width - marginHorizontal * 2,
          marginVertical: layout.spacing_x1_5,
          marginHorizontal,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x1,
          }}
        >
          <SVG source={infoSVG} height={24} width={24} />
          {message}
        </View>
        <TouchableOpacity
          onPress={onCrossPress}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.20)",
            borderRadius: 12,
            padding: 6,
          }}
        >
          <SVG source={closeSVG} height={12} width={12} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
