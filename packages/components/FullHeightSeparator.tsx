import React from "react";
import { View } from "react-native";

import { neutral33 } from "../utils/style/colors";

export const FullHeightSeparator: React.FC = () => {
  return (
    <View
      style={{
        width: 1,
        height: "100%",
        backgroundColor: neutral33,
      }}
    />
  );
};
