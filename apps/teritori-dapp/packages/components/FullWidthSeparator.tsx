import React from "react";
import { View } from "react-native";

import { neutral33 } from "../utils/style/colors";

export const FullWidthSeparator: React.FC = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: neutral33,
      }}
    />
  );
};
