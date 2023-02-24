import React from "react";
import { View } from "react-native";

import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const UserNotFound: React.FC = () => {
  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
        marginTop: layout.padding_x4,
      }}
    >
      <BrandText>User not found</BrandText>
    </View>
  );
};
