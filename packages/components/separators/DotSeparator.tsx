import React, { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { neutral77 } from "../../utils/style/colors";

export const DotSeparator: FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  return (
    <View
      style={[
        {
          backgroundColor: neutral77,
          height: 2,
          width: 2,
          borderRadius: 999,
        },
        style,
      ]}
    />
  );
};
