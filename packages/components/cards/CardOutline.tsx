import React from "react";
import { ViewStyle, View, StyleProp } from "react-native";

import { neutral33 } from "../../utils/style/colors";

export const CardOutline: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => {
  return (
    <View
      style={[
        {
          borderColor: neutral33,
          borderWidth: 1,
          borderRadius: 8,
        },
        style,
      ]}
    >
      <>{children}</>
    </View>
  );
};
