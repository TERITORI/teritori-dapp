import React from "react";
import { View, ViewStyle, StyleProp, TouchableOpacity } from "react-native";

import backSVG from "../../assets/icons/back.svg";
import { neutral22, neutral33 } from "../utils/style/colors";
import {
  headerHeight,
  screenContainerContentMarginHorizontal,
} from "../utils/style/layout";
import { SVG } from "./SVG";

export const Header: React.FC<{
  smallMargin?: boolean;
  style?: StyleProp<ViewStyle>;
  onBackPress?: () => void;
}> = ({ children, style, onBackPress }) => {
  return (
    <View
      style={[
        {
          height: headerHeight,
          maxHeight: headerHeight,
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginLeft: screenContainerContentMarginHorizontal,
        }}
      >
        {!!onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            activeOpacity={0.9}
            style={{
              backgroundColor: neutral22,
              height: 32,
              width: 32,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <SVG source={backSVG} height={24} width={24} />
          </TouchableOpacity>
        )}
        {children}
      </View>

      {/* Wallet selector placeholder */}
      <View />
    </View>
  );
};
