import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { neutral33 } from "../utils/style/colors";
import {
  headerHeight,
  layout,
  screenContainerContentMarginHorizontal,
} from "../utils/style/layout";
import { BackButton } from "./navigation/components/BackButton";

export const Header: React.FC<{
  isHeaderSmallMargin?: boolean;
  style?: StyleProp<ViewStyle>;
  onBackPress?: () => void;
}> = ({ children, style, isHeaderSmallMargin, onBackPress }) => {
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
          marginLeft: isHeaderSmallMargin
            ? layout.contentPadding
            : screenContainerContentMarginHorizontal,
        }}
      >
        {onBackPress && <BackButton onPress={onBackPress} />}
        {children}
      </View>

      {/* Wallet selector placeholder */}
      <View />
    </View>
  );
};
