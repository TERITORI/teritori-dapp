import React from "react";
import { View } from "react-native";

import { BrandText } from "./BrandText";

export const ComingSoon: React.FC = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <BrandText>Coming Soon</BrandText>
    </View>
  );
};
